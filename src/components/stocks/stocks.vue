<template>
  <div class="stock">
    <div v-if="loading">Loading...</div>

    <stocks-item
      v-else
      v-for="item in stocks"
      :key="item.companyName"
      :item="item"
      @click="openStock(item)"
    />
  </div>

  <h3>Get info</h3>
  <select v-model="selected">
    <option value disabled>Select Company</option>
    <option
      v-for="stock in stocks"
      :key="stock.description"
      :value="{ description: stock.description, symbol: stock.symbol }"
    >
      {{ stock.companyName }}
    </option>
  </select>

  <div v-show="selected" class="stock__info">
    {{ selected.description }}
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

import config from '../../config';
import StocksItem from './stocks-item.vue';

export default defineComponent({
  name: 'stocks',
  components: {
    StocksItem,
  },
  setup() {
    // data
    const selected = ref('');
    const companies = ref(config.companies);
    const errors = ref([]);
    const loading = ref(false);

    // getters
    const store = useStore();
    // computed
    const stocks = computed(() => store.getters.getStocks);

    const fetchStocks = function () {
      loading.value = true;

      companies.value.map((symbol: string) => {
        store
          .dispatch('fetchDataStocks', { symbol })
          .catch((error) => errors.value.push(error))
          .finally(() => (loading.value = false));
      });
    };
    fetchStocks();

    const router = useRouter();
    const openStock = (item) => {
      router.push({
        name: 'page-stock',
        params: { symbol: item.symbol },
      });
    };

    return {
      stocks,
      selected,
      companies,
      errors,
      loading,
      openStock,
    };
  },
});
</script>

<style lang="scss">
  @import 'stocks';
</style>
