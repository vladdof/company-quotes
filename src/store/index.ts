import { createStore } from 'vuex';
import http from '@/lib/http-common';
import { setLoading } from '@/lib/set-loading';
import axios from 'axios';
import { IStore, IStocks, INews, GetStocksResponse } from '@/models';

import { StockService } from '@/lib/storage-service';

const stockStorage = new StockService();

const SCREENER_LIMIT = 20;
const SCREENER_MIN_MARKET_CAP = 50000000000;
const POLL_INTERVAL_MS = 60000;
const BATCH_QUOTE_SIZE = 50;

const TOP_20_POPULAR_STOCKS = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA',
  'JPM', 'V', 'UNH', 'JNJ', 'MA', 'XOM', 'PG', 'HD', 'CVX', 'ABBV', 'MRK', 'PEP', 'WMT',
];

const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark') || 'light';

export default createStore<IStore>({
  state: {
    stocks: [],
    fx: [],
    quote: [],
    forex: {},
    isLoading: false,
    favorites: JSON.parse(localStorage.getItem('favorites') || '[]') as string[],
    theme: savedTheme,
    sortBy: 'name',
    sortDir: 'asc',
    news: [],
    isLoadingNews: false,
    pollingIntervalId: null,
  },
  getters: {
    isLoading(state) {
      return state.isLoading;
    },
    getStocks(state) {
      return state.stocks;
    },
    getFx(state) {
      return state.fx;
    },
    getQuote(state) {
      return state.quote;
    },
    getForex(state) {
      return state.forex;
    },
    getFavorites(state) {
      return state.favorites;
    },
    isFavorite: (state) => (symbol: string) => {
      return state.favorites.includes(symbol);
    },
    getTheme(state) {
      return state.theme;
    },
    getSortBy(state) {
      return state.sortBy;
    },
    getSortDir(state) {
      return state.sortDir;
    },
    getSortedStocks(state) {
      const stocks = [...(state.stocks as IStocks[])];
      stocks.sort((a, b) => {
        let cmp = 0;
        if (state.sortBy === 'name') {
          cmp = (a.companyName || '').localeCompare(b.companyName || '');
        } else if (state.sortBy === 'price') {
          cmp = parseFloat(String(a.price)) - parseFloat(String(b.price));
        } else if (state.sortBy === 'change') {
          cmp = (a.changes ?? 0) - (b.changes ?? 0);
        }
        return state.sortDir === 'asc' ? cmp : -cmp;
      });
      return stocks;
    },
    getNews(state) {
      return state.news;
    },
    isLoadingNews(state) {
      return state.isLoadingNews;
    },
  },
  mutations: {
    setDefaultStocks(state) {
      state.stocks = [];
    },
    addStocks(state, data): void {
      state.stocks.push(data);
    },
    updateStockPrices(state, quotes: Array<{ symbol: string; price: number; change: number; changesPercentage: number }>) {
      quotes.forEach((q) => {
        const idx = (state.stocks as IStocks[]).findIndex((s) => s.symbol === q.symbol);
        if (idx !== -1) {
          (state.stocks as IStocks[])[idx] = {
            ...(state.stocks as IStocks[])[idx],
            price: String(q.price),
            changes: q.change,
            changesPercentage: q.changesPercentage,
          };
        }
      });
    },
    updateStockSparkline(state, { symbol, sparkline }: { symbol: string; sparkline: number[] }) {
      const idx = (state.stocks as IStocks[]).findIndex((s) => s.symbol === symbol);
      if (idx !== -1) {
        (state.stocks as IStocks[])[idx] = {
          ...(state.stocks as IStocks[])[idx],
          sparkline,
        };
      }
    },
    addFx(state, data): void {
      state.fx.push(data);
    },
    addQuote(state, data): void {
      state.quote.push(data);
    },
    addForex(state, data: {}): void {
      state.forex = {
        data
      };
    },
    setLoading(state, isLoading) {
      state.isLoading = isLoading;
    },
    toggleFavorite(state, symbol: string) {
      const index = state.favorites.indexOf(symbol);
      if (index === -1) {
        state.favorites.push(symbol);
      } else {
        state.favorites.splice(index, 1);
      }
      localStorage.setItem('favorites', JSON.stringify(state.favorites));
    },
    setTheme(state, theme: 'light' | 'dark') {
      state.theme = theme;
      localStorage.setItem('theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    setSortBy(state, sortBy: 'name' | 'price' | 'change') {
      if (state.sortBy === sortBy) {
        state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        state.sortBy = sortBy;
        state.sortDir = 'asc';
      }
    },
    setNews(state, news: INews[]) {
      state.news = news;
    },
    setLoadingNews(state, loading: boolean) {
      state.isLoadingNews = loading;
    },
    setPollingIntervalId(state, id: number | null) {
      state.pollingIntervalId = id;
    },
  },
  actions: {
    async fetchStockList({ commit, dispatch, state }) {
      const favorites = state.favorites as string[];
      commit('setDefaultStocks');
      await setLoading(async () => {
        let screenerSuccess = false;
        try {
          const { data } = await http.get('stock-screener', {
            params: {
              marketCapMoreThan: SCREENER_MIN_MARKET_CAP,
              isActivelyTrading: true,
              exchange: 'NYSE,NASDAQ',
              limit: SCREENER_LIMIT,
            },
          });
          if (Array.isArray(data) && data.length > 0) {
            const stocks: IStocks[] = (data as Array<Record<string, unknown>>).map((item) => ({
              symbol: item.symbol as string,
              companyName: item.companyName as string,
              price: String(item.price ?? ''),
              image: `https://financialmodelingprep.com/image-stock/${item.symbol}.png`,
              sector: item.sector as string | undefined,
              industry: item.industry as string | undefined,
              exchange: item.exchange as string | undefined,
              country: item.country as string | undefined,
              marketCap: item.marketCap as number | undefined,
              mktCap: item.marketCap as number | undefined,
              changes: undefined,
              changesPercentage: undefined,
            }));
            stocks.forEach((stock) => commit('addStocks', stock));
            screenerSuccess = true;
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error('fetchStockList -- screener error: ', error.message);
          } else {
            console.error('fetchStockList -- unexpected error: ', error);
          }
        }

        if (!screenerSuccess) {
          // Screener failed or returned no data: load top 20 popular stocks + favorites from cache/API
          const symbolsToLoad = [...new Set([...TOP_20_POPULAR_STOCKS, ...favorites])];
          for (const symbol of symbolsToLoad) {
            const cached = stockStorage.get(symbol);
            if (cached && cached !== 'undefined') {
              commit('addStocks', cached);
            } else {
              try {
                const { data } = await http.get<GetStocksResponse>(`profile/${symbol}`);
                if (data && data[0]) {
                  commit('addStocks', data[0]);
                  stockStorage.set(symbol, data[0]);
                }
              } catch (e) {
                console.error(`fetchStockList -- error loading ${symbol}: `, e);
              }
            }
          }
        } else {
          // Screener succeeded: also ensure any favorites not in the list are loaded
          const loadedSymbols = new Set((state.stocks as IStocks[]).map((s) => s.symbol));
          for (const symbol of favorites) {
            if (!loadedSymbols.has(symbol)) {
              const cached = stockStorage.get(symbol);
              if (cached && cached !== 'undefined') {
                commit('addStocks', cached);
              } else {
                try {
                  const { data } = await http.get<GetStocksResponse>(`profile/${symbol}`);
                  if (data && data[0]) {
                    commit('addStocks', data[0]);
                    stockStorage.set(symbol, data[0]);
                  }
                } catch (e) {
                  console.error(`fetchStockList -- error loading favorite ${symbol}: `, e);
                }
              }
            }
          }
        }

        dispatch('refreshPrices');
      }, commit, 'setLoading');
    },
    async fetchDataStocks({ commit }, companies) {
      commit('setDefaultStocks');
      const payload = typeof companies === 'string' ? [companies] : (companies.value ?? companies);

      await setLoading(async () => {
        try {
          for (const symbol of payload) {
            const stock = stockStorage.get(symbol);

            if (stock !== 'undefined' && stock) {
              commit('addStocks', stock);
            } else {
              const { data } = await http.get<GetStocksResponse>(`profile/${symbol}`);
              commit('addStocks', data[0]);
              stockStorage.set(symbol, data[0]);
            }
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            return error.message;
          } else {
            console.error('fetchDataStocks -- unexpected error: ', error);
          }
        }
      }, commit, 'setLoading');
    },
    async refreshPrices({ commit, state }) {
      const symbols = (state.stocks as IStocks[]).map((s) => s.symbol);
      if (!symbols.length) return;
      try {
        const batchSize = BATCH_QUOTE_SIZE;
        for (let i = 0; i < symbols.length; i += batchSize) {
          const batch = symbols.slice(i, i + batchSize).join(',');
          const { data } = await http.get(`quote/${batch}`);
          if (Array.isArray(data)) {
            commit('updateStockPrices', data.map((q: Record<string, unknown>) => ({
              symbol: q.symbol as string,
              price: q.price as number,
              change: q.change as number,
              changesPercentage: q.changesPercentage as number,
            })));
          }
        }
      } catch (error) {
        console.error('refreshPrices -- error: ', error);
      }
    },
    startPolling({ commit, dispatch, state }) {
      if (state.pollingIntervalId) return;
      const id = window.setInterval(() => {
        dispatch('refreshPrices');
      }, POLL_INTERVAL_MS);
      commit('setPollingIntervalId', id);
    },
    stopPolling({ commit, state }) {
      if (state.pollingIntervalId) {
        clearInterval(state.pollingIntervalId);
        commit('setPollingIntervalId', null);
      }
    },
    async fetchSparkline({ commit }, symbol: string) {
      try {
        const { data } = await http.get(`historical-price-full/${symbol}`, {
          params: { serietype: 'line', timeseries: 14 },
        });
        if (data && data.historical && Array.isArray(data.historical)) {
          const prices: number[] = data.historical
            .slice()
            .reverse()
            .map((d: Record<string, unknown>) => d.close as number);
          commit('updateStockSparkline', { symbol, sparkline: prices });
        }
      } catch (error) {
        console.error('fetchSparkline -- error: ', error);
      }
    },
    async fetchNews({ commit }, symbol: string) {
      commit('setLoadingNews', true);
      commit('setNews', []);
      try {
        const { data } = await http.get('stock_news', {
          params: { tickers: symbol, limit: 8 },
        });
        commit('setNews', Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('fetchNews -- error: ', error);
      } finally {
        commit('setLoadingNews', false);
      }
    },
    async fetchFx({ commit }) {
      try {
        const { data} = await http.get('fx/EURUSD');
        commit('addFx', data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          return error.message;
        } else {
          console.error('fetchFx -- unexpected error: ', error);
        }
      }
    },
    fetchQuote({ commit }) {
      return http.get('quote/BTCUSD')
        .then((response) => {
          if (!response.data['Error Message']) {
            commit('addQuote', response.data[0]);
          }
        });
    },
    fetchForex({ commit }) {
      return http.get('forex')
        .then((response) => {
          if (!response.data['Error Message']) {
            commit('addForex', response.data[0]);
          }
        });
    },
    initTheme({ commit, state }) {
      if (state.theme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    },
  },
});
