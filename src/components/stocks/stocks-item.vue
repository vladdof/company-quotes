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
        <img :src="item.image" :alt="item.companyName" @error="onImgError" />
        <div v-if="item.price" class="stock-item__price">${{ formatPrice(item.price) }}</div>
        <div
          v-if="item.changes !== undefined"
          class="stock-item__change"
          :class="item.changes >= 0 ? 'stock-item__change--up' : 'stock-item__change--down'"
        >
          <span>{{ item.changes >= 0 ? '↑' : '↓' }}</span>
          {{ Math.abs(item.changes).toFixed(2) }}
          <span v-if="item.changesPercentage !== undefined" class="stock-item__change-pct">
            ({{ item.changesPercentage >= 0 ? '+' : '' }}{{ item.changesPercentage.toFixed(2) }}%)
          </span>
        </div>
      </div>
      <div class="stock-item__meta">
        <h4 class="stock-item__title">
          {{ item.companyName }}
        </h4>
        <span class="stock-item__symbol">
          {{ item.symbol }}
        </span>
      </div>
    </div>

    <div v-if="item.sparkline && item.sparkline.length > 1" class="stock-item__sparkline">
      <sparkline
        :data="item.sparkline"
        :positive="isPositive"
        :width="80"
        :height="32"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

import type { PropType } from 'vue';
import { IStocks } from '@/models';
import Sparkline from '../sparkline/sparkline.vue';

export default defineComponent({
  name: 'stock-item',
  components: { Sparkline },
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
  setup(props) {
    const isPositive = computed(() => (props.item.changes ?? 0) >= 0);

    const formatPrice = (price: string | number) => {
      const num = parseFloat(String(price));
      if (isNaN(num)) return price;
      return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const onImgError = (e: Event) => {
      const img = e.target as HTMLImageElement;
      img.style.display = 'none';
    };

    return { isPositive, formatPrice, onImgError };
  },
});
</script>

