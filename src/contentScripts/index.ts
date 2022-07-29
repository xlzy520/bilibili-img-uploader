/* eslint-disable no-console */
// import { onMessage } from 'webext-bridge'
// import { createApp } from 'vue'
// import App from './views/App.vue'
import axios from 'axios'

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value

(() => {
  console.info('hello')
  console.log(location)
  if (location.search.includes('needToast')) {
    window.alert('B站图床插件已装载，请重新打开插件进行上传')
  }

  browser.runtime.onMessage.addListener((request) => {
    console.log(request)
    const { type, data } = request

    if (type === 'upload') {
      const { url, config, fileInfo } = data

      const formData = new FormData()
      Object.keys(config).forEach((key) => {
        formData.append(key, config[key])
      })
      axios.defaults.withCredentials = true
      fetch(url).then(res => res.blob()).then((res) => {
        const file = new File([res], fileInfo.name, { type: res.type })
        formData.append('file_up', file)
        axios.post('https://api.vc.bilibili.com/api/v1/drawImage/upload', formData).then((res) => {
          console.log(res)
          browser.runtime.sendMessage({
            type: 'uploadSuccess',
            data: {
              ...res.data,
              name: fileInfo.name,
            },
          })
        }).catch((err) => {
          browser.runtime.sendMessage({ type: 'uploadError', data: err })
        })
      })
    }
  })

  // communication example: send previous tab title from background page
  // onMessage('tab-prev', ({ data }) => {
  //   console.log(`[vitesse-webext] Navigate from page "${data.title}"`)
  // })

  // mount component to context window
  // const container = document.createElement('div')
  // const root = document.createElement('div')
  // const styleEl = document.createElement('link')
  // const shadowDOM = container.attachShadow?.({ mode: __DEV__ ? 'open' : 'closed' }) || container
  // styleEl.setAttribute('rel', 'stylesheet')
  // styleEl.setAttribute('href', browser.runtime.getURL('dist/contentScripts/style.css'))
  // shadowDOM.appendChild(styleEl)
  // shadowDOM.appendChild(root)
  // document.body.appendChild(container)
  // createApp(App).mount(root)
})()
