# B站图床、短链(Firefox、Chrome、Edge)
哔哩哔哩图床插件，速度快,多种图片压缩格式选择，自动读取Bilibili的Cookie，不再需要手动输入。
基于[vitesse-webext](https://github.com/xlzy520/vitesse-webext) 重构

### 说明(2023-12-06)
由于B站将之前的图片上传接口返回的图片链接不是永久的了，其他接口又因为`Origin`会被拦截，因此在`v2.2.0`版本之后，不会在右上角打开弹窗了，而是打开一个不存在的B站页面并注入插件。

### 在线安装
[Chrome、Edge](https://chrome.google.com/webstore/detail/b%E7%AB%99%E5%9B%BE%E5%BA%8A/domljbndjbjgpkhdbmfgmiclggdfojnd?hl=zh-CN)

[Firefox](https://addons.mozilla.org/addon/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%9B%BE%E5%BA%8A/)

### 在线使用
假如有需要使用Web版本的图床上传工具，那么可以使用这个地址，但是需要填写自己B站的SESSDATA和bili_jct，如果您有顾虑，还是建议使用客户端版

[Web在线版](https://www.xiaojuzi.fun/bili-short-url/upload.html)

### 本地安装
[下载](https://jiali0126.oss-cn-shenzhen.aliyuncs.com/share/extension.zip)

### 安装步骤
1. 进入`拓展程序`,可以通过地址栏输入`chrome://extensions/`，也可以从 `更多工具`->`拓展程序`进入
2. 右上角开启`开发者模式`
3. 左侧点击 `加载已解压的拓展程序`,然后选择上面下载好的压缩包解压后的文件夹即可。

### 本地开发(支持热更新)
1. 执行`npm i`或者`pnpm i`, 执行`npm run dev`或`pnpm run dev`
2. 上一步(安装步骤)将文件夹选择为`extension`文件夹

### 构建
执行`npm run build`或`pnpm run build`

### 截屏
![](https://i0.hdslb.com/bfs/album/c081e84238f29bbede300dff5d79112ef79d5985.png)
![](https://i0.hdslb.com/bfs/album/a841a115dff5f4141c2d44650ea44c2ac259ab64.png)

### 哔哩哔哩上传接口返回格式
```json
{
    "code": 0,
    "message": "success",
    "data": {
        "image_url": "http://i0.hdslb.com/bfs/album/104c4f1ae6b66d78a5952a191281ec7883dc5c5c.jpg",
        "image_width": 818,
        "image_height": 1000
    }
}
```

### 图片样式
| Type  | Url     |
| ------| --------|
| 原图  | `baseURL/1.jpg` |
| 原分辨率，质量压缩  | `baseURL/1.jpg@.jpg` |
| 规定宽，高度自适应，质量压缩  | `baseURL/1.jpg@104w.jpg` |
| 规定高宽，拉伸，质量压缩  | `baseURL/1.jpg@104w_104h_2e.jpg` |
| 规定高宽，裁剪，质量压缩  | `baseURL/1.jpg@104w_104h_1c.jpg` |
| 原分辨率，webp格式(占用最小)   | `baseURL/1.jpg@.webp` |

格式：(图像原链接)@(\d+[whsepqoc]_?)*(\.(|webp|gif|png|jpg|jpeg))?$
- w:[1, 9223372036854775807] (width，图像宽度)
- h:[1, 9223372036854775807] (height，图像高度)
- s:[1, 9223372036854775807] (截取gif的前多少帧)
- e:[0,2] (resize，0:保留比例取其小，1:保留比例取其大，2:不保留原比例)
- p:[1,100] (默认100，放大倍数)
- q:[1,100] (quality，默认75，图像质量)
- o:[0,1] (作用未知)
- c:[0,1] (clip，0:默认，1:裁剪)
- webp,png,jpeg,gif(不加则保留原格式)
- 不区分大小写，相同的参数后面覆盖前面
- 计算后的实际`w*h`不能大于原`w*h`，否则wh参数失效

另外：

- 1c、2e混用取2e，和0e、1e混用取1c
- w、h混用，则只取宽w，除非指定裁剪1c
- p和w、h混用，则计算指定宽高后的缩放
- 参数为0则相当于不写，例如`1.jpg@104w_0e.jpg`和`1.jpg@104w.jpg`是一样的


### 防盗链解决方案
#### 全站图片使用
在html的head标签中设置如下标志，那么全站资源引用都不会携带referrer

```html
<meta name="referrer" content="no-referrer">
```
#### 单个图片使用
```html
<img src="xxx" referrerpolicy="no-referrer">
```
#### 新窗口打开
主要设置rel="noreferrer"，使用window.open打开的话是会默认携带referrer的，第一次还是会403

```html
<a rel="noreferrer" target="_blank"></a>
```

## 感谢

> 本项目得到以下项目的支持与帮助，在此表示衷心的感谢！

+ [antfu/vitesse-webext](https://github.com/antfu/vitesse-webext)
+ [<img src="https://resources.jetbrains.com/storage/products/company/brand/logos/jb_beam.svg" alt="GitHub license" style="zoom:50%;" />](https://jb.gg/OpenSourceSupport)  (License Certificate for JetBrains All Products Pack)
