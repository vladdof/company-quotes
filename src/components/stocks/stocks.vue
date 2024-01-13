<template>
  <div class="stock">
    <div v-if="isLoading">Loading stocks...</div>

    <stocks-item
      v-else
      v-for="item in stocks"
      :key="item.companyName"
      :item="item"
      @click="openStock(item)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import { useRouter } from 'vue-router';

import { IStocks } from '@/models';
import StocksItem from './stocks-item.vue';

export default defineComponent({
  name: 'stocks',
  components: {
    StocksItem,
  },
  props: {
    stocks: {
      type: Array as PropType<IStocks[]>,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const router = useRouter();
    const openStock = (item) => {
      router.push({
        name: 'page-stock',
        params: { symbol: item.symbol },
      });
    };

    return {
      openStock,
    };
  },
});
</script>

<style lang="scss">
  @import 'stocks';
</style>
