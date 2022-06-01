<template>
  <div class="stock">
    <div v-if="loading">Loading...</div>

    <stocks-item
      v-else
      v-for="item in stocks"
      :key="item.companyName"
      :item="item"
      @click="open(item)"
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
    {{ selected.description }}
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
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

        tag: '',
      };
    },
    computed: {
      ...mapGetters({ stocks: 'getStocks' }),
    },
    methods: {
      ...mapActions(['fetchDataStocks']),

      fetchStocks() {
        this.loading = true;

        this.companies
          .map((symbol) => {
            this.fetchDataStocks({ symbol })
              .catch((error) => this.errors.push(error))
              .finally(() => (this.loading = false));
          })
      },
      open(item) {
        this.$router.push({
          name: 'page-stock',
          params: { symbol: item.symbol },
        });
        this.tag = '';
      },
    },
  };
</script>

<style lang="scss">
  @import 'stocks';
</style>
