;(function(doc) {
  var oOpenModBtn = doc.getElementsByClassName('js-open-mod-btn')[0],
      oCloseModBtn = doc.getElementsByClassName('js-close-mod-btn')[0],
      oUploadMod = doc.getElementsByClassName('js-upload-mod')[0],
      oUploadArea = oUploadMod.getElementsByClassName('js-upload-area')[0],
      oProgressBar = oUploadArea.getElementsByClassName('js-progress-bar')[0],
      oPercent = oUploadArea.getElementsByClassName('js-percent')[0],
      oVideoInput = doc.getElementById('js-video-file'),
      maxSize = 3221225472;

  var init = function() {
    bindEvent();
  }

  function bindEvent() {
    oOpenModBtn.addEventListener('click', showModal.bind(null, true), false);
    oCloseModBtn.addEventListener('click', showModal.bind(null, false), false);
    oVideoInput.addEventListener('change', uploadFile, false);
  }

  function showModal(show) {
    if(show) {
      oUploadMod.className += ' show';
      oUploadArea.className = 'upload-area js-upload-area btn';
      oProgressBar.style.width = 0;
    }else {
      oUploadMod.className = 'upload-mod-wrap js-upload-mod';
    }
  }

  function uploadFile() {
    var oFile = this.files[0];

    if(!oFile) {
      return;
    }

    var fileName = oFile.name,
        fileSize = oFile.size;

    if(!/\.(mp4)$/.test(fileName)) {
      console.log('你上传的《' + fileName + '》文件不是MP4视频格式');
      return;
    }

    if(fileSize > maxSize) {
      console.log('你上传的《' + fileName + '》文件超出可上传的最大值');
      return;
    }

    doUpload(oFile);
  }

  function doUpload(file) {
    var fd = new FormData();
    fd.append('file', file);

    var o = window.XMLHttpRequest ?
            new window.XMLHttpRequest() :
            new ActiveXObject('Microsoft.XMLHTTP');

    o.open('post', 'server/upload.php');

    oUploadArea.className = 'upload-area js-upload-area uploading';

    o.upload.onprogress = function(e) {
      var e = e || window.event;
      oProgressBar.style.width = e.loaded / e.total * 100 + '%';
      oPercent.innerHTML = (e.loaded / e.total * 100).toFixed(1) + '%';

    }

    o.upload.onload = function() {
      oUploadArea.className = 'upload-area js-upload-area uploading finished';
      oPercent.innerHTML = '0.0%';
    }

    o.send(fd);
  }

  init();
})(document);