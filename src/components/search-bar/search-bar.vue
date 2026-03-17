<template>
  <div class="search-bar" ref="searchBarRef">
    <div class="search-bar__input-wrapper">
      <svg class="search-bar__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
        <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
        <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <input
        ref="inputRef"
        v-model="query"
        class="search-bar__input"
        type="text"
        placeholder="Поиск инструментов... (нажмите /)"
        aria-label="Поиск инструментов"
        autocomplete="off"
        @keydown.esc="close"
        @keydown.down.prevent="navigateDown"
        @keydown.up.prevent="navigateUp"
        @keydown.enter.prevent="selectActive"
        @focus="isOpen = true"
      />
      <div v-if="isSearching" class="search-bar__searching" aria-label="Поиск...">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
          <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="56" stroke-dashoffset="20">
            <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/>
          </circle>
        </svg>
      </div>
      <button
        v-else-if="query"
        class="search-bar__clear"
        type="button"
        title="Очистить поиск"
        @click="clear"
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
      <kbd v-if="!isFocused" class="search-bar__hotkey" title="Нажмите / или Ctrl+K для поиска">/</kbd>
    </div>

    <div
      v-if="isOpen && allResults.length > 0"
      class="search-bar__dropdown"
      role="listbox"
      aria-label="Результаты поиска"
    >
      <div
        v-for="(stock, index) in allResults"
        :key="stock.symbol"
        class="search-bar__item"
        :class="{ 'search-bar__item--active': activeIndex === index }"
        role="option"
        :aria-selected="activeIndex === index"
        @mousedown.prevent="select(stock)"
        @mousemove="activeIndex = index"
      >
        <img
          v-if="stock.image"
          :src="stock.image"
          :alt="stock.companyName"
          class="search-bar__item-image"
          @error="onImgError"
        />
        <div v-else class="search-bar__item-image-placeholder">
          {{ stock.symbol ? stock.symbol[0] : '?' }}
        </div>
        <div class="search-bar__item-info">
          <span class="search-bar__item-name">{{ stock.companyName || stock.name }}</span>
          <span class="search-bar__item-symbol">{{ stock.symbol }}</span>
        </div>
        <span v-if="stock.price" class="search-bar__item-price">${{ stock.price }}</span>
        <span v-if="!isInCurrentList(stock.symbol)" class="search-bar__item-add">+ добавить</span>
      </div>
    </div>

    <div v-if="selectedStock" class="search-bar__info-panel">
      <div class="search-bar__info-header">
        <img
          v-if="selectedStock.image"
          :src="selectedStock.image"
          :alt="selectedStock.companyName"
          class="search-bar__info-image"
        />
        <div class="search-bar__info-title">
          <h3 class="search-bar__info-name">{{ selectedStock.companyName }}</h3>
          <div class="search-bar__info-meta">
            <span class="search-bar__info-symbol">{{ selectedStock.symbol }}</span>
            <span v-if="selectedStock.exchange" class="search-bar__info-exchange">
              {{ selectedStock.exchange }}
            </span>
            <span v-if="selectedStock.price" class="search-bar__info-price">
              ${{ selectedStock.price }}
            </span>
            <span
              v-if="selectedStock.changes !== undefined"
              class="search-bar__info-change"
              :class="selectedStock.changes >= 0 ? 'search-bar__info-change--up' : 'search-bar__info-change--down'"
            >
              {{ selectedStock.changes >= 0 ? '▲' : '▼' }}
              {{ Math.abs(selectedStock.changes).toFixed(2) }}
            </span>
          </div>
        </div>
        <button
          class="search-bar__info-close"
          type="button"
          title="Закрыть"
          @click="selectedStock = null"
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <p v-if="selectedStock.description" class="search-bar__info-description">
        {{ selectedStock.description }}
      </p>

      <div class="search-bar__info-grid">
        <div v-if="selectedStock.industry" class="search-bar__info-field">
          <span class="search-bar__info-label">Отрасль</span>
          <span class="search-bar__info-value">{{ selectedStock.industry }}</span>
        </div>
        <div v-if="selectedStock.sector" class="search-bar__info-field">
          <span class="search-bar__info-label">Сектор</span>
          <span class="search-bar__info-value">{{ selectedStock.sector }}</span>
        </div>
        <div v-if="selectedStock.country" class="search-bar__info-field">
          <span class="search-bar__info-label">Страна</span>
          <span class="search-bar__info-value">{{ selectedStock.country }}</span>
        </div>
        <div v-if="selectedStock.currency" class="search-bar__info-field">
          <span class="search-bar__info-label">Валюта</span>
          <span class="search-bar__info-value">{{ selectedStock.currency }}</span>
        </div>
        <div v-if="selectedStock.ceo" class="search-bar__info-field">
          <span class="search-bar__info-label">CEO</span>
          <span class="search-bar__info-value">{{ selectedStock.ceo }}</span>
        </div>
        <div v-if="selectedStock.fullTimeEmployees" class="search-bar__info-field">
          <span class="search-bar__info-label">Сотрудников</span>
          <span class="search-bar__info-value">{{ selectedStock.fullTimeEmployees }}</span>
        </div>
      </div>

      <div v-if="selectedStock.website" class="search-bar__info-website">
        <a :href="selectedStock.website" target="_blank" rel="noopener noreferrer">
          {{ selectedStock.website }}
        </a>
      </div>

      <div class="search-bar__info-actions">
        <button class="search-bar__info-btn" type="button" @click="viewStock">
          Подробнее →
        </button>
        <button
          v-if="!isInCurrentList(selectedStock.symbol)"
          class="search-bar__info-btn search-bar__info-btn--secondary"
          type="button"
          @click="addToList"
        >
          + Добавить в список
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import type { PropType } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { IStocks } from '@/models';
import http from '@/lib/http-common';

