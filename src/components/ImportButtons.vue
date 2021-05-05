<template>
  <div class="header-button">
    <input type="file" id="importJson" @change="inputChange" hidden/>
    <el-button @click="importJson" size="small">JSON导入</el-button>
    <el-button @click="exportJson" size="small">JSON导出</el-button>
  </div>
</template>

<script>
import Idb from 'idb-js'
import uuid from "uuidjs";
import db_img_config from '../db_img_config'
import {parseTime} from "../utils";
export default {
  name: 'ImportButtons',
  data() {
    return {
      errNum: 0
    }
  },
  methods: {
    getAllImgList() {
      if (this.activeTab === 'list') {
        this.$refs.list.getImgList()
      }
    },
    inputChange(evt) {
      const file = evt.target.files[0];
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (readerEvt) => {
        const fileString = readerEvt.target.result;
        const jsonData = JSON.parse(fileString)
        console.log(jsonData);
        this.saveDataToIdb(jsonData)
      }
    },
    saveDataToIdb(jsonData = []) {
      Idb(db_img_config).then(img_db => {
        jsonData.forEach(data => {
          if (data.name && data.url) {
            if (!data.id) {
              data.id = uuid.generate()
            }
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
          this.$message(this.errNum + '个数据上传失败:', 'error')
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
            a.href = url
            a.download = parseTime() + '.json'
            a.display = 'none'
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
          }
        });
      })
    },
    importJson() {
      const input = document.querySelector('#importJson')
      input.click();

      console.log(input);
    }
  },
}
</script>

<style lang="scss" scoped>
.header-button {
  position: absolute;
  right: 9px;
  top: 7px;
}
</style>
