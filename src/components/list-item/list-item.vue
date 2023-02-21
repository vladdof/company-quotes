<template>
  <ul class="list-item">
    <li
      v-for="(value, key) in item"
      :key="key"
      class="list-item__content"
    >
      <div
        v-if="key !== 'image'"
        class="list-item__label"
      >
        {{ key }}
      </div>

      <div
        v-if="key === 'price'"
        class="list-item__description"
      >
        ${{ value }}
      </div>

      <a
        v-else-if="key === 'website'"
        class="list-item__link"
        :href="value"
        target="_blank"
      >
        {{ value }}
      </a>

      <img
        v-else-if="key === 'image'"
        class="list-item__img"
        :src="value"
        :alt="item.symbol"
      />

      <div
        v-else
        class="list-item__description"
      >
        {{ value }}
      </div>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'list-item',
  props: {
    item: {
      type: Object,
      default: ({}),
    },
  },
});
</script>

<style lang="scss">
  @import 'list-item';
</style>
