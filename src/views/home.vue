<template>
  <div class="home">
    <wired-tabs selected="upload" @click="getAllImgList">
      <wired-tab name="upload" label="上传" style="display: flex;justify-content: center">
        <uploader></uploader>
      </wired-tab>
      <wired-tab name="list" label="图片列表" @click="getAllImgList" id="list">
        <list ref="list"></list>
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
      return {}
    },
    methods: {
      getAllImgList(e) {
        if (e.target.__selected === 'list') {
          this.$refs.list.getImgList()
        }
      }
    },
  }
</script>

<style lang="less">
  wired-tab {
    padding: 10px;
    /*width: 54%;*/
  }
</style>
