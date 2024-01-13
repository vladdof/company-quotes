<template>
  <div class="container">
    <h1>Stocks App</h1>

    <stocks
      :stocks="stocks"
      :is-loading="isLoading"
    />

    <additional-info :stocks="stocks" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { useStore } from 'vuex';
import { Stocks, AdditionalInfo } from '@/components';
import config from '../config';

export default defineComponent({
  name: 'page-stocks',
  components: {
    Stocks,
    AdditionalInfo,
  },
  setup() {
    // getters
    const store = useStore();
    // computed
    const stocks = computed(() => store.getters.getStocks);
    const isLoading = computed(() => store.getters.isLoading);
    // data
    const errors = ref([]);
    const companies = ref(config.companies);

    const fetchStocks = function () {
      store
        .dispatch('fetchDataStocks', companies)
        .catch((error) => errors.value.push(error));
    };
    fetchStocks();

    return {
      stocks,
      isLoading,
    };
  },
})
</script>
