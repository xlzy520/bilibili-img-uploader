chrome.browserAction.onClicked.addListener(function (tab) {
    var w = 1000;
    var h = 600;
    var left = Math.round((screen.width / 2) - (w / 2));
    var top = Math.round((screen.height / 2) - (h / 2));
    chrome.windows.create({
        url: 'index.html',
        width: w,
        height: h,
        focused: true,
        'left': left,
        'top': top,
        type: 'popup'
    });
});

chrome.cookies.set(
  {
    url: 'https://www.baidu.com', name: 'DEV_NOREDIRECT', value: "true"
  }, (data) => console.log(data)
);
