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
