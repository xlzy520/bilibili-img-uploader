<template>
  <div class="main">
    <div class="header">
      <wired-link elevation="1" href="http://www.baidu.com" target="_blank">如何获取SESSDATA？</wired-link>
    </div>
    <div class="token">
      <wired-input name="SESSDATA" placeholder="你的哔哩哔哩SESSDATA" maxlength="32"
                   :value="token" @input="token = $event.target.value"
                   ref="nameInput" class="token-input"></wired-input>
      <wired-button elevation="1" class="submit-btn">保存</wired-button>
    </div>
    <div class="upload"></div>
    <div class="result">
      <div class="status">
        <img src="@/assets/suc.png" alt="上传成功">
        <div class="words"></div>
      </div>
      <div id="link-area">
        <div class="link form-group">
          <label for="content">图片链接</label>
          <div class="content" id="content">
            <input type="text" class="form-control" name="link" id="link">
            <button type="button" class="input-action" data-action="copy" data-action-target="#link" value="">copy
            </button>
          </div>
        </div>
        <div class="link form-group">
          <label for="content2">MarkDown</label>
          <div class="content" id="content2">
            <input type="text" class="form-control" name="markdown" id="markdown">
            <button type="button" class="input-action" data-action="copy" data-action-target="#markdown" value="">copy
            </button>
          </div>
        </div>
        <div class="link form-group">
          <label for="content3">HTML</label>
          <div class="content" id="content3">
            <input type="text" class="form-control" name="a-link" id="a-link">
            <button type="button" class="input-action" data-action="copy" data-action-target="#a-link" value="">copy
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      By
      <wired-link elevation="1" class="author" href="https://github.com/xlzy520"
                  target="_blank">执笔看墨花开</wired-link>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Uploader',
    data() {
      return {
        token: '1946f169%2C1573178598%2C19b54fa1'
      }
    },
    methods: {
      tokenChange(val) {
        console.log(val);
        this.token = val
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
  .main {
    height: 100vh;
    position: relative;
    .header{
      word-break: break-all;
    }
    .token{
      display: flex;
      justify-content: space-between;
      .token-input{
        font-size: 18px;
        width: 360px;
        /*height: 40px;*/
        line-height: 40px;
      }
      .submit-btn{
        width: 100px;
        height: 33px;
      }
    }
    .footer {
      width: 100%;
      position: absolute;
      bottom: 10px;
      text-align: center;
      color: gray;
    }
  }

</style>
