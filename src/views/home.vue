<template>
  <div class="home">
    <el-tabs v-model="activeTab" type="border-card" @tab-click="getAllImgList">
      <el-tab-pane name="upload" label="上传" style="display: flex;justify-content: center">
        <uploader></uploader>
      </el-tab-pane>
      <el-tab-pane name="list" label="图片列表">
        <list ref="list"></list>
      </el-tab-pane>
      <el-tab-pane name="help" label="图片参数">
        <img src="../assets/img-help.jpg" width="">
      </el-tab-pane>
    </el-tabs>
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
      return {
        activeTab: 'upload'
      }
    },
    methods: {
      getAllImgList(e) {
        if (e.name === 'list') {
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
