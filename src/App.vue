<template>
  <div id="app">
<!--    <uploader/>-->
    <home></home>
  </div>
</template>

<script>
import Uploader from './components/Uploader.vue'
import home from './views/home.vue'

export default {
  name: 'app',
  components: {
    // Uploader,
    home
  }
}
</script>

<style>
  *{
    padding: 0;
    margin: 0;
  }
#app {
  font-family: 'Gloria Hallelujah', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding: 10px;
}
</style>
