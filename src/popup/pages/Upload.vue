<template>
  <div class="upload-page border-top-line" @paste="handleTPaste">
    <input id="focus" autofocus focus class="use-focus">
    <div class="layout-slide p-2 switch-row token">
      <Tag color="#fb7299">
        默认复制格式
      </Tag>
      <radio-group v-model="copyStyle" @change="changeCopyStyle">
        <radio value="md">
          Markdown
        </radio>
        <radio value="shortURL">
          短链
        </radio>
      </radio-group>
    </div>
    <div class="layout-slide p-2 switch-row token">
      <Tag color="#fb7299">
        当前SESSDATA
      </Tag>
      <Tag v-if="token" color="#00a1d6">
        {{ token.substr(0, 8).padEnd(16,'*') }}
      </Tag>

      <Link v-else :href="loginUrl" class="">
        您当前的浏览器未登录Bilibili，点我登录
      </Link>
    </div>
    <div class="p-2 upload">
      <Upload
        ref="upload"
        :action="uploadUrl"
        draggable
        list-type="picture"
        accept="image/*"
        multiple
        :with-credentials="true"
        :data="uploadData"
        name="file_up"
        :file-list="fileList"
        @success="uploadSuccess"
      >
        <template #upload-button>
          <div class="upload-main">
            <span style="color: #3370FF"> 支持粘贴、拖动、点击文件上传</span>
          </div>
        </template>
      </Upload>
    </div>
    <div class="px-2 result pb-4">
      <div v-for="(link, index) in links" :key="link" class="layout-slide mb-2">
        <div class="layout-items-center flex-grow">
          <Tag color="#00a1d6" class="mr-2 flex-0-auto w-[80px]">
            {{ types[index] }}
          </Tag>
          <TypographyParagraph
            class="link break-all flex-grow"
            underline
            :ellipsis="{
              showTooltip: true,
            }"
          >
            {{ link }}
          </TypographyParagraph>
        </div>

        <div class="ml-4 flex-0-auto">
          <Button type="outline" size="small" @click="copyToClipboard(link)">
            复制
          </Button>
        </div>
      </div>
    </div>
    <div class="footer">
      By
      <Link
        class="author"
        href="https://github.com/xlzy520"
        target="_blank"
      >
        执笔看墨花开
      </Link>
    </div>
    <div class="footer">
      B站
      <Link
        class="author"
        href="https://space.bilibili.com/7560113"
        target="_blank"
      >
        我的视频被举报下架了，B站请关注我
      </Link>
    </div>
  </div>
</template>

<script setup>
import Idb from 'idb-js'
import uuid from 'uuidjs'
import { Button, Tag, Link, Upload, Message, TypographyParagraph, RadioGroup, Radio } from '@arco-design/web-vue'
import db_img_config from '../db_img_config'
import { copyToClipboard, fetchShortUrl, getPasteImg } from '~/utils'

const homePage = 'https://bilibili.com'
const loginUrl = 'https://passport.bilibili.com/login'
const uploadUrl = 'https://api.vc.bilibili.com/api/v1/drawImage/upload'
const token = ref('')
const uploadData = {
  category: 'daily',
  biz: 'draw',
}
const fileList = ref([])
const upload = ref(null)

const types = ref(['图片链接', 'MarkDown', 'B站短链'])

const links = ref([])

const getResponseImgUrlHttps = (res) => {
  if (res) {
    return res.data.image_url.replace('http', 'https')
  }
  return ''
}

const copyStyle = ref('shortURL')
const changeCopyStyle = (val) => {
  localStorage.setItem('copyStyle', val)
}

const getShortUrl = (link) => {
  const copyShortURL = copyStyle.value === 'shortURL'
  fetchShortUrl(link, copyShortURL).then((res) => {
    if (res) {
      links.value.push(res)
    }
  })
}

const toLogin = () => {
  Message.warning('未登录或登录已过期, 一秒后自动跳转登录页...')
  setTimeout(() => {
    window.open(loginUrl)
  }, 1000)
}

const uploadSuccess = (FileItem) => {
  const res = FileItem.response
  if (res.message === 'success') {
    const link = getResponseImgUrlHttps(res)
    const mdValue = `![](${link})`
    links.value = [link, mdValue]
    getShortUrl(link)
    const copyMD = copyStyle.value === 'md'
    if (copyMD) {
      copyToClipboard(mdValue)
    }
    Idb(db_img_config).then((img_db) => {
      img_db.insert({
        tableName: 'img',
        data: {
          id: uuid.generate(),
          name: FileItem.name,
          url: link,
          width: res.data.image_width,
          height: res.data.image_height,
          date: Date.now(),
        },
        success: () => console.log('添加成功'),
      })
    })
  }
  else {
    if (res.message === '请先登录') {
      toLogin()
    }
    else {
      Message.error(`上传失败:${res.message}`)
    }
  }
}

const resUrlKey = (FileItem) => {
  return getResponseImgUrlHttps(FileItem.response)
}

const handleTPaste = (event) => {
  if (!token.value) {
    toLogin()
    return
  }
  const image = getPasteImg(event)
  console.log(image)
  if (image) {
    fileList.value = [image]
    nextTick(() => {
      upload.value.submit(image)
    })
  }
}

const getToken = () => {
  browser.cookies.get({
    name: 'SESSDATA',
    url: homePage,
  }).then((res) => {
    console.log(res)
    if (res.value) {
      token.value = res.value
    }
  })
}

onMounted(() => {
  getToken()
  const localCopyStyle = localStorage.getItem('copyStyle')
  if (localCopyStyle) {
    copyStyle.value = localCopyStyle
  }
})

</script>
<style lang="scss">
.upload-main{
  background-color: var(--color-fill-2);
  color: var(--color-text-1);
  border: 1px dashed var(--color-fill-4);
  height: 93px;
  border-radius: 2px;
  line-height: 93px;
  text-align: center;
  width: 80%;
  margin: auto;
}

a {
  color: #F596AA;
  cursor: pointer;
}
.link {
  margin-bottom: 0!important;
}
.use-focus{
  position: absolute;
  left: -99999px;
}
.footer {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  color: gray;

  .author {
    color: rosybrown;
  }
}

</style>
