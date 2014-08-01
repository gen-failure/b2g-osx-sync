App.MediaManager = function() {
  var self = this;
  this.init = function() {
    this.pointer = 0;
    this.musicViewType = 'album'
    this.musicTracks = [];
    this.musicAlbumArtworks = {};
    this.musicAlbums = {};
    this.tracksToDownload = [];
    this.success = 0;
    this.failed = 0;
    this.musicStorage = navigator.getDeviceStorage('music');
  }
  this.startMusicImport = function() {
    App.Loading.show('Loading music from remote host (this can take a while!)');
    this.getMusicList();
  }
  this.getMusicList = function() {
    var url = 'http://' + App.getServerAddress() + ':' + App.getServerPort() + '/media/music/list';
    console.log('fetching ' + url);
    $.ajax({
      url : url,
      dataType: 'json',
      username: 'sync',
      password : App.getServerPassword(),
      xhr : function() {
        return new XMLHttpRequest( { mozSystem : true } );
      },
      success : function(response,status,xhr) {
        self.musicTracks = response;
        self.musicImportScreen();
      },
      error : function(xhr,ajaxOptions,err) {
        App.Loading.close();
        alert('Error in downloading media from remote host ' + App.getAppUrl());
      }
    });
  }
  this.musicImportScreen = function() {
    switch(this.musicViewType) {
      case 'album':
        this.prepareMusicAlbumView();
        break;
    }
  }
  this.prepareMusicAlbumView = function() {
    App.Loading.setMsg('Processing media list');
    this.musicAlbums = {};
    for (var t in this.musicTracks) {
      if (this.musicAlbums[this.musicTracks[t].album] == null) {
        this.musicAlbums[this.musicTracks[t].album] = {}
        this.musicAlbums[this.musicTracks[t].album].duration = 0;
        this.musicAlbums[this.musicTracks[t].album].size = 0;
        this.musicAlbums[this.musicTracks[t].album].image = false;
        this.musicAlbums[this.musicTracks[t].album].tracks = [];
        this.musicAlbums[this.musicTracks[t].album].artist = []
      }
      this.musicAlbums[this.musicTracks[t].album].duration += this.musicTracks[t].duration;
      this.musicAlbums[this.musicTracks[t].album].size += this.musicTracks[t].size;
      if (this.musicTracks[t].images > 0) {
        this.musicAlbums[this.musicTracks[t].album].image = true;
      }
      this.musicAlbums[this.musicTracks[t].album].tracks.push(this.musicTracks[t].id);
      if (this.musicTracks[t].artist != '' && this.musicAlbums[this.musicTracks[t].album].artist.indexOf(this.musicTracks[t].artist != -1)) {
        this.musicAlbums[this.musicTracks[t].album].artist.push(this.musicTracks[t].artist);
      }
    }

    this.musicAlbumView();
  }
  this.musicAlbumView = function() {
    
    var list = [];

    for(var a in this.musicAlbums) {
      var item = {};
      item.key = a;
      item.text1 = a;
      item.text2 = this.musicAlbums[a].tracks.length + ' Songs, ' + this.formatDuration(this.musicAlbums[a].duration) + ' ' + this.formatSize(this.musicAlbums[a].size);
      if (this.musicAlbums[a].image) {
        item.imageUrl = App.getAppUrl() + "media/music/album/image/" + btoa(encodeURIComponent(a));
      }
      list.push(item);
    }
    this.screen = new App.UI.IEScreen();
    this.screen.header = 'Remote music albums';
    this.screen.data = list;
    this.screen.onAction = self.downloadMusicAlbums;
    this.screen.show();
  }
  this.formatDuration = function(d) {
    var hours = Math.floor(d/3600);
    var minutes = Math.floor((d - (hours*3600)) /60);

    return hours + 'h ' + minutes +'min';
  }
  this.formatSize =function(s) {
    var size = Math.round(s/1024/1024);

    return size + ' MB';
  }
  this.downloadMusicAlbums = function(albums) {
    if (albums.lenght == 0) {
      alert('Nothig to import');
      return(false);
    }
    self.tracksToDownload = [];
    self.downloadSize = 0;
    for (var i in albums) {
      var album = albums[i];
      self.downloadSize += self.musicAlbums[album].size;
      for (var i2 in self.musicAlbums[album].tracks) {
        var track = self.musicAlbums[album].tracks[i2];
        self.tracksToDownload.push(track);
      }
    }
    var r = self.musicStorage.freeSpace();

    r.onsuccess = function() {
      if (this.result > self.downloadSize) {
        self.downloadMusicTracks();
      } else {
        alert('Not enough space. You are importing ' + self.formatSize(self.downloadSize) + ' but you have only ' + self.formatSize(this.result));
      }
    }
    r.onerror = function() {
      alert('Failed to get free space on device');
    }
  }
  this.downloadMusicTracks = function() {
    this.pointer = 0;
    this.failed = 0;
    this.success = 0;
    App.Loading.show('Downloading 1 of ' + this.tracksToDownload.length);
    new App.MediaTrackDownload('music',this.tracksToDownload[this.pointer],this.finishMusicDownload);
  }

  this.finishMusicDownload = function() {
    self.pointer++;
    console.log(self.pointer + '    ' + self.tracksToDownload.length);
    if (self.pointer === self.tracksToDownload.length) {
      App.Loading.close();
      alert('Download finished');
    } else {
      console.log('Starting new music track download');

      App.Loading.setMsg('Downloading ' + (self.pointer+1) + ' of ' + self.tracksToDownload.length);
      new App.MediaTrackDownload('media',self.tracksToDownload[self.pointer],self.finishMusicDownload,self.finishMusicDownload);
    }
  }
  this.init();
}


