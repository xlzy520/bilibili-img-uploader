<template>
  <div id="app">
    <uploader/>
  </div>
</template>

<script>
import Uploader from './components/Uploader.vue'

export default {
  name: 'app',
  components: {
    Uploader
  }
}
</script>

<style>
  *{
    padding: 0;
    margin: 0;
  }
#app {
  font-family: 'PingFang SC Medium', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding: 10px;
}
</style>
