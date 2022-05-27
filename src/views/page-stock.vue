<template>
  <div class="container">
    <h1>Stocks App</h1>
    <stocks />
  </div>
</template>

<script>
import { Stocks } from '@/components';

export default {
  name: 'VStocks',
  components: {
    Stocks,
  },
};
</script>
