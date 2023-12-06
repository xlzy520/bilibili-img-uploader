import browser from 'webextension-polyfill'
browser.runtime.onInstalled.addListener((): void => {
  console.log('Extension installed')
})

browser.action.onClicked.addListener(async () => {
  const tabs = await browser.tabs.query({
    active: true,
    currentWindow: true,
    status: 'complete',
  })
  const currentTab = tabs[0]
  if (currentTab?.url?.includes('/zhibi-image-upload')) {
    return
  }
  browser.tabs.create({
    url: 'https://www.bilibili.com/zhibi-image-upload',
  })
})
