<template>
  <div class="stock">
    <div v-if="loading">Loading...</div>

    <stocks-item
      v-else
      v-for="item in stocks"
      :key="item.companyName"
      :item="item"
    />
  </div>

  <h3>Get info</h3>
  <select v-model="selected">
    <option
      value
      disabled
    >
      Select Company
    </option>
    <option
      v-for="stock in stocks"
      :key="stock.description"
      :value="{ description: stock.description, symbol: stock.symbol }"
    >
      {{ stock.companyName }}
    </option>
  </select>

  <div
    v-show="selected"
    class="stock__info"
  >
    {{ handlerSelected }}
  </div>
</template>

<script>
  import axios from 'axios';
  import config from '../../config';
  import StocksItem from './stocks-item.vue';

  export default {
    name: 'stocks',
    components: {
      StocksItem,
    },
    created() {
      this.fetchStocks();
    },
    data() {
      return {
        selected: '',
        companies: config.companies,
        errors: [],
        loading: false,

        stocks: [],
        searchQuery: '',
      };
    },
    // created() {
    //   // watch the params of the route to fetch the data again
    //   this.$watch(
    //     () => this.$route.query.symbol,
    //     () => {
    //       this.getDescription({ symbolQuery: this.$route.query.symbol })
    //     },
    //     // fetch the data when the view is created and the data is
    //     // already being observed
    //     { immediate: true }
    //   )
    // },
    computed: {
      handlerSelected() {
        const { description, symbol } = this.selected;
        this.$route.query.symbol = symbol;
        // this.$route.fullPath = `?symbol=${symbol}`;
        return description;
      },
    },
    methods: {
      fetchStocks() {
        this.loading = true;

        this.companies
          .map((symbol) => {
            axios({
              method: 'get',
              url: `https://financialmodelingprep.com/api/v3/profile/${symbol}`,
              params: {
                apikey: config.apiKey,
              },
              crossDomain: true,
            })
              .then((response) => {
                if (!response.data['Error Message']) {
                  this.stocks.push(response.data[0]);
                }
              })
              .catch((error) => this.errors.push(error))
              .finally(() => (this.loading = false));
          });
      },
    },
  };
</script>

<style lang="scss">
  @import 'stocks';
</style>
