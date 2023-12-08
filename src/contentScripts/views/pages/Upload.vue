<script setup>
import Idb from 'idb-js'
import uuid from 'uuidjs'
import { Button, Link, Message, Radio, RadioGroup, Tag, TypographyParagraph, Upload } from '@arco-design/web-vue'
import db_img_config from '../db_img_config'
import { copyText, getImgSize, getPasteImg } from '~/utils'

const homePage = 'https://bilibili.com'
const loginUrl = 'https://passport.bilibili.com/login'
// const uploadUrl = 'https://member.bilibili.com/x/vu/web/cover/up'
// const uploadUrl = 'https://member.bilibili.com/x/material/up/upload'
const uploadUrl = 'https://api.bilibili.com/x/dynamic/feed/draw/upload_bfs'
// const uploadUrl = 'https://api.vc.bilibili.com/api/v1/drawImage/upload'
const token = ref('')
const nickname = ref('')
const mid = ref('')
const face = ref('')

const uploadData = {
  biz: 'article',
  csrf: '',
}
const fileList = ref([])
const upload = ref(null)

const types = ref(['图片链接', 'MarkDown', 'B站短链'])

const links = ref([])

const copyStyle = ref('markdown')
const changeCopyStyle = (val) => {
  localStorage.setItem('copyStyle', val)
}

const toLogin = () => {
  Message.warning('未登录或登录已过期, 一秒后自动跳转登录页...')
  setTimeout(() => {
    window.open(loginUrl)
  }, 1000)
}

const getResponseImgUrlHttps = (res) => {
  if (res) {
    return res.data.image_url.replace('http', 'https')
  }
  return ''
}

const uploadSuccess = async (FileItem) => {
  const res = FileItem.response
  if (res.data?.image_url) {
    const link = getResponseImgUrlHttps(res)
    const copyMD = copyStyle.value === 'markdown'
    if (copyMD) {
      const mdValue = `![](${link})`
      links.value = [link, mdValue]
      copyText(mdValue)
    }
    else {
      const webpValue = `${link}@1e_1c.webp`
      links.value = [link, webpValue]
      copyText(webpValue)
    }
    const { width, height } = await getImgSize(FileItem.file)
    Idb(db_img_config).then((img_db) => {
      img_db.insert({
        tableName: 'img',
        data: {
          id: uuid.generate(),
          name: FileItem.name,
          url: link,
          width,
          height,
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

const handleTPaste = (event) => {
  if (!mid.value) {
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

const getCrsfToken = () => {
  const cookie = document.cookie
  const csrf = cookie.match(/bili_jct=(.+?);/)[1]
  uploadData.csrf = csrf
}

const getSpaceInfo = () => {
  return fetch('https://api.bilibili.com/x/space/myinfo', {
    credentials: 'include',
  }).then(res => res.json()).then((res) => {
    if (res.code === 0) {
      const { name, mid: m, face: f } = res.data
      nickname.value = name
      mid.value = m
      face.value = f
    }
  })
}

onMounted(() => {
  getSpaceInfo()
  getCrsfToken()
  const copyStyleLocal = localStorage.getItem('copyStyle')
  if (copyStyleLocal) {
    copyStyle.value = copyStyleLocal
  }
})
</script>

<template>
  <div class="upload-page border-top-line" @paste="handleTPaste">
    <input id="focus" autofocus focus class="use-focus">
    <div class="layout-slide p-2 switch-row token">
      <Tag color="#fb7299">
        默认复制格式
      </Tag>
      <RadioGroup v-model="copyStyle" @change="changeCopyStyle">
        <Radio value="markdown">
          markdown
        </Radio>
        <Radio value="webp">
          webp
        </Radio>
      </RadioGroup>
    </div>
    <div v-if="sessdata" class="layout-slide border-bottom p-2" />
    <div class="layout-slide p-2 switch-row token">
      <Tag color="#fb7299">
        当前账号信息
      </Tag>
      <div v-if="nickname" class="layout-items-center">
        <img :src="face" class="bili-avatar">
        <span class="ml-2">{{ nickname }}</span>
        <Tag v-if="mid" class="ml-2" color="#00a1d6">
          {{ mid }}
        </Tag>
      </div>

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
          <Button type="outline" size="small" @click="copyText(link)">
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
        执笔看墨花开（GitHub）
      </Link>
      <div class="mr-2">
        |
      </div>
      <Link
        class="author"
        href="https://space.bilibili.com/7560113"
        target="_blank"
      >
        Bilibili
      </Link>
    </div>
  </div>
</template>

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
.bili-avatar{
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
</style>
