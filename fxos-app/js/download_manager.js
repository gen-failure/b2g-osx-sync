App.DownloadManager = function() {
  var self = this;
  this.init = function() {
    this.toDownload = [];
    this.pointer = 0;
    this.container = null;
    this.callback = null;
  };
  this.downloadFiles = function(list,container,callback) {
    this.container = container;
    this.callback = callback;
    this.toDownload = list;

    if (self.toDownload.length > 0) {
      this.downloadFile();
    } else {
      this.callback();
    }
  };
  this.downloadFile = function() {
    var xhr = new XMLHttpRequest({mozSystem: true});
    var uid = uid;
    var url = this.toDownload[this.pointer].url;
    console.log('downloading ' + url);
    xhr.open("GET",url,true,'sync',App.getServerPassword());
    xhr.responseType = 'arraybuffer';

    xhr.onload = function() {
      self.container[self.toDownload[self.pointer].key] = new Blob([this.response], {type: this.getResponseHeader("Content-Type")});
      self.finishDownload();
    }
    xhr.onerror = function() {
      console.log('file download failed ' + self.toDownload[self.pointer].key);
      self.finishDownload();
    }
    xhr.send();
  };
  this.finishDownload = function(){
    console.log('called finish download');
    self.pointer++;
    if ((self.pointer) === self.toDownload.length) {
      self.callback();
      self.init();
    } else {
      self.downloadFile();
    }
  }
  this.init();
}
