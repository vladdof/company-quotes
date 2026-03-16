<template>
  <div class="stock-item">
    <button
      class="stock-item__favorite"
      :class="{ 'stock-item__favorite--active': isFavorite }"
      type="button"
      :title="isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'"
      @click.stop="$emit('toggleFavorite', item.symbol)"
    >
      <svg viewBox="0 0 24 24" :fill="isFavorite ? 'currentColor' : 'none'" aria-hidden="true" focusable="false">
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          stroke="currentColor"
          stroke-width="2"
          stroke-linejoin="round"
        />
      </svg>
    </button>

    <div class="stock-item__info">
      <div class="stock-item__cover">
        <img :src="item.image" :alt="item.companyName" />
        <div v-if="item.price" class="stock-item__price">${{ item.price }}</div>
      </div>
      <div>
        <h4 class="stock-item__title">
          {{ item.companyName }}
        </h4>
        <span class="stock-item__symbol">
          {{ item.symbol }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { PropType } from 'vue';
import { IStocks } from '@/models';

export default defineComponent({
  name: 'stock-item',
  emits: ['toggleFavorite'],
  props: {
    item: {
      type: Object as PropType<IStocks>,
      default: () => ({}),
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

