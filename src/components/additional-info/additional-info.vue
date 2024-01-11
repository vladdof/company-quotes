<template>
  <h3>Show description about stock {{ selected.symbol }}</h3>
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

  <div v-show="selected.description" class="additional-info">
    {{ selected.description }}
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import type { PropType } from 'vue';
import { IStocks } from '@/models';

export default defineComponent({
  name: 'additional-info',
  props: {
    stocks: {
      type: Array as PropType<IStocks[]>,
      required: true,
    },
  },
  setup() {
    const selected = ref<{ description?: string; symbol?: string }>({});

    return {
      selected,
    };
  },
});
</script>

<style lang="scss">
  @import 'additional-info';
</style>
