import { createStore } from 'vuex';
import http from '@/lib/http-common';
import { setLoading } from '@/lib/set-loading';
import axios from 'axios';
import { IStore, GetStocksResponse } from '@/models';

import { StockService } from '@/lib/storage-service';

const stockStorage = new StockService();

export default createStore<IStore>({
  state: {
    stocks: [],
    fx: [],
    quote: [],
    forex: {},
    isLoading: false,
  },
  getters: {
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
  },
  mutations: {
    setDefaultStocks(state) {
      state.stocks = [];
    },
    addStocks(state, data): void {
      state.stocks.push(data);
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
  },
  actions: {
    async fetchDataStocks({ commit }, { symbol }) {
      commit('setDefaultStocks');

      await setLoading(async () => {
        try {
          const stock = stockStorage.get(symbol);
          console.log(stock);

          if (stock) {
            console.log(1, symbol, stockStorage);

            commit('addStocks', stock);
          } else {
            console.log(2, symbol);
            const { data } = await http.get<GetStocksResponse>(`profile/${symbol}`);
            commit('addStocks', data[0]);
            stockStorage.set(symbol, data[0]);
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
  },
});
