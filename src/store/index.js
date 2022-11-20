import { createStore } from 'vuex';
import axios from 'axios';
import config from '../config';

export default createStore({
  state: {
    stocks: [],
    fx: [],
    quote: [],
    forex: {},
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
    addStocks(state, data) {
      state.stocks.push(data);
    },
    addFx(state, data) {
      state.fx.push(data);
    },
    addQuote(state, data) {
      state.quote.push(data);
    },
    addForex(state, data) {
      state.forex = {
        data
      };
    },
  },
  actions: {
    fetchDataStocks({ commit }, { symbol }) {
      commit('setDefaultStocks');

      return axios({
        method: 'get',
        url: `${config.apiUrl}/v3/profile/${symbol}`,
        params: {
          apikey: config.apiKey,
        },
        crossDomain: true,
      })
      .then((response) => {
        if (!response.data['Error Message']) {
          commit('addStocks', response.data[0]);
        }
      });
    },
    fetchFx({ commit }) {
      return axios({
        method: 'get',
        url: `${config.apiUrl}/v3/fx/EURUSD`,
        params: {
          apikey: config.apiKey,
        },
        crossDomain: true,
      })
        .then((response) => {
          if (!response.data['Error Message']) {
            commit('addFx', response.data[0]);
          }
          // [{
          //   "ticker": "EUR/USD",
          //   "bid": "1.06640",
          //   "ask": "1.06640",
          //   "open": "1.07362",
          //   "low": "1.06421",
          //   "high": "1.07398",
          //   "changes": -0.006724911980030182,
          //   "date": "2022-05-25 09:30:50"
          // }]
        });
    },
    fetchQuote({ commit }) {
      return axios({
        method: 'get',
        url: `${config.apiUrl}/v3/quote/BTCUSD`,
        params: {
          apikey: config.apiKey,
        },
        crossDomain: true,
      })
        .then((response) => {
          if (!response.data['Error Message']) {
            commit('addQuote', response.data[0]);
          }
          // [{
          //   "symbol": "BTCUSD",
          //   "name": "Bitcoin USD",
          //   "price": 29537.62000000,
          //   "changesPercentage": 1.09489860,
          //   "change": 319.90430000,
          //   "dayLow": 29400.03100000,
          //   "dayHigh": 30139.71700000,
          //   "yearHigh": 68789.62500000,
          //   "yearLow": 26350.49000000,
          //   "marketCap": 562661687296.00000000,
          //   "priceAvg50": 36629.70700000,
          //   "priceAvg200": 43848.08000000,
          //   "volume": 30325585920,
          //   "avgVolume": 29727791776,
          //   "exchange": "CRYPTO",
          //   "open": 29661.77500000,
          //   "previousClose": 29661.77500000,
          //   "eps": null,
          //   "pe": null,
          //   "earningsAnnouncement": null,
          //   "sharesOutstanding": 19048985,
          //   "timestamp": 1653485420
          // }]
        });
    },
    fetchForex({ commit }) {
      return axios({
        method: 'get',
        url: `${config.apiUrl}/v3/forex`,
        params: {
          apikey: config.apiKey,
        },
        crossDomain: true,
      })
        .then((response) => {
          if (!response.data['Error Message']) {
            commit('addForex', response.data[0]);
          }
          // {
          //   "forexList" : [{
          //     "ticker": "EUR/USD",
          //     "bid": "1.06638",
          //     "ask": "1.06638",
          //     "open": "1.07362",
          //     "low": "1.06421",
          //     "high": "1.07398",
          //     "changes": -0.006743540545071732,
          //     "date": "2022-05-25 09:31:33"
          //   }, {
          //     "ticker": "USD/JPY",
          //     "bid": "127.161",
          //     "ask": "127.161",
          //     "open": "126.832",
          //     "low": "126.654",
          //     "high": "127.299",
          //     "changes": 0.002593982591144252,
          //     "date": "2022-05-25 09:31:33"
          //   }, {
          //     "ticker": "GBP/USD",
          //     "bid": "1.25146",
          //     "ask": "1.25146",
          //     "open": "1.25322",
          //     "low": "1.24811",
          //     "high": "1.25604",
          //     "changes": -0.0014043823111664223,
          //     "date": "2022-05-25 09:31:33"
          //   },
          // }
        });
    },
  },
});

// https://financialmodelingprep.com/api/v3/stock/list?apikey=d8ed336ddcddad19f8ed0ab6333e6193
