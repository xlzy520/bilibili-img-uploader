<template>
  <div class="main">
    <div class="header">
      <wired-link elevation="1" href="https://github.com/xlzy520/bilibili-img-uploader/blob/master/README.md" target="_blank">如何获取SESSDATA？</wired-link>
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
                 accept="image/*,gif,jpg,jpeg,bmp,png"
                 name="file_up"
                 :with-credentials="true"
                 :data="uploadData"
                 :on-success="uploadSuccess"
                 action="https://api.vc.bilibili.com/api/v1/drawImage/upload">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
    </div>
    <div class="result">
      <div class="link-area">
        <div class="link" v-for="link in links" :key="link.name">
          <label>{{link.name}}：</label>
          <div class="content">
            <wired-input type="text" :value="link.value" class="link-result"
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
  import {Message} from 'element-ui'

  export default {
    name: 'Uploader',
    data() {
      return {
        token: '1946f169%2C1573178598%2C19b54fa1',
        links: [
          {name: '图片链接', value: ''},
          {name: 'MarkDown', value: ''},
        ],
        uploadData: {
          category: 'daily',
          biz: 'draw'
        }
      }
    },
    methods: {
      uploadSuccess(res){
        console.log(res);
        if (res.message === 'success') {
          const link = res.data.image_url
          this.links[0].value = '/' + link
          this.links[1].value = `![](${link})`
          Message.success({
            message: '上传成功',
            duration: 1000
          })
        } else {
          Message.error({
            message: '上传失败' + res.message,
            duration: 1000
          })
        }
      },
      copyToClipboard(input) {
        const el = document.createElement('textarea')
        el.style.fontsize = '12pt'
        el.style.border = '0'
        el.style.padding = '0'
        el.style.margin = '0'
        el.style.position = 'absolute'
        el.style.left = '-9999px'
        el.setAttribute('readonly', '')
        el.value = input

        document.body.appendChild(el)
        el.select()

        let success = false
        try {
          success = document.execCommand('copy', true)
        } catch (err) {}

        document.body.removeChild(el)
        Message.success({
          message: '复制成功',
          duration: 1000
        })
        return success
      },

      copy() {

      },
      saveToken() {
        if (this.token.length !== 32) {
          Message.info({
            message: '请输入32位SESSDATA',
            duration: 1000
          })
        } else {
          localStorage.setItem('SESSDATA', this.token)
          const cookie = {
            domain: "www.baidu.com",
            hostOnly: true,
            httpOnly: false,
            name: "SESSDATA",
            path: "/",
            sameSite: "unspecified",
            secure: false,
            session: true,
            storeId: "0",
            value: "121d3as1d2sad2sad"
            }
          chrome.cookies.set(
            {
              url: 'https://api.vc.bilibili.com', name: 'SESSDATA', value: this.token
            }, (data) => console.log(data)
          );
          // chrome.cookies.set(cookie,function (cookie) {
          //   console.log(cookie);
          // })
          Message.success({
            message: '保存成功',
            duration: 1000
          })
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
    }

    .result {
      .link-area {
        .link {
          display: flex;
          align-items: center;
          margin-bottom: 20px;

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
