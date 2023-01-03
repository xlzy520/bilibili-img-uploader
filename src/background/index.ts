import browser from 'webextension-polyfill'
browser.runtime.onInstalled.addListener((): void => {
  console.log('Extension installed')
})
