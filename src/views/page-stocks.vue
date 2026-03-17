<template>
  <div class="container">
    <div class="page-stocks__header">
      <h1>Stocks App</h1>
      <div class="page-stocks__header-actions">
        <theme-toggle />
        <div v-if="lastUpdated" class="page-stocks__updated" :title="'Последнее обновление: ' + lastUpdated">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" width="14" height="14">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M3 3v5h5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          {{ lastUpdated }}
        </div>
      </div>
    </div>

    <search-bar :stocks="stocks" />

    <div class="page-stocks__controls">
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

      <div class="page-stocks__sort">
        <span class="page-stocks__sort-label">Сортировка:</span>
        <button
          v-for="opt in sortOptions"
          :key="opt.value"
          class="page-stocks__sort-btn"
          :class="{ 'page-stocks__sort-btn--active': sortBy === opt.value }"
          type="button"
          @click="setSortBy(opt.value)"
        >
          {{ opt.label }}
          <span v-if="sortBy === opt.value" class="page-stocks__sort-dir">
            {{ sortDir === 'asc' ? '↑' : '↓' }}
          </span>
        </button>
      </div>
    </div>

    <stocks
      :stocks="filteredStocks"
      :is-loading="isLoading"
    />

    <nav class="page-stocks__mobile-nav" aria-label="Мобильная навигация">
      <button
        class="page-stocks__mobile-nav-btn"
        :class="{ 'page-stocks__mobile-nav-btn--active': activeTab === 'all' }"
        type="button"
        @click="activeTab = 'all'"
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
          <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
          <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
          <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
          <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
        </svg>
        <span>Все</span>
      </button>
      <button
        class="page-stocks__mobile-nav-btn"
        :class="{ 'page-stocks__mobile-nav-btn--active': activeTab === 'favorites' }"
        type="button"
        @click="activeTab = 'favorites'"
      >
        <svg viewBox="0 0 24 24" :fill="activeTab === 'favorites' ? 'currentColor' : 'none'" aria-hidden="true" focusable="false">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
        </svg>
        <span>Избранное</span>
      </button>
      <button
        class="page-stocks__mobile-nav-btn"
        type="button"
        @click="toggleTheme"
      >
        <svg v-if="theme === 'dark'" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
          <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/>
          <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
          <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 0010 9.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>Тема</span>
      </button>
    </nav>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import { Stocks, SearchBar, ThemeToggle } from '@/components';

export default defineComponent({
  name: 'page-stocks',
  components: {
    Stocks,
    SearchBar,
    ThemeToggle,
  },
  setup() {
    const store = useStore();

    const stocks = computed(() => store.getters.getStocks);
    const isLoading = computed(() => store.getters.isLoading);
    const favorites = computed(() => store.getters.getFavorites);
    const sortBy = computed(() => store.getters.getSortBy);
    const sortDir = computed(() => store.getters.getSortDir);
    const theme = computed(() => store.getters.getTheme);

    const activeTab = ref<'all' | 'favorites'>('all');
    const lastUpdated = ref('');

    const sortOptions = [
      { value: 'name', label: 'По имени' },
      { value: 'price', label: 'По цене' },
      { value: 'change', label: 'По изменению' },
    ];

    const filteredStocks = computed(() => {
      const sorted = store.getters.getSortedStocks;
      if (activeTab.value === 'favorites') {
        return sorted.filter((s: { symbol: string }) =>
          favorites.value.includes(s.symbol)
        );
      }
      return sorted;
    });

    const favoritesCount = computed(() => favorites.value.length);

    const setSortBy = (val: string) => {
      store.commit('setSortBy', val);
    };

    const toggleTheme = () => {
      store.commit('setTheme', theme.value === 'dark' ? 'light' : 'dark');
    };

    const updateLastUpdated = () => {
      const now = new Date();
      lastUpdated.value = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    };

    const errors = ref([]);

    onMounted(() => {
      store.dispatch('initTheme');
      store
        .dispatch('fetchStockList')
        .then(() => {
          updateLastUpdated();
          store.dispatch('startPolling');
        })
        .catch((error) => errors.value.push(error));
    });

    onBeforeUnmount(() => {
      store.dispatch('stopPolling');
    });

    return {
      stocks,
      filteredStocks,
      isLoading,
      activeTab,
      favoritesCount,
      sortBy,
      sortDir,
      sortOptions,
      setSortBy,
      theme,
      toggleTheme,
      lastUpdated,
    };
  },
})
</script>

<style lang="scss">
.page-stocks {
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 12px;

    h1 {
      margin-bottom: 0;
    }
  }

  &__header-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__updated {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    color: var(--color-text-secondary);
  }

  &__controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 20px;
  }

  &__tabs {
    display: flex;
    gap: 8px;
  }

  &__tab {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 18px;
    border-radius: 20px;
    border: 2px solid transparent;
    background: var(--color-surface);
    color: var(--color-text-secondary);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: 'Open Sans', sans-serif;
    box-shadow: 0 2px 6px var(--color-shadow);

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

  &__sort {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }

  &__sort-label {
    font-size: 12px;
    color: var(--color-text-secondary);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  &__sort-btn {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    padding: 5px 12px;
    border-radius: 14px;
    border: 1.5px solid var(--color-border);
    background: var(--color-surface);
    color: var(--color-text-secondary);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: 'Open Sans', sans-serif;

    &:hover {
      border-color: #29a0f5;
      color: #29a0f5;
    }

    &--active {
      border-color: #29a0f5;
      color: #29a0f5;
      background: rgba(41, 160, 245, 0.08);
    }
  }

  &__sort-dir {
    font-size: 13px;
  }

  &__mobile-nav {
    display: none;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--color-surface);
    border-top: 1px solid var(--color-border);
    padding: 8px 0 max(8px, env(safe-area-inset-bottom, 8px));
    z-index: 1000;
    justify-content: space-around;
    box-shadow: 0 -4px 20px var(--color-shadow);

    @media (max-width: 767px) {
      display: flex;
    }

    &-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px 16px;
      color: var(--color-text-secondary);
      font-size: 10px;
      font-family: 'Open Sans', sans-serif;
      transition: color 0.2s ease;
      min-width: 60px;

      svg {
        width: 22px;
        height: 22px;
        flex-shrink: 0;
      }

      &--active {
        color: #29a0f5;
      }

      &:hover {
        color: #29a0f5;
      }
    }
  }
}
</style>

