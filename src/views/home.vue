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
      <input type="file" id="importJson" @change="inputChange" hidden/>
      <wired-button @click="importJson" elevation="1" type="text" size="small">JSON导入</wired-button>
      <wired-button @click="exportJson" elevation="1" type="text" size="small">JSON导出</wired-button>
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
        activeTab: 'upload',
        errNum: 0
      }
    },
    methods: {
      getAllImgList(e) {
        if (e.name === 'list') {
          this.$refs.list.getImgList()
        }
      },
      inputChange(evt){
        const file = evt.target.files[0];
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = (readerEvt) => {
          const fileString = readerEvt.target.result;
          const jsonData = JSON.parse(fileString)
          this.saveDataToIdb(jsonData)
        }
      },
      saveDataToIdb (jsonData=[]){
        Idb(db_img_config).then(img_db=>{
          jsonData.forEach(data=>{
            if (data.name && data.url) {
              img_db.insert({
                tableName: "img",
                data,
                success: () => console.log("添加成功")
              });
            } else {
              this.errNum += 1
            }
          })
        }).finally(() => {
          if (this.errNum) {
            this.$message(this.errNum+'个数据上传失败:','error')
            this.errNum = 0
          }
        })
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
      },
      importJson(){
        const input = document.querySelector('#importJson')
        input.click();

        console.log(input);
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
