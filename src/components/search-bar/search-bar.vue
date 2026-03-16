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
      <button
        v-if="query"
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
      v-if="isOpen && filteredStocks.length > 0"
      class="search-bar__dropdown"
      role="listbox"
      aria-label="Результаты поиска"
    >
      <div
        v-for="(stock, index) in filteredStocks"
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
        />
        <div v-else class="search-bar__item-image-placeholder">
          {{ stock.symbol ? stock.symbol[0] : '?' }}
        </div>
        <div class="search-bar__item-info">
          <span class="search-bar__item-name">{{ stock.companyName }}</span>
          <span class="search-bar__item-symbol">{{ stock.symbol }}</span>
        </div>
        <span v-if="stock.price" class="search-bar__item-price">${{ stock.price }}</span>
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
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import type { PropType } from 'vue';
import { useRouter } from 'vue-router';
import { IStocks } from '@/models';

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
    const inputRef = ref<HTMLInputElement | null>(null);
    const searchBarRef = ref<HTMLElement | null>(null);
    const query = ref('');
    const isOpen = ref(false);
    const isFocused = ref(false);
    const activeIndex = ref(-1);
    const selectedStock = ref<IStocks | null>(null);

    const filteredStocks = computed(() => {
      const q = query.value.trim().toLowerCase();
      if (!q) return props.stocks;
      return props.stocks.filter(
        (s) =>
          s.companyName?.toLowerCase().includes(q) ||
          s.symbol?.toLowerCase().includes(q)
      );
    });

    watch(query, () => {
      activeIndex.value = -1;
      isOpen.value = true;
    });

    const close = () => {
      isOpen.value = false;
      activeIndex.value = -1;
      isFocused.value = false;
    };

    const clear = () => {
      query.value = '';
      selectedStock.value = null;
      inputRef.value?.focus();
    };

    const select = (stock: IStocks) => {
      selectedStock.value = stock;
      query.value = stock.companyName;
      close();
    };

    const navigateDown = () => {
      if (!isOpen.value) isOpen.value = true;
      activeIndex.value = Math.min(
        activeIndex.value + 1,
        filteredStocks.value.length - 1
      );
    };

    const navigateUp = () => {
      activeIndex.value = Math.max(activeIndex.value - 1, -1);
    };

    const selectActive = () => {
      if (activeIndex.value >= 0 && filteredStocks.value[activeIndex.value]) {
        select(filteredStocks.value[activeIndex.value]);
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
    });

    return {
      inputRef,
      searchBarRef,
      query,
      isOpen,
      isFocused,
      activeIndex,
      selectedStock,
      filteredStocks,
      close,
      clear,
      select,
      navigateDown,
      navigateUp,
      selectActive,
      viewStock,
    };
  },
});
</script>

<style lang="scss">
@import 'search-bar';
</style>
