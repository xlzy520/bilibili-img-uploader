<script setup>
import Idb from 'idb-js'
import { Button, Image, Message, Popconfirm, RangePicker, Spin, Table, TableColumn, Tag } from '@arco-design/web-vue'
import { IconDelete } from '@arco-design/web-vue/es/icon'
import db_img_config from '../db_img_config'
import { copyText, formatDate } from '~/utils'

const props = defineProps({
  refreshKey: Number,
})

const virtualListProps = ref(null)
const paginationPros = {
  'show-page-size': true,
}

const loading = ref(false)

const data = ref([])
const filterData = ref([])

const getImgList = () => {
  Idb(db_img_config).then((img_db) => {
    img_db.queryAll({
      tableName: 'img',
      success: (r) => {
        r = r.sort((a, b) => b.date - a.date)
        const res = []
        r.forEach((v, index) => {
          res.push({ ...v })

          // if (index < 6) {
          //   res.push(v)
          // }
        })
        filterData.value = res
        if (filterData.value.length > 4) {
          virtualListProps.value = { height: 400, threshold: 100, isStaticItemHeight: true, itemKey: 'id' }
        }
        data.value = res
        console.log(res)
      },
    })
  })
}

const copy = (record, type) => {
  let url = record.url
  switch (type) {
    case 'MD':
      url = `![](${url}@1e_1c.webp)`
      break
    default:
      break
  }
  copyText(url)
}
const remove = (record) => {
  Idb(db_img_config).then((img_db) => {
    img_db.delete({
      tableName: 'img',
      condition: (item) => {
        if (record.id) {
          return item.id === record.id
        }
        return item.date === record.date
      },
      success: (res) => {
        Message.success('删除成功')
        getImgList()
      },
    })
  })
}

const onDateChange = (dateStr, date) => {
  if (date) {
    const [start, end] = date
    filterData.value = data.value.filter(v => start.getTime() < v.date && end.getTime() > v.date)
  }
  else {
    filterData.value = data.value
  }
}

watch(props, () => {
  getImgList()
})

onMounted(() => {
  getImgList()
})
</script>

<template>
  <Spin :loading="loading" tip="正在获取短链..." class="w-full">
    <div class=" px-2">
      <div class="layout-slide mb-2 w-full">
        <RangePicker
          clearable
          @change="onDateChange"
        />
        <Tag color="#fb7299">
          共 {{ data.length }}条
        </Tag>
      </div>
      <Table class="img-table" :hide-header="true" row-key="id" :data="filterData" :pagination="paginationPros">
        <template #columns>
          <TableColumn title="缩略图" width="100" align="center">
            <template #cell="{ record, index }">
              <Image
                width="80"
                height="80"
                class="cursor-pointer"
                :src="`${record.url}@80w_80h_1e_1c.webp`"
                :preview-props="{ src: `${record.url}@1e_1c.webp` }"
              />
            </template>
          </TableColumn>
          <TableColumn title="分辨率" width="120" align="center">
            <template #cell="{ record }">
              {{ record.width }} X {{ record.height }}
            </template>
          </TableColumn>
          <TableColumn title="时间" width="120" align="center">
            <template #cell="{ record }">
              {{ formatDate(record.date, '{y}-{m}-{d}') }}
            </template>
          </TableColumn>
          <TableColumn title="操作">
            <template #cell="{ record }">
              <div>
                <!--                <Button type="outline" size="mini" @click="getShortUrl(record.url)"> -->
                <!--                  短链 -->
                <!--                </Button> -->
                <Button class="ml-2" type="primary" status="success" size="mini" @click="copy(record)">
                  原图
                </Button>
                <Button class="ml-2" type="primary" status="warning" size="mini" @click="copy(record, 'MD')">
                  MD
                </Button>
                <Popconfirm content="确认删除吗？" position="lt" @ok="remove(record)">
                  <IconDelete class="ml-2 cursor-pointer hover:text-red-400" />
                </Popconfirm>
              </div>
            </template>
          </TableColumn>
        </template>
      </Table>
    </div>
  </Spin>
</template>

<style lang="scss">
.img-table{
  height: 400px;
  overflow: auto;
  margin-bottom: 40px;
}
.arco-table-pagination{
  position: fixed;
  bottom: 10px;
  right: 20px;
}
</style>
