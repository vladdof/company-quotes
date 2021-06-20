<template>
  <div class="stock">
    <div v-if="loading">Loading...</div>

    <div class="stock-item" v-else v-for="value in stocks" :key="value.stock">
      <div class="stock-item__info">
        <div class="stock-item__cover"><img :src="value.profile.image" :alt="value.profile.companyName"></div>
        <h3 class="stock-item__title">
          {{ value.profile.companyName }}
          <span>{{ value.symbol }}</span>
        </h3>
      </div>
      <div class="stock-item__price">
        $ {{ value.profile.price }}
      </div>
    </div>
  </div>

  <h3>Get info</h3>
  <select v-model="selected">
    <option value="" disabled>Select Company</option>
    <option v-for="value in stocks" :key="value.stock" :value="value.profile.description">{{ value.profile.companyName }}</option>
  </select>

  <div class="info">
    {{ selected }}
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'Stocks',
    data() {
      return {
        selected: '',
        stocks: [],
        errors: [],
        loading: true,
        url: 'https://financialmodelingprep.com/api/v3/company/profile/AAPL,ADBE,AMZN?apikey=d8ed336ddcddad19f8ed0ab6333e6193',
      };
    },
    mounted() {
      var self = this;
      axios
        .get(self.url)
        .then(response => {
          self.stocks = response.data.companyProfiles;
          console.log(response);
        })
        .catch(error => this.errors.push(error))
        .finally(() => (this.loading = false));
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