downloadMediaTrack = function(storage,url,filename,type,okCallback,errorCallback,user,pass) {
    var self = this;

    self.callback = okCallback;
    self.errorCallback = errorCallback;
    self.type = type;

    self.filename = filename;

    self.chunkArray = [];
    self.chunkIterator = -1;
    self.chunkIterator2 = -1;
    self.chunksSaved = 0;
    self.finished = false;

    self.xhr = new XMLHttpRequest({mozSystem: true});
    self.xhr.url = url;
    self.xhr.open('GET',url,true,user,pass);
    self.xhr.responseType = 'moz-chunked-arraybuffer';

    self.xhr.onprogress = function() {
        self.chunkIterator++;
        console.log('Incrementing chunk from ' +self.chunkIterator);
        console.log("I am saving " + self.chunkName(self.chunkIterator));
        localForage.setItem(self.chunkName(self.chunkIterator),self.xhr.response,function() {
            self.chunksSaved++;
        });
    }

    self.xhr.onload = function() {
        console.log('Ok, onload was called');
        self.assembleChunks();
    }

    self.xhr.onerror = function() {
        self.errorCallback();
        delete(self);
    }

    self.assembleChunks = function() {
        self.chunkIterator2++;
        console.log('Appending ' + self.chunkName(self.chunkIterator2) + 'to blob Arrays');
        localForage.getItem(self.chunkName(self.chunkIterator2),function(chunk) {
            self.chunkArray.push(chunk);
            console.log(self.chunkIterator + ' vs ' + self.chunkIterator2);
            if (self.chunkIterator > self.chunkIterator2) {
                console.log('assembling next chunks');
                self.assembleChunks();
            } else {
                console.log('chunks complete, going to save the file!');
                self.saveFile();
            }
        });
    }

    self.chunkName = function(n) {
        return 'chunk-' + self.filename + '-chunk-' + String(n);
    }

    self.saveFile = function() {
        var blob = new Blob(self.chunkArray,{type : self.type});
        var request = navigator.getDeviceStorage(storage).addNamed(blob,self.filename);

        request.onsuccess = function() { self.callback(); delete (self);}
        request.onerror = function(e) {
            console.log(">>> " + this.error.name);
            self.errorCallback();
            delete(self);
        }
    }

    self.xhr.send();
}
