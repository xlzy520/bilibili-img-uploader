import { Message } from '@arco-design/web-vue'
import { dayjs } from '@arco-design/web-vue/es/_utils/date'

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
