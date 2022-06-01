<template>
  <div class="container">
    <h1>
      Stocks App {{ symbol }}
    </h1>

    <list-item :item="getSymbolStock" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { ListItem } from '@/components';

export default {
  name: 'VStocks',
  components: {
    ListItem,
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
