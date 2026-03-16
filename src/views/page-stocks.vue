<template>
  <div class="container">
    <h1>Stocks App</h1>

    <search-bar :stocks="stocks" />

    <div class="page-stocks__tabs">
      <button
        class="page-stocks__tab"
        :class="{ 'page-stocks__tab--active': activeTab === 'all' }"
        type="button"
        @click="activeTab = 'all'"
      >
        Все
      </button>
      <button
        class="page-stocks__tab"
        :class="{ 'page-stocks__tab--active': activeTab === 'favorites' }"
        type="button"
        aria-label="Избранное"
        @click="activeTab = 'favorites'"
      >
        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" :fill="activeTab === 'favorites' ? 'currentColor' : 'none'" style="vertical-align:middle">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
        </svg>
        Избранное
        <span v-if="favoritesCount > 0" class="page-stocks__tab-badge">
          {{ favoritesCount }}
        </span>
      </button>
    </div>

    <stocks
      :stocks="filteredStocks"
      :is-loading="isLoading"
    />

    <additional-info :stocks="stocks" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { useStore } from 'vuex';
import { Stocks, AdditionalInfo, SearchBar } from '@/components';
import config from '../config';

export default defineComponent({
  name: 'page-stocks',
  components: {
    Stocks,
    AdditionalInfo,
    SearchBar,
  },
  setup() {
    const store = useStore();

    const stocks = computed(() => store.getters.getStocks);
    const isLoading = computed(() => store.getters.isLoading);
    const favorites = computed(() => store.getters.getFavorites);

    const errors = ref([]);
    const companies = ref(config.companies);
    const activeTab = ref<'all' | 'favorites'>('all');

    const filteredStocks = computed(() => {
      if (activeTab.value === 'favorites') {
        return stocks.value.filter((s: { symbol: string }) =>
          favorites.value.includes(s.symbol)
        );
      }
      return stocks.value;
    });

    const favoritesCount = computed(() => favorites.value.length);

    const fetchStocks = function () {
      store
        .dispatch('fetchDataStocks', companies)
        .catch((error) => errors.value.push(error));
    };
    fetchStocks();

    return {
      stocks,
      filteredStocks,
      isLoading,
      activeTab,
      favoritesCount,
    };
  },
})
</script>

<style lang="scss">
.page-stocks {
  &__tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
  }

  &__tab {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 18px;
    border-radius: 20px;
    border: 2px solid transparent;
    background: #fff;
    color: #606060;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: 'Open Sans', sans-serif;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);

    &:hover {
      border-color: #29a0f5;
      color: #29a0f5;
    }

    &--active {
      background: #29a0f5;
      color: #fff;
      border-color: #29a0f5;

      &:hover {
        background: #1a8de0;
        border-color: #1a8de0;
        color: #fff;
      }
    }

    &-badge {
      background: rgba(255, 255, 255, 0.3);
      border-radius: 10px;
      padding: 1px 7px;
      font-size: 12px;
    }
  }
}
</style>

