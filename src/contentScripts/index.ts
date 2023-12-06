import { createApp } from 'vue'
import App from './views/App.vue'

import '../styles/main.scss'
import './layout.scss'

import '@arco-design/web-vue/dist/arco.min.css'

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
(() => {
  if (location.pathname === '/zhibi-image-upload') {
    document.body.innerHTML = ''
    const container = document.createElement('div')
    container.id = 'app'
    const root = document.createElement('div')
    const styleEl = document.createElement('link')
    const shadowDOM = container
    styleEl.setAttribute('rel', 'stylesheet')
    styleEl.setAttribute('href', browser.runtime.getURL('dist/contentScripts/style.css'))
    shadowDOM.appendChild(styleEl)
    shadowDOM.appendChild(root)
    document.body.appendChild(container)
    createApp(App).mount(root)
  }
})()
