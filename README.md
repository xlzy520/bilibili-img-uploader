# bilibili_img_uploader(Chrome)
哔哩哔哩图片上传插件，可以用于作为一个图床,国内速度快,多种图片格式选择。
由于发布到Chrome插件市场需要收费，所以推荐直接下载解压之后用Chrome类浏览器手动导入安装即可。


### 下载
[下载](https://github.com/xlzy520/bilibili-img-uploader/releases/latest)

### 安装步骤
1. 进入`拓展程序`,可以通过地址栏输入`chrome://extensions/`，也可以从 `更多工具`->`拓展程序`进入
2. 右上角开启`开发者模式`
3. 左侧点击 `加载已解压的拓展程序`,然后选择上面下载好的压缩包解压后的文件夹即可。

### 本地开发
1. 执行`npm run build`, `watch`构建结果
2. 上一步(安装步骤)将文件夹选择为`dist`文件夹
3. 更新代码之后直接刷新页面即可

### 使用方法
https://github.com/xlzy520/blog/issues/22

### 原理
**调用上传图片api接口(不仅限于B站)，通过Chrome插件的能力，给接口带上自定义的`cookie`**
```js
// 核心
chrome.cookies.set({
    url: 'https://api.vc.bilibili.com', 
    name: 'SESSDATA', 
    value: this.token
  }, (data) => console.log(data));
```

### TODO
- 增加标签属性与筛选条件


### ChangeLog
> 1. 导出数据库数据
> 2. 上传成功后自动复制原图链接
> 3. 文件多选上传
> 4. 增加`date`字段，默认最新日期在最上面
> 5. 增加名称筛选搜索
> 6. 删除表格操作中`文章封面`、`jpg`按钮
> 7. 增加图片样式使用页
> 8. `wired-tab`切换为`el-tab`
> 9. 增加上传列表清空按钮
> 10. 增加直接复制MD图片链接(webp)
> 11. 增加JSON数据导入功能(新)
> 11. 增加筛选、分页、排序功能(新)
> 12. 增加粘贴上传功能
> 13. 增加删除功能

### 获取SESSDATA
登录哔哩哔哩→F12打开控制台→Application→Cookies→SESSDATA

### 截屏
![](https://i0.hdslb.com/bfs/album/5552e9dba6da58b77ff48c20ceab84a974ffdd05.jpg)
![](https://i0.hdslb.com/bfs/album/06f93bd913407db0f8e3a2094b5f8d27dee863a8.png)

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
| 原图  | baseURL/1.jpg  |
| 原分辨率，质量压缩  | baseURL/1.jpg@1e_1c.jpg  |
| 规定宽，高度自适应，质量压缩  | baseURL/1.jpg@104w_1e_1c.jpg   |
| 规定高，宽度自适应，质量压缩  | baseURL/1.jpg@104h_1e_1c.jpg   |
| 规定高宽，质量压缩  | baseURL/1.jpg@104w_104h_1e_1c.jpg   |
| 原分辨率，webp格式(占用最小)   | baseURL/1.jpg@104w_104h_1e_1c.webp |
| 规定高度，webp格式(占用最小)   | baseURL/1.jpg@104w_104h_1e_1c.webp |

格式：(图像原链接)@(\d+[whsepqoc]_?)*(\.(|webp|gif|png|jpg|jpeg))?$
- w:[1, 9223372036854775807] (width，图像宽度)
- h:[1, 9223372036854775807] (height，图像高度)
- s:[1, 9223372036854775807] (作用未知)
- e:[0,2] (resize，0:保留比例取其小，1:保留比例取其大，2:不保留原比例，不与c混用)
- p:[1,1000] (默认100，放大倍数，不与c混用)
- q:[1,100] (quality，默认75，图像质量)
- o:[0,1] (作用未知)
- c:[0,1] (clip，0:默认，1:裁剪)
- webp,png,jpeg,gif(不加则保留原格式)
- 不区分大小写，相同的参数后面覆盖前面
- 计算后的实际w*h不能大于原w*h，否则wh参数失效

