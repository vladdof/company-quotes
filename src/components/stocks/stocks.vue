<template>
  <div class="stock">
    <template v-if="isLoading">
      <div v-for="i in 8" :key="i" class="stock__skeleton">
        <div class="stock__skeleton-img"></div>
        <div class="stock__skeleton-body">
          <div class="stock__skeleton-line stock__skeleton-line--wide"></div>
          <div class="stock__skeleton-line"></div>
        </div>
      </div>
    </template>

    <stocks-item
      v-else
      v-for="item in stocks"
      :key="item.symbol"
      :item="item"
      :is-favorite="isFavoriteStock(item.symbol)"
      @toggle-favorite="toggleFavorite"
      @click="openStock(item)"
    />

    <div v-if="!isLoading && stocks.length === 0" class="stock__empty">
      <span>Нет акций для отображения</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import type { PropType } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

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
    const store = useStore();

    const favorites = computed(() => store.getters.getFavorites);

    const isFavoriteStock = (symbol: string): boolean =>
      favorites.value.includes(symbol);

    const toggleFavorite = (symbol: string) => {
      store.commit('toggleFavorite', symbol);
    };

    const openStock = (item: IStocks) => {
      router.push({
        name: 'page-stock',
        params: { symbol: item.symbol },
      });
    };

    return {
      openStock,
      isFavoriteStock,
      toggleFavorite,
    };
  },
});
</script>

<style lang="scss">
  @import 'stocks';
</style>

