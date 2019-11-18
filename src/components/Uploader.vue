<template>
  <div class="main">
    <div class="header">
      <wired-link elevation="1" href="https://github.com/xlzy520/bilibili-img-uploader/blob/master/README.md"
                  target="_blank">如何获取SESSDATA？如何使用图片样式？</wired-link>
    </div>
    <div class="token">
      <label>SESSDATA：</label>
      <wired-input name="SESSDATA" placeholder="你的哔哩哔哩SESSDATA" maxlength="32"
                   :value="token" @input="token = $event.target.value"
                   ref="nameInput" class="token-input"></wired-input>
      <wired-button elevation="3" class="submit-btn" @click="saveToken">保存</wired-button>
    </div>
    <div class="upload">
      <el-upload drag
                 ref="upload"
                 accept="image/*,gif,jpg,jpeg,bmp,png"
                 name="file_up"
                 :with-credentials="true"
                 :data="uploadData"
                 :on-success="uploadSuccess"
                 multiple
                 action="https://api.vc.bilibili.com/api/v1/drawImage/upload">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <wired-button elevation="3" @click.stop="clearFileList" class="clear-btn">清空</wired-button>
      </el-upload>
    </div>
    <div class="result">
      <div class="link-area">
        <div class="link" v-for="link in links" :key="link.name">
          <label>{{link.name}}：</label>
          <div class="content">
            <wired-input type="text" :id="link.id" :value="link.value" class="link-result"
                         @input="link.value = $event.target.value"></wired-input>
            <wired-button elevation="3" @click="copyToClipboard(link.value)">复制</wired-button>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <img src="../../public/icons/favicon.png" width="32"/>
      By
      <wired-link elevation="1" class="author" href="https://github.com/xlzy520"
                  target="_blank">执笔看墨花开
      </wired-link>
    </div>
  </div>
</template>

<script>
  import { copyToClipboard, parseTime } from "../utils";
  import Idb from 'idb-js'
  import db_img_config from '../db_img_config'

  export default {
    name: 'Uploader',
    data() {
      return {
        token: '1946f169%2C1573178598%2C19b54fa1',
        links: [
          {name: '图片链接', id: 'img', value: ''},
          {name: 'MarkDown', id: 'markdown', value: ''},
        ],
        uploadData: {
          category: 'daily',
          biz: 'draw'
        }
      }
    },
    methods: {
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
          this.$message('上传成功,已复制原图链接')
          Idb(db_img_config).then(img_db=>{
            img_db.insert({
              tableName: "img",
              data: {
                name: file.name,
                url: link,
                width: res.data.image_width,
                height: res.data.image_height,
                date: parseTime()
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
      saveToken() {
        if (this.token.length !== 32) {
          this.$message('请输入32位SESSDATA', 'info')
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

  .main {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;

    .header {
      word-break: break-all;
    }

    .token {
      display: flex;
      align-items: center;
      /*justify-content: space-between;*/

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
        background: bisque;

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
  }

</style>