const SEARCH_DEBOUNCE_MS = 350;

export default defineComponent({
  name: 'search-bar',
  props: {
    stocks: {
      type: Array as PropType<IStocks[]>,
      default: () => [],
    },
  },
  setup(props) {
    const router = useRouter();
    const store = useStore();
    const inputRef = ref<HTMLInputElement | null>(null);
    const searchBarRef = ref<HTMLElement | null>(null);
    const query = ref('');
    const isOpen = ref(false);
    const isFocused = ref(false);
    const activeIndex = ref(-1);
    const selectedStock = ref<IStocks | null>(null);
    const apiResults = ref<IStocks[]>([]);
    const isSearching = ref(false);
    let searchTimer: ReturnType<typeof setTimeout> | null = null;

    const filteredStocks = computed(() => {
      const q = query.value.trim().toLowerCase();
      if (!q) return props.stocks;
      return props.stocks.filter(
        (s) =>
          s.companyName?.toLowerCase().includes(q) ||
          s.symbol?.toLowerCase().includes(q)
      );
    });

    const allResults = computed(() => {
      if (!query.value.trim()) return filteredStocks.value;
      const localSymbols = new Set(filteredStocks.value.map((s) => s.symbol));
      const extras = apiResults.value.filter((r) => !localSymbols.has(r.symbol));
      return [...filteredStocks.value, ...extras];
    });

    const isInCurrentList = (symbol: string) => {
      return props.stocks.some((s) => s.symbol === symbol);
    };

    const searchApi = async (q: string) => {
      if (!q || q.length < 2) {
        apiResults.value = [];
        return;
      }
      isSearching.value = true;
      try {
        const { data } = await http.get('search', {
          params: { query: q, limit: 10, exchange: 'NASDAQ,NYSE' },
        });
        apiResults.value = Array.isArray(data)
          ? data.map((r: Record<string, unknown>) => ({
              symbol: r.symbol as string,
              companyName: (r.name as string) || (r.symbol as string),
              price: '',
              image: `https://financialmodelingprep.com/image-stock/${r.symbol}.png`,
              exchange: r.exchangeShortName as string | undefined,
            }))
          : [];
      } catch {
        apiResults.value = [];
      } finally {
        isSearching.value = false;
      }
    };

    watch(query, (newQ) => {
      activeIndex.value = -1;
      isOpen.value = true;
      if (searchTimer) clearTimeout(searchTimer);
      searchTimer = setTimeout(() => searchApi(newQ), SEARCH_DEBOUNCE_MS);
    });

    const close = () => {
      isOpen.value = false;
      activeIndex.value = -1;
      isFocused.value = false;
    };

    const clear = () => {
      query.value = '';
      selectedStock.value = null;
      apiResults.value = [];
      inputRef.value?.focus();
    };

    const select = (stock: IStocks) => {
      selectedStock.value = stock;
      query.value = stock.companyName || stock.symbol;
      close();
    };

    const navigateDown = () => {
      if (!isOpen.value) isOpen.value = true;
      activeIndex.value = Math.min(
        activeIndex.value + 1,
        allResults.value.length - 1
      );
    };

    const navigateUp = () => {
      activeIndex.value = Math.max(activeIndex.value - 1, -1);
    };

    const selectActive = () => {
      if (activeIndex.value >= 0 && allResults.value[activeIndex.value]) {
        select(allResults.value[activeIndex.value]);
      }
    };

    const viewStock = () => {
      if (selectedStock.value) {
        router.push({
          name: 'page-stock',
          params: { symbol: selectedStock.value.symbol },
        });
      }
    };

    const addToList = () => {
      if (selectedStock.value && !isInCurrentList(selectedStock.value.symbol)) {
        store.dispatch('fetchDataStocks', selectedStock.value.symbol);
        selectedStock.value = null;
        query.value = '';
        apiResults.value = [];
      }
    };

    const onImgError = (e: Event) => {
      const img = e.target as HTMLImageElement;
      img.style.display = 'none';
    };

    const handleGlobalKeydown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement;

      if (e.key === '/' && !isInput) {
        e.preventDefault();
        inputRef.value?.focus();
        isFocused.value = true;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.value?.focus();
        isFocused.value = true;
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchBarRef.value &&
        !searchBarRef.value.contains(e.target as Node)
      ) {
        isOpen.value = false;
      }
    };

    onMounted(() => {
      document.addEventListener('keydown', handleGlobalKeydown);
      document.addEventListener('mousedown', handleClickOutside);
    });

    onBeforeUnmount(() => {
      document.removeEventListener('keydown', handleGlobalKeydown);
      document.removeEventListener('mousedown', handleClickOutside);
      if (searchTimer) clearTimeout(searchTimer);
    });

    return {
      inputRef,
      searchBarRef,
      query,
      isOpen,
      isFocused,
      isSearching,
      activeIndex,
      selectedStock,
      filteredStocks,
      allResults,
      isInCurrentList,
      close,
      clear,
      select,
      navigateDown,
      navigateUp,
      selectActive,
      viewStock,
      addToList,
      onImgError,
    };
  },
});
</script>

<style lang="scss">
@import 'search-bar';
</style>

