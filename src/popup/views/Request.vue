<template>
  <div class="request">
    <h3>TODO</h3>
    <div class="todo">
      通过设置自定义URL，请求方式，该域名下权限校验的cookie的name，自动获取到值，并设置自定义传参，进行接口请求，
      可以当做是一个postman
    </div>
    <div>
      <h3>例如直接通过已经登录过B站的浏览器获取B站的注册时间：</h3>
      <p class="">domain: https://bilibili.com</p>
      <p class="">url: {{url}}</p>
      <p class="">cookie auth name:  SESSDATA</p>

      <p class="">
        token： {{token}}    (根据填入的url和cookie的key自动获取)
      </p>
      <p>请求方式： get</p>
      <p>请求结果：</p>
      <p class="el-button--warning">注册时间: {{result.jointime}}</p>

    </div>
  </div>
</template>

<script>
  import { copyToClipboard, parseTime, getPasteImg } from "../../utils";
  import Idb from 'idb-js'
  import db_img_config from '../db_img_config'
  import uuid from 'uuidjs'

  export default {
    name: 'Uploader',
    data() {
      return {
        uploadAction: this.$uploadUrl,
        token: '1946f169%2C1573178598%2C19b54fa1',
        url: 'https://member.bilibili.com/x2/creative/h5/calendar/card?ts=1576425600&spm_id_from=333.788.b_636f6d6d656e74.6',
        links: [
          {name: '图片链接', id: 'img', value: ''},
          {name: 'MarkDown', id: 'markdown', value: ''},
        ],
        uploadData: {
          category: 'daily',
          biz: 'draw'
        },
        fileList: [],
        result: ''
      }
    },
    methods: {
      getBiliCookie(){
        chrome.cookies.get(
            {
              url: 'https://bilibili.com', name: 'SESSDATA'
            }, (data) => {
              console.log(data)
              if (data.value) {
                this.token = data.value
              }
            }
        );
      },
      fetch(){
        fetch(this.url, {
          method: 'get',
        }).then(res=> res.json()).then(res=>{
          console.log(res);
          this.result = res.data
        })
      }
    },
    mounted() {
      this.getBiliCookie()
      this.fetch()
    },
  }
</script>
<style lang="less">
 .todo{

 }
</style>
