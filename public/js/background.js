console.log('This is background page!');

let currentId = 0

chrome.browserAction.onClicked.addListener(function () {
  const w = 1000;
  const h = 600;
  const left = Math.round((window.screen.width / 2) - (w / 2));
  const top = Math.round((window.screen.height / 2) - (h / 2));
  function createWindow(){
    chrome.windows.create({
      url: 'popup.html',
      width: w,
      height: h,
      focused: true,
      'left': left,
      'top': top,
      type: 'popup'
    }, window => {
      if (window) {
        currentId = window.id
      }
    });
  }
  if (currentId) {
    chrome.windows.update(currentId, {
      focused: true
    }, window => {
      if (!window) {
        createWindow()
      }
    })
  }else {
    createWindow()
  }
  
});
