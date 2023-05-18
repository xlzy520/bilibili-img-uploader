import { Message } from '@arco-design/web-vue'
import { dayjs } from '@arco-design/web-vue/es/_utils/date'

export const copyText = (text) => {
  return window.navigator.clipboard.writeText(text).then(() => {
    Message.success('复制成功')
  })
}

export const filterImages = (items) => {
  let i = 0
  while (i < items.length) {
    if (items[i].type.includes('image')) {
      return items[i]
    }
    i++
  }
  return false
}
export const getFilename = (e) => {
  let value
  if (window.clipboardData && window.clipboardData.getData) {
    value = window.clipboardData.getData('Text')
  }
  else if (e.clipboardData && e.clipboardData.getData) {
    value = e.clipboardData.getData('text/plain')
  }
  value = value.split('\r')
  return value[0]
}

export const formatDate = (date = new Date()) => {
  return dayjs(date).format('YYYY-MM-DD')
}

export const getPasteImg = (event) => {
  if (event.clipboardData && event.clipboardData.items) {
    const image = filterImages(event.clipboardData.items)
    if (image) {
      event.preventDefault()
      const file = image.getAsFile()
      const name = getFilename(event) || `image-${Date.now()}.png`
      file.uid = name
      const url = URL.createObjectURL(file)
      return {
        name,
        file,
        raw: file,
        uid: name,
        status: 'ready',
        url,
      }
    }
  }
}

// 从本地上传的图片或者粘贴的图片中得到他们的分辨率
export const getImgSize = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      })
    }
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}
