<template>
  <div class="main" @paste="handleTPaste">
    <div class="header">
<!--      <el-link elevation="1" href="https://github.com/xlzy520/bilibili-img-uploader/blob/master/README.md"-->
<!--                  target="_blank">如何获取SESSDATA？如何使用图片样式？</el-link>-->
    </div>
    <div class="token">
      <label>SESSDATA：</label>
      <el-input placeholder="你的哔哩哔哩SESSDATA" v-model="token" class="token-input"></el-input>
      <el-button type="success" class="ml-30" round @click="getBiliCookie">获取cookie</el-button>
      <el-button type="primary" round class="submit-btn" @click="saveToken">保存</el-button>
    </div>
    <div class="upload">
      <el-upload drag
                 ref="upload"
                 accept="image/*"
                 name="file_up"
                 :with-credentials="true"
                 :data="uploadData"
                 :file-list="fileList"
                 :on-success="uploadSuccess"
                 multiple
                 :action="uploadAction">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">支持任意处粘贴文件上传</div>
        <el-button elevation="3" @click.stop="clearFileList" class="clear-btn">清空</el-button>
      </el-upload>
    </div>
    <div class="result">
      <div class="link-area">
        <div class="link" v-for="link in links" :key="link.name">
          <label>{{link.name}}：</label>
          <div class="content">
            <el-input v-model="link.value" :id="link.id" class="link-result"></el-input>
            <el-button type="primary" class="ml-30" round @click="copyToClipboard(link.value)">复制</el-button>

          </div>
        </div>
      </div>
    </div>
    <div class="cheat">
      <div class="cheat-title">哔哩哔哩参数表</div>
      <img src="/assets/img-help.jpg" width="">
    </div>
    <div class="footer">
      <img src="/icons/favicon.png" width="32"/>
      By
      <el-link elevation="1" class="author" href="https://github.com/xlzy520"
                  target="_blank">执笔看墨花开
      </el-link>
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
        links: [
          {name: '图片链接', id: 'img', value: ''},
          {name: 'MarkDown', id: 'markdown', value: ''},
        ],
        uploadData: {
          category: 'daily',
          biz: 'draw'
        },
        fileList: []
      }
    },
    methods: {
      handleTPaste (event) {
        const image = getPasteImg(event)
        if (image) {
          this.fileList.push(image)
          this.$nextTick(() => {
            this.$refs.upload.submit();
          })
        }
      },
      clearFileList(){
        this.$refs.upload.clearFiles()
        this.$message('清空上传列表')
      },
      uploadSuccess(res, file){
        if (res.message === 'success') {
          const link = res.data.image_url.replace('http', 'https')
          this.links[0].value = link
          this.links[1].value = `![](${link})`
          const img = document.querySelector('#img')
          const markdown = document.querySelector('#markdown')
          img.value = this.links[0].value
          markdown.value = this.links[1].value
          this.copyToClipboard(img.value)
          Idb(db_img_config).then(img_db=>{
            img_db.insert({
              tableName: "img",
              data: {
                id: uuid.generate(),
                name: file.name,
                url: link,
                width: res.data.image_width,
                height: res.data.image_height,
                date: Date.now()
              },
              success: () => console.log("添加成功")
            });
          })
        } else {
          this.$message('上传失败:' + res.message,'error')
        }
      },
      copyToClipboard(input) {
        copyToClipboard(input)
      },
      getBiliCookie(){
        chrome.cookies.get(
            {
              url: 'https://bilibili.com', name: 'SESSDATA'
            }, (data) => {
              console.log(data)
              if (data.value) {
                this.token = data.value
                this.saveToken()
              }
            }
        );
      },
      saveToken() {
        if (!this.token) {
          this.$message('请输入SESSDATA', 'info')
        } else {
          localStorage.setItem('SESSDATA', this.token)
          chrome.cookies.set(
            {
              url: 'https://api.vc.bilibili.com', name: 'SESSDATA', value: this.token
            }, (data) => console.log(data)
          );
          this.$message('保存成功')
        }
      }
    },
    mounted() {
      const token = localStorage.getItem('SESSDATA')
      if (token) {
        this.token = token
      } else {
        this.getBiliCookie()
      }
    },
  }
</script>
<style lang="less">
  :host {
    display: block;
    padding: 16px;
  }

  a {
    color: #F596AA;
    cursor: pointer;
  }

  label {
    width: 100px;
  }

  .ml-30{
    margin-left: 30px!important;
  }

  .main {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;

    .header {
      word-break: break-all;
    }
    .cheat-title{
      font-size: 20px;
      font-weight: bold;
      color: #333;
      padding: 10px 0;
      border-top: 1px solid #e4e4e4;
      margin-top: 30px;
    }

    .token {
      display: flex;
      align-items: center;
      margin-left: 100px;

      .token-input {
        font-size: 15px;
        width: 310px;
        /*height: 40px;*/
        line-height: 40px;
      }

      .submit-btn {
        height: 33px;
      }
    }

    .upload {
      text-align: center;
      padding: 15px 0;

      .el-upload-dragger {
        height: 120px;

        .el-icon-upload {
          margin: 20px 0 16px;
        }
      }
      .clear-btn{
        position: relative;
        left: 146px;
        bottom: 27px;
        background: #ccc;
      }
    }

    .result {
      .link-area {
        .link {
          display: flex;
          align-items: center;
          margin-bottom: 10px;

          .link-result {
            width: 310px;
          }
        }
      }
    }

  }

</style>
