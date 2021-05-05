<template>
  <div class="img-table">
    <header class="filter df">
      <div class="filter-item">
        <div class="filter-input">
          <el-input placeholder="名称" clearable v-model="filter.name" @change="getImgList"></el-input>
        </div>
      </div>
      <div class="filter-item">
        <div class="filter-input">
          <el-input placeholder="分辨率范围(宽X高)" v-model="filter.resolution" clearable>
            <template #prepend>
              <el-select style="width: 100px" v-model="filter.area" placeholder="请选择">
                <el-option label="小于等于" value="1">小于等于</el-option>
                <el-option label="大于等于" value="2">大于等于</el-option>
              </el-select>
            </template>
          </el-input>
        </div>
      </div>
      <div class="filter-item">
        <div class="filter-input">
          <el-date-picker
              @change="getImgList"
              v-model="filter.date"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="timestamp"
              :default-time="['00:00:00', '23:59:59']"
              placeholder="日期范围">
          </el-date-picker>
        </div>
      </div>
      <div class="filter-item submit">
        <el-button type="primary" class="submit-btn" @click="getImgList">查询</el-button>
      </div>
    </header>
    <el-table :data="tableData" :default-sort="{prop: 'date', order: 'descending'}">
      <el-table-column prop="name" label="名称" min-width="140" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="thumbnail" label="缩略图"  min-width="90">
        <template v-slot:default="scope">
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
        <template v-slot:default="scope">
          <el-button type="primary" plain @click="copy(scope.row, 'MD')" size="small">MD</el-button>
          <el-button type="primary" plain @click="copy(scope.row, 'origin')" size="small">原图</el-button>
          <el-dropdown style="margin-left: 10px" @command="cmd=>handleCommand(cmd, scope.row)">
            <el-button size="small">...</el-button>
            <template #dropdown>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="webp">webp</el-dropdown-item>
                <el-dropdown-item command="delete">
                  <span class="danger delete">删除</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
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
        actionButtons: ['MD'],
        nameSearch: '',
        filter: {
          name: '',
          resolution: '',
          area: '1',
          date: ''
        }
      }
    },
    computed: {
      // filterTableData() {
      //   return this.tableData.filter(row=>!this.nameSearch || row.name.includes(this.nameSearch))
      // }
    },
    methods: {
      parseTime(time){
        return parseTime(time)
      },
      copy(row, type) {
        let url = row.url
        switch (type) {
          case 'webp':
            url += '@1e_1c.webp'
            break;
          case 'MD':
            url = `![](${url+'@1e_1c.webp'})`
            break;
          default:
            break
        }
        copyToClipboard(url)
      },
      isIncludesName(name, key){
        if(!key) return true;
        const low = key.toLocaleLowerCase()
        const upper = key.toLocaleUpperCase()
        return key && [key, low, upper].some(f=> name.includes(f))
      },
      InResolution (row, key){
        if (!key) return true;
        const [ width, height ] = key.split('X')
        if (this.filter.area === '1') {
          return row.width <= width && row.height <= height
        } else {
          return row.width >= width && row.height >= height
        }
      },
      InDate(row, date){
        if (!date) return true
        const [ start, end ] = date
        return row.date >= start && row.date <= end
      },
      filterQuery (list){
        let result = list
        const { name, resolution, date } = this.filter;
        result = result.filter(row=> {
          return this.isIncludesName(row.name, name) &&
            this.InResolution(row, resolution) &&
              this.InDate(row, date)
        })
        return result
      },
      getImgList(){
        console.log(2);
        Idb(db_img_config).then(img_db=>{
          img_db.queryAll({
            tableName: "img",
            success: r => {
              r = this.filterQuery(r)
              r = r.sort((a,b)=> b.date - a.date)
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
      deleteImg(row){
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Idb(db_img_config).then(img_db=>{
            img_db.delete({
              tableName: "img",
              condition: (item)=> {
                if (row.id) {
                  return item.id === row.id
                }
                return item.date === row.date
              },
              success: (res) => {
                this.$message("删除成功");
                this.getImgList();
              }
            });
          })
        }).catch(() => {
        });
      },
      handleCommand (command, row){
        switch (command) {
          case 'webp': case 'MD': case 'origin':
            this.copy(row, command);
            break;
          case 'delete':
            this.deleteImg(row);
            break;
        }
      },
    },
    mounted() {
      this.getImgList()
    }
  }
</script>

<style lang="scss">
  .df{
    display: flex;
  }
  .footer-pagination{
    text-align: center;
    padding: 20px 0;
  }
  .filter{
    .filter-label{
      color: #4c4c4c;
      font-size: 16px;
    }
    .filter-item{
      display: flex;
      align-items: center;
      margin-right: 10px;
    }
  }
  .danger{
    color: #ff001c;
  }
</style>
