# bilibili_img_uploader(Chrome)
哔哩哔哩图片上传插件，可以用于作为一个图床,国内速度快,多种图片格式选择，因为发布要钱，所以推荐直接下载然后用Chrome类浏览器打开安装即可。[直接下载](https://github.com/xlzy520/bilibili-img-uploader/releases/tag/v1.0)

### 获取SESSDATA
登录哔哩哔哩→F12打开控制台→Application→Cookies→SESSDATA

### 截屏
![](https://i0.hdslb.com/bfs/album/91db493a39a808b4f492fabcd897ea2f18afaf5e.jpg)
![](https://i0.hdslb.com/bfs/album/c5b5b03fe0d59db5627d4ec98c72c54abee60d3a.jpg)

### 下载
[下载](https://github.com/xlzy520/bilibili-img-uploader/releases/tag/v1.0)

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

