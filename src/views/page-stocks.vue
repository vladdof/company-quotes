<template>
  <div class="container">
    <h1>Stocks App</h1>
    <stocks />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Stocks } from '@/components';

export default defineComponent({
  name: 'page-stocks',
  components: {
    Stocks,
  },
})
</script>
