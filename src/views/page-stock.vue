<template>
  <div class="container">
    <h1>
      Stocks App {{ symbol }}
    </h1>
    <ul>
      <li
        v-for="(value, key) in getSymbolStock"
        :key="key"
      >
        {{ key }} -- {{ value }}
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { Stocks } from '@/components';

export default {
  name: 'VStocks',
  components: {
    Stocks,
  },
  props: {
    symbol: {
      type: String,
      default: '',
    },
  },
  computed: {
    ...mapGetters(['getStocks']),

    getSymbolStock() {
      return this.getStocks.find((stock) => stock.symbol === this.symbol);
    },
  },
};
</script>
