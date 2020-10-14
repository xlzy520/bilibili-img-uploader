<template>
  <div class="img-table">
    <el-table :data="filterTableData" :default-sort="{prop: 'date', order: 'descending'}">
      <el-table-column prop="name" label="名称" min-width="140" show-overflow-tooltip>
        <template slot="header" slot-scope="scope">
          <div class="name">
            名称<el-input size="medium" v-model="nameSearch" placeholder="筛选"></el-input>
           </div>
        </template>
      </el-table-column>
      <el-table-column prop="thumbnail" label="缩略图"  min-width="90">
        <template slot-scope="scope">
          <el-image :src="scope.row.url+'@80w_80h_1e_1c.webp'"
                    :preview-src-list="[scope.row.url+'@1e_1c.webp']"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="resolution" label="分辨率"  min-width="110"
                       :formatter="(row)=>row.width+' X '+ row.height"></el-table-column>
      <el-table-column prop="url" label="链接" show-overflow-tooltip  min-width="100"></el-table-column>
      <el-table-column prop="date" label="时间" sortable
                       min-width="98"
                       :formatter="row=>row.date?parseTime(row.date): ''"></el-table-column>
      <el-table-column prop="action" label="操作(复制)"  min-width="160">
        <template slot-scope="scope">
          <wired-button @click.prevent="copy(scope.row.url,index)" v-for="(btn,index) in actionButtons" :key="btn"
                        elevation="1" type="text" size="small">{{btn}}
          </wired-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="footer-pagination">
      <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNo"
          :page-sizes="[10, 20, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </div>

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
        pageNo: 1,
        pageSize: 10,
        total: 0,
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
        actionButtons: ['原图', 'webp', 'MD'],
        nameSearch: ''
      }
    },
    computed: {
      filterTableData() {
        return this.tableData.filter(row=>!this.nameSearch || row.name.includes(this.nameSearch))
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
          case 2:
            _input = `![](${_input+'@1e_1c.webp'})`
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
              this.total = r.length
              const start = (this.pageNo - 1) * this.pageSize
              const end = start + this.pageSize
              this.tableData = r.slice(start, end)
            }
          });
        })
      },
      handleSizeChange (val){
        this.pageSize = val
        this.getImgList()
      },
      handleCurrentChange (val){
        this.pageNo = val
        this.getImgList()
      },
    },
    mounted() {
      this.getImgList()
    }
  }
</script>

<style lang="less" scoped>
  .name{
    display: flex;
  }
  .footer-pagination{
    text-align: center;
    padding: 20px 0;
  }
</style>
