import { Message } from '@arco-design/web-vue'
import { dayjs } from '@arco-design/web-vue/es/_utils/date'

export const copyToClipboard = function(input) {
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
  }
  catch (err) {}

  document.body.removeChild(el)
  Message.success('复制成功')
  return success
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
      return {
        name,
        file,
        raw: file,
        uid: name,
        status: 'ready',
      }
    }
  }
}

export const fetchShortUrl = (link) => {
  const url = 'https://service-ijd4slqi-1253419200.gz.apigw.tencentcs.com/release/bsu?url='
  const encodeLink = encodeURIComponent(link)
  return fetch(url + encodeLink).then((res) => {
    return res.json()
  }).then((res) => {
    if (res.success) {
      const shortUrl = res.short_url
      copyToClipboard(shortUrl)
      return shortUrl
    }
    else {
      copyToClipboard(link)
    }
  })
}
