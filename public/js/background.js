chrome.browserAction.onClicked.addListener(function (tab) {
    var w = 500;
    var h = 450;
    var left = Math.round((screen.width / 2) - (w / 2));
    var top = Math.round((screen.height / 2) - (h / 2));
    chrome.windows.create({
        url: 'popup.html',
        width: w,
        height: h,
        focused: true,
        'left': left,
        'top': top,
        type: 'popup'
    });
});
