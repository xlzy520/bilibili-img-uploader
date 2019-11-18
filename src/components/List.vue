<template>
  <div class="img-table">
    <el-table :data="tableData">
      <el-table-column prop="name" label="名称" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="thumbnail" label="缩略图" width="90">
        <template slot-scope="scope">
          <el-image :src="scope.row.url+'@80w_80h_1e_1c.webp'"
                    :preview-src-list="[scope.row.url+'@1e_1c.webp']"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="resolution" label="分辨率" width="120"
                       :formatter="(row)=>row.width+' X '+ row.height"></el-table-column>
      <el-table-column prop="url" label="链接" show-overflow-tooltip width="100"></el-table-column>
      <el-table-column prop="action" label="操作(复制)" width="300">
        <template slot-scope="scope">
          <wired-button @click.prevent="copy(scope.row.url,index)" v-for="(btn,index) in actionButtons" :key="btn"
                        elevation="1" type="text" size="small">{{btn}}
          </wired-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {copyToClipboard, parseTime} from "../utils";
  import Idb from 'idb-js'
  import db_img_config from '../db_img_config'

  export default {
    name: 'List',
    data() {
      return {
        tableData: [
          {
            name: '654846546.jpg', width: 1920, height: 1080,
            url: 'https://i0.hdslb.com/bfs/album/3fd1887f78c10e26b3313a221cc2debcf6793020.jpg'
          },
          {
            name: '6548462546.jpg', width: 1920, height: 1080,
            url: 'https://i0.hdslb.com/bfs/album/bb3b6973bf1ec1885d9bc80c8540bb9b0181f1f2.jpg'
          }
        ],
        actionButtons: ['原图', 'webp']
      }
    },
    methods: {
      parseTime(time){
        return parseTime(time)
      },
      copy(input, type) {
        let _input = input
        switch (type) {
          case 1:
            _input += '@1e_1c.webp'
            break;
          default:
            break
        }
        copyToClipboard(_input)
      },
      getImgList(){
        Idb(db_img_config).then(img_db=>{
          img_db.queryAll({
            tableName: "img",
            success: r => {
              this.tableData = r
            }
          });
        })
      }
    },
    mounted() {
      this.getImgList()
    }
  }
</script>

<style lang="scss" scoped>

</style>
