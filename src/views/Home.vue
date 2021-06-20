<template>
  <div class="container">
    <h1>Stocks App</h1>
    <Stocks />
  </div>
</template>

<script>
// @ is an alias to /src
import Stocks from '@/components/Stocks.vue'

export default {
  name: 'Home',
  components: {
    Stocks
  }
}
</script>
