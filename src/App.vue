<template>
  <div class="" id="app">
    <header class="header">
      <el-menu :default-active="activeIndex" router class="el-menu-demo" mode="horizontal">
        <el-menu-item index="/">图床</el-menu-item>
        <el-menu-item index="/imgList">图床数据</el-menu-item>
        <el-menu-item index="/request">接口请求</el-menu-item>
      </el-menu>
    </header>
    <import-buttons />
    <main class="main">
      <router-view />
    </main>
    <div class="footer">
      <img src="/icons/favicon.png" width="32"/>
      By
      <el-link class="author" href="https://github.com/xlzy520" target="_blank">执笔看墨花开</el-link>
    </div>
  </div>

</template>

<script>
import { defineComponent } from 'vue'
import ImportButtons from "./components/ImportButtons.vue";
export default defineComponent({
  name: 'App',
  components: {
    ImportButtons,
  },
  data() {
    return {
      activeIndex: '/'
    }
  },
})
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.header{
  margin-bottom: 20px;
  .el-menu--horizontal>.el-menu-item{
    height: 33px;
    line-height: 33px;
  }
}
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  color: gray;
  .author {
    color: rosybrown;
  }
}

</style>
