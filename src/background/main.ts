// import { sendMessage, onMessage } from 'webext-bridge'
// import { Tabs } from 'webextension-polyfill'

// only on dev mode
import Browser from 'webextension-polyfill'

if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import('/@vite/client')
  // load latest content script
  import('./contentScriptHMR')
}

browser.runtime.onInstalled.addListener((): void => {
  // eslint-disable-next-line no-console
  console.log('Extension installed')
})
browser.runtime.onMessage.addListener((request) => {
  console.log(request)
  const { type, data } = request
  if (type === 'upload') {
    fetch('https://api.vc.bilibili.com/api/v1/drawImage/upload', {
      method: 'POST',
      body: data,
    })
  }
})

console.log('This is background page!')

// const previousTabId = 0

// communication example: send previous tab title from background page
// see shim.d.ts for type declaration
// browser.tabs.onActivated.addListener(async({ tabId }) => {
//   if (!previousTabId) {
//     previousTabId = tabId
//     return
//   }
//
//   let tab: Tabs.Tab
//
//   try {
//     tab = await browser.tabs.get(previousTabId)
//     previousTabId = tabId
//   }
//   catch {
//     return
//   }
//
//   // eslint-disable-next-line no-console
//   console.log('previous tab', tab)
//   sendMessage('tab-prev', { title: tab.title }, { context: 'content-script', tabId })
// })
//
// onMessage('get-current-tab', async() => {
//   try {
//     const tab = await browser.tabs.get(previousTabId)
//     return {
//       title: tab?.title,
//     }
//   }
//   catch {
//     return {
//       title: undefined,
//     }
//   }
// })
