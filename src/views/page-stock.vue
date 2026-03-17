<template>
  <div class="container">
    <button class="page-stock__back" type="button" @click="goBack">
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
        <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Назад
    </button>

    <h1>{{ symbol }}</h1>

    <div v-if="!getSymbolStock" class="page-stock__loading">
      <div class="page-stock__loading-spinner"></div>
      <span>Загрузка...</span>
    </div>

    <template v-else>
      <div class="page-stock__header">
        <div class="page-stock__header-left">
          <img
            v-if="getSymbolStock.image"
            :src="getSymbolStock.image"
            :alt="getSymbolStock.companyName"
            class="page-stock__logo"
          />
          <div>
            <h2 class="page-stock__name">{{ getSymbolStock.companyName }}</h2>
            <div class="page-stock__meta">
              <span class="page-stock__price" v-if="getSymbolStock.price">
                ${{ Number(getSymbolStock.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
              </span>
              <span
                v-if="getSymbolStock.changes !== undefined"
                class="page-stock__change"
                :class="getSymbolStock.changes >= 0 ? 'page-stock__change--up' : 'page-stock__change--down'"
              >
                {{ getSymbolStock.changes >= 0 ? '↑' : '↓' }}
                {{ Math.abs(getSymbolStock.changes).toFixed(2) }}
                <span v-if="getSymbolStock.changesPercentage !== undefined">
                  ({{ getSymbolStock.changesPercentage >= 0 ? '+' : '' }}{{ getSymbolStock.changesPercentage.toFixed(2) }}%)
                </span>
              </span>
            </div>
          </div>
        </div>
        <div v-if="getSymbolStock.sparkline && getSymbolStock.sparkline.length > 1" class="page-stock__chart">
          <sparkline
            :data="getSymbolStock.sparkline"
            :positive="(getSymbolStock.changes ?? 0) >= 0"
            :width="160"
            :height="64"
          />
          <span class="page-stock__chart-label">14 дней</span>
        </div>
      </div>

      <list-item :item="getSymbolStock" />

      <news-feed :symbol="symbol" />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { ListItem, NewsFeed, Sparkline } from '@/components';

const fetchStock = (dispatch, symbol) => {
  return dispatch('fetchDataStocks', symbol);
};

export default defineComponent({
  name: 'page-stock',
  components: {
    ListItem,
    NewsFeed,
    Sparkline,
  },
  props: {
    symbol: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { getters, dispatch } = useStore();
    const router = useRouter();

    const getSymbolStock = computed(() => {
      return getters.getStocks.find(
        (stock: { symbol: string }) => stock.symbol === props.symbol
      );
    });

    onMounted(() => {
      if (!getSymbolStock.value) {
        fetchStock(dispatch, props.symbol);
      }
      dispatch('fetchSparkline', props.symbol);
    });

    const goBack = () => router.back();

    return {
      getSymbolStock,
      goBack,
    };
  },
})
</script>

<style lang="scss">
.page-stock {
  &__back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    color: var(--color-text-secondary);
    padding: 0;
    margin-bottom: 16px;
    transition: color 0.2s ease;
    font-family: 'Open Sans', sans-serif;

    svg {
      width: 18px;
      height: 18px;
    }

    &:hover {
      color: #29a0f5;
    }
  }

  &__loading {
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--color-text-secondary);
    padding: 40px 0;
  }

  &__loading-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid var(--color-border);
    border-top-color: #29a0f5;
    border-radius: 50%;
    animation: page-stock-spin 0.7s linear infinite;
  }

  @keyframes page-stock-spin {
    to { transform: rotate(360deg); }
  }

  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 24px;
    background: var(--color-surface);
    border-radius: 20px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 2px 10px var(--color-shadow);
    flex-wrap: wrap;
  }

  &__header-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  &__logo {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    object-fit: contain;
    flex-shrink: 0;
  }

  &__name {
    font-size: 24px;
    font-weight: 700;
    color: var(--color-text-primary);
    margin: 0 0 8px;
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__price {
    font-size: 22px;
    font-weight: 700;
    color: #29a0f5;
  }

  &__change {
    font-size: 16px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 8px;

    &--up {
      color: #22c55e;
      background: rgba(34, 197, 94, 0.1);
    }

    &--down {
      color: #ef4444;
      background: rgba(239, 68, 68, 0.1);
    }
  }

  &__chart {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
  }

  &__chart-label {
    font-size: 11px;
    color: var(--color-text-secondary);
    text-align: right;
  }
}
</style>

