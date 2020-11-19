import {Message} from "element-ui";

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
  } catch (err) {}
  
  document.body.removeChild(el)
  Message.success({
    message: '复制成功',
    duration: 1000
  })
  return success
}

export const parseTime = (time = new Date(), format = '{y}-{m}-{d} {h}:{i}:{s}') =>{
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

export const filterImages = (items) => {
  let i = 0
  while (i < items.length) {
    if (items[i].type.indexOf('image') !== -1) {
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
  } else if (e.clipboardData && e.clipboardData.getData) {
    value = e.clipboardData.getData('text/plain')
  }
  value = value.split('\r')
  return value[0]
}

export const getPasteImg = (event) => {
  if (event.clipboardData && event.clipboardData.items) {
    const image = filterImages(event.clipboardData.items)
    if (image) {
      event.preventDefault()
      var file = image.getAsFile()
      let name = getFilename(event) || 'image-' + Date.now() + '.png'
      file.uid = name
      return {
        name,
        raw: file,
        uid: name,
        status: 'ready'
      }
    }
  }
}
