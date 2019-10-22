$(function() {
  function addClass(el, cls) {
    if (!el) return;
    var curClass = el.className;
    var classes = (cls || '').split(' ');
    
    for (var i = 0, j = classes.length; i < j; i++) {
      var clsName = classes[i];
      if (!clsName) continue;
      
      if (el.classList) {
        el.classList.add(clsName);
      } else if (!hasClass(el, clsName)) {
        curClass += ' ' + clsName;
      }
    }
    if (!el.classList) {
      el.className = curClass;
    }
  };
  
  /* istanbul ignore next */
  function removeClass(el, cls) {
    if (!el || !cls) return;
    var classes = cls.split(' ');
    var curClass = ' ' + el.className + ' ';
    
    for (var i = 0, j = classes.length; i < j; i++) {
      var clsName = classes[i];
      if (!clsName) continue;
      
      if (el.classList) {
        el.classList.remove(clsName);
      } else if (hasClass(el, clsName)) {
        curClass = curClass.replace(' ' + clsName + ' ', ' ');
      }
    }
    if (!el.classList) {
      el.className = trim(curClass);
    }
  };
  const key = 'SESSDATA'
  let isConfig = Boolean(localStorage[key])
  const uptoken = '1946f169%2C1573178598%2C19b54fa1'
  // const uptoken = localStorage['SESSDATA']
  document.cookie = 'SESSDATA=' + uptoken
  const serverRegion = 'https://api.vc.bilibili.com/api/v1/drawImage/upload'
  const submit = document.querySelector('#submit')
  submit.addEventListener('click',()=>{
    chrome.cookies.set({
      domain: 'https://api.vc.bilibili.com',
      expirationDate: 1505720700,
      httpOnly: false,
      name:"SESSDATA111",
      path: "/",
      secure: false,
      url: serverRegion,
      sameSite: 'unspecified',
      value: uptoken,
    })
    const file = document.querySelector('#file')
    const formData = new FormData()
    formData.append('file_up', file.files[0])
    axios({
      method: 'post',
      url: 'https://api.vc.bilibili.com/api/v1/drawImage/upload',
      data: formData
    })
  })
  
  var uploader = WebUploader.create({
    auto: true,
    server: serverRegion,
    pick: '#pickfiles',
    resize: false,
    dnd: '#container',
    paste: document.body,
    disableGlobalDnd: false,
    accept: [
      {
        title: 'Images',
        extensions: 'gif,jpg,jpeg,bmp,png',
        mimeTypes: 'image/*'
      }
    ],
    compress: false,
    fileVal: 'file_up',
    threads: 5,
    fileNumLimit: 100,
    headers: {
      Cookie: 'ssss'
    },
    formData: {
      token: uptoken,
      category: 'daily',
      biz: 'draw'
    }
  })
  uploader.on('startUpload', () => {
    const tips = document.querySelector('.err')
    if (!isConfig) {
      removeClass(tips, 'hidden')
      return
    } else {
      addClass(tips, 'hidden')
      $('.status').css('display', 'flex')
      $('.words').html('上传中...')
    }
  })
  uploader.on('uploadSuccess', (file, res) => {
    $('.words').html('上传完成')
    setTimeout(() => {
      $('.status').css('display', 'none')
    }, 3000)
    $('#link-area').css('visibility', 'visible')
    console.log('response:', res)
    const link = '/' + res.key
    const markdownLink = `![](${link})`
    const aLink =`<img src="${link}" />`
    $('#link').val(link)
    $('#markdown').val(markdownLink)
    $('#a-link').val(aLink)
  })
  uploader.on('uploadError', (file, reason) => {
    if (reason === 'http') {
      reason = '请检查AK/SK等配置正确，然后重新开启本窗口'
    }
    $('.words').html(`上传失败: ${reason}`)
    $('.status').css('display', 'flex')
    $('.status img').css('display', 'none')
    setTimeout(() => {
      $('.status').css('display', 'none')
      $('.status img').css('display', 'unset')
    }, 5000)
    $('#link-area').css('visibility', 'visible')
  })
 
  $('#container')
    .on('dragenter', function(e) {
      e.preventDefault()
      $('#container').addClass('draging')
      e.stopPropagation()
    })
    .on('drop', function(e) {
      e.preventDefault()
      $('#container').removeClass('draging')
      e.stopPropagation()
    })
    .on('dragleave', function(e) {
      e.preventDefault()
      $('#container').removeClass('draging')
      e.stopPropagation()
    })
    .on('dragover', function(e) {
      e.preventDefault()
      $('#container').addClass('draging')
      e.stopPropagation()
    })

  $('#link-area button[data-action=copy]').on('click', function(e) {
    const btn = e.target
    const targetId = $(btn).attr('data-action-target')
    const val = $(targetId).val()
    copyToClipboard(val)
  })

  function copyToClipboard(input) {
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

    return success
  }
})
