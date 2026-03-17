<template>
  <div class="news-feed">
    <h3 class="news-feed__title">Новости по {{ symbol }}</h3>

    <div v-if="isLoading" class="news-feed__loading">
      <div v-for="i in 4" :key="i" class="news-feed__skeleton">
        <div class="news-feed__skeleton-img"></div>
        <div class="news-feed__skeleton-text">
          <div class="news-feed__skeleton-line news-feed__skeleton-line--wide"></div>
          <div class="news-feed__skeleton-line"></div>
        </div>
      </div>
    </div>

    <div v-else-if="news.length === 0" class="news-feed__empty">
      Нет новостей по данному инструменту
    </div>

    <a
      v-else
      v-for="item in news"
      :key="item.url"
      class="news-feed__item"
      :href="item.url"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        v-if="item.image"
        :src="item.image"
        :alt="item.title"
        class="news-feed__item-img"
        loading="lazy"
      />
      <div class="news-feed__item-content">
        <span class="news-feed__item-source">{{ item.site }}</span>
        <p class="news-feed__item-title">{{ item.title }}</p>
        <span class="news-feed__item-date">{{ formatDate(item.publishedDate) }}</span>
      </div>
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'news-feed',
  props: {
    symbol: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    const news = computed(() => store.getters.getNews);
    const isLoading = computed(() => store.getters.isLoadingNews);

    const fetchNews = () => {
      if (props.symbol) {
        store.dispatch('fetchNews', props.symbol);
      }
    };

    fetchNews();

    watch(() => props.symbol, fetchNews);

    const formatDate = (dateStr: string) => {
      if (!dateStr) return '';
      try {
        return new Date(dateStr).toLocaleDateString('ru-RU', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
      } catch {
        return dateStr;
      }
    };

    return { news, isLoading, formatDate };
  },
});
</script>

<style lang="scss">
.news-feed {
  margin-top: 32px;

  &__title {
    font-size: 20px;
    font-weight: 700;
    color: var(--color-text-primary);
    margin: 0 0 16px;
  }

  &__loading {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__skeleton {
    display: flex;
    align-items: center;
    gap: 12px;
    background: var(--color-surface);
    border-radius: 14px;
    padding: 14px;
  }

  &__skeleton-img {
    width: 60px;
    height: 60px;
    border-radius: 10px;
    background: var(--color-skeleton);
    animation: skeleton-pulse 1.5s ease-in-out infinite;
    flex-shrink: 0;
  }

  &__skeleton-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__skeleton-line {
    height: 12px;
    border-radius: 6px;
    background: var(--color-skeleton);
    animation: skeleton-pulse 1.5s ease-in-out infinite;
    width: 60%;

    &--wide {
      width: 90%;
    }
  }

  &__empty {
    color: var(--color-text-secondary);
    font-size: 14px;
    padding: 20px 0;
    text-align: center;
  }

  &__item {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 14px;
    background: var(--color-surface);
    border-radius: 14px;
    text-decoration: none;
    margin-bottom: 10px;
    transition: box-shadow 0.2s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    &:hover {
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
    }

    &-img {
      width: 80px;
      height: 60px;
      border-radius: 10px;
      object-fit: cover;
      flex-shrink: 0;
      background: var(--color-skeleton);
    }

    &-content {
      flex: 1;
    }

    &-source {
      font-size: 11px;
      color: #29a0f5;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    &-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 4px 0;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    &-date {
      font-size: 12px;
      color: var(--color-text-secondary);
    }
  }
}
</style>
