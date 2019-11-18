<template>
  <div class="home">
    <wired-tabs selected="upload" @click="getAllImgList">
      <wired-tab name="upload" label="上传" style="display: flex;justify-content: center">
        <uploader></uploader>
      </wired-tab>
      <wired-tab name="list" label="图片列表" @click="getAllImgList" id="list">
        <list ref="list"></list>
      </wired-tab>
      <wired-tab name="help" label="图片参数" id="help">
        <img src="../assets/img-help.jpg" width="">
      </wired-tab>
    </wired-tabs>
    <div class="header-button">
      <wired-button @click="exportJson" elevation="1" type="text" size="small">导出JSON</wired-button>
    </div>
  </div>
</template>

<script>
  import Uploader from '../components/Uploader.vue'
  import List from '../components/List.vue'
  import Idb from 'idb-js'
  import db_img_config from '../db_img_config'
  import {parseTime} from "../utils";

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
      },
      exportJson() {
        Idb(db_img_config).then(img_db => {
          img_db.queryAll({
            tableName: "img",
            success: (res) => {
              const content = JSON.stringify(res);
              const blob = new Blob([content], {type: "text/plain;charset=utf-8"});
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href= url
              a.download = parseTime() + '.json'
              a.display = 'none'
              document.body.appendChild(a)
              a.click()
              document.body.removeChild(a)
            }
          });
        })
      }
    },
  }
</script>

<style lang="less">
  wired-tab {
    padding: 10px;
    width: 98%;
  }

  .header-button {
    position: absolute;
    right: 9px;
    top: 8px;
  }
</style>
