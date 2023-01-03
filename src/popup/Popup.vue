<script setup>
import Idb from 'idb-js'
import uuid from 'uuidjs'
import { Button, Message, TabPane, Tabs } from '@arco-design/web-vue'
import { IconExport, IconImport } from '@arco-design/web-vue/es/icon'
import Upload from './pages/Upload.vue'
import ImageList from './pages/ImageList.vue'
import db_img_config from './db_img_config'
import { formatDate } from '~/utils'

const pages = reactive([{
  name: '图片上传',
  component: Upload,
}, {
  name: '已上传图片',
  component: ImageList,
}])

const refreshKey = ref(0)

onMounted(() => {
})

const saveDataToIdb = (jsonData = []) => {
  let errNum = 0
  Idb(db_img_config).then((img_db) => {
    jsonData.forEach((data) => {
      if (data.name && data.url) {
        if (!data.id) {
          data.id = uuid.generate()
        }
        img_db.insert({
          tableName: 'img',
          data,
          success: () => {
            console.log('添加成功')
          },
        })
      }
      else {
        errNum += 1
      }
    })
  }).finally(() => {
    const successNum = jsonData.length - errNum
    Message.success({
      content: `${successNum}个添加成功！${errNum}个数据上传失败！`,
      duration: 2000,
    })
    refreshKey.value++
  })
}

const inputChange = (evt) => {
  const file = evt.target.files[0]
  const reader = new FileReader()
  reader.readAsText(file)
  reader.onload = (readerEvt) => {
    const fileString = readerEvt.target.result
    const jsonData = JSON.parse(fileString)
    saveDataToIdb(jsonData)
  }
}

const importJson = () => {
  const input = document.querySelector('#importJson')
  input.click()
}

const exportJson = () => {
  Idb(db_img_config).then((img_db) => {
    img_db.queryAll({
      tableName: 'img',
      success: (res) => {
        const content = JSON.stringify(res)
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${formatDate()}.json`
        a.display = 'none'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      },
    })
  })
}
</script>

<template>
  <main class="w-[600px] px-1 py-4 text-gray-700">
    <div class="">
      <Tabs size="large" type="rounded" destroy-on-hide default-active-key="图片上传">
        <template #extra>
          <input id="importJson" type="file" hidden @change="inputChange">
          <Button type="outline" size="mini" @click="importJson">
            <template #icon>
              <IconImport />
            </template>
            数据导入
          </Button>
          <Button class="ml-2" size="mini" type="outline" @click="exportJson">
            <template #icon>
              <IconExport />
            </template>
            数据导出
          </Button>
        </template>
        <TabPane v-for="item in pages" :key="item.name" :title="item.name">
          <component :is="item.component" :refresh-key="refreshKey" />
        </TabPane>
      </Tabs>
    </div>
  </main>
</template>

<style lang="scss">

</style>
