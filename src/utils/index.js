import { Message } from '@arco-design/web-vue'
import { dayjs } from '@arco-design/web-vue/es/_utils/date'
import Browser from 'webextension-polyfill'

export function copyToClipboard(input, { target = document.body } = {}) {
  const element = document.createElement('textarea')
  const previouslyFocusedElement = document.activeElement

  element.value = input

  // Prevent keyboard from showing on mobile
  element.setAttribute('readonly', '')

  element.style.contain = 'strict'
  element.style.position = 'absolute'
  element.style.left = '-9999px'
  element.style.fontSize = '12pt' // Prevent zooming on iOS

  const selection = document.getSelection()
  const originalRange = selection.rangeCount > 0 && selection.getRangeAt(0)

  target.append(element)
  element.select()

  // Explicit selection workaround for iOS
  element.selectionStart = 0
  element.selectionEnd = input.length

  let isSuccess = false
  try {
    isSuccess = document.execCommand('copy')
  }
  catch {}

  element.remove()

  if (originalRange) {
    selection.removeAllRanges()
    selection.addRange(originalRange)
  }

  // Get the focus back on the previously focused element, if any
  if (previouslyFocusedElement && previouslyFocusedElement.focus) {
    previouslyFocusedElement.focus()
  }

  Message.success(isSuccess ? '复制成功' : '复制失败')

  return isSuccess
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

export const fetchShortUrl = (link, copyShortURL = true) => {
  const url = 'https://service-ijd4slqi-1253419200.gz.apigw.tencentcs.com/release/bsu?url='
  const encodeLink = encodeURIComponent(link)
  console.log(encodeLink)
  return fetch(url + encodeLink).then((res) => {
    return res.json()
  }).then((res) => {
    console.log(res)
    if (res.success) {
      const shortUrl = res.short_url
      if (copyShortURL) {
        copyToClipboard(shortUrl)
      }
      return shortUrl
    }
    else {
      copyToClipboard(link)
    }
  })
}

export function getCurrentTab() {
  return new Promise((resolve, reject) => {
    browser.tabs
      .query({
        active: true,
        currentWindow: true,
      })
      .then((tabs) => {
        const tab = tabs[0]
        if (tab) resolve(tab)
        else reject(new Error('tab not found'))
      })
  })
}

export const sendMessage = (message) => {
  getCurrentTab().then((tab) => {
    const { id } = tab
    if (id) {
      browser.tabs.sendMessage(id, message)
    }
  })
}

export const sendMessageToBilibili = (message) => {
  browser.tabs
    .query({
      url: 'https://www.bilibili.com/*',
    })
    .then((tabs) => {
      console.log(tabs)
      const tab = tabs[0]
      if (tab) {
        Browser.tabs.update(tab.id, {
          active: true,
        }).then((res) => {
          browser.tabs.sendMessage(tab.id, message)
        })
      }
      else {
        Browser.tabs.create({
          active: true,
          url: 'https://www.bilibili.com/?needToast=true',
        }).then((res) => {
          browser.tabs.sendMessage(res.id, message)
        })
      }
    })
}

export function ajax(URL, { body = {}, method = 'GET' } = {}) {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest()
    req.open(method, URL, true)
    req.onload = function() {
      if (req.status === 200) {
        resolve(req.responseText)
      }
      else {
        reject(new Error(req.statusText))
      }
    }
    req.onerror = function() {
      reject(new Error(req.statusText))
    }
    req.send(body)
  })
}
