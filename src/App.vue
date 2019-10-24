<template>
  <div id="app">
    <home></home>
  </div>
</template>

<script>
  import home from './views/home.vue'

  export default {
    name: 'app',
    components: {
      home
    }
  }
</script>

<style>
  * {
    padding: 0;
    margin: 0;
  }
  body::-webkit-scrollbar {
     width: 6px;
     background-color: #e5e5e5;
   }
  body::-webkit-scrollbar-thumb {
     overflow: auto;
     border-radius: 4px;
     background-color: rgba(18, 150, 219, .8);
   }
  #app {
    font-family: 'Gloria Hallelujah', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    padding: 10px;
  }
</style>
