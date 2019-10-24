<template>
  <div class="home">
    <wired-tabs selected="upload">
      <wired-tab name="upload" label="上传">
        <uploader></uploader>
      </wired-tab>
      <wired-tab name="list" label="图片列表">
        <list></list>
      </wired-tab>
    </wired-tabs>
  </div>
</template>

<script>
  import Uploader from '../components/Uploader.vue'
  import List from '../components/List.vue'
export default {
  name: 'home',
  components: {
    Uploader,
    List
  },
  data() {
    return {
    }
  }
}
</script>

<style lang="less">
  wired-tab{
    padding: 10px;
    width: 54%;
  }
</style>
