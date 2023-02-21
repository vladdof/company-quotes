<template>
  <div class="container">
    <h1>
      Stocks App {{ symbol }}
    </h1>

    <list-item :item="getSymbolStock" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import { ListItem } from '@/components';

const fetcStock = (dispatch, symbol) => {
  return dispatch('fetchDataStocks', { symbol });
};

export default defineComponent({
  name: 'page-stock',
  components: {
    ListItem,
  },
  props: {
    symbol: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { getters, dispatch } = useStore();

    const getSymbolStock = computed(() => {
      return getters.getStocks.find(
        (stock: { symbol: string }) => stock.symbol === props.symbol
      );
    });

    if (!getSymbolStock.value) {
      fetcStock(dispatch, props.symbol);
    }

    return {
      getSymbolStock,
    };
  },
})
</script>
