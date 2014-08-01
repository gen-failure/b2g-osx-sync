App.UI.IEScreen = function() {
  var self = this;
  this.data = [];
  this.header = "";
  this.actionText = "Import";
  this.cancelText = "Cancel";
  this.screen = null;
  this.searchMode = "t1" // t1 - search only in mail label, t2, search only in  secondary label, t12 search in both labels
  this.images = {}

  this.actions = {
    'Select all' : function() {
        $('li.IECollectionItem').attr('data-selected', 'true');
        $('li.IECollectionItem').css('opacity', 1);
      },
    'Unselect all' : function() {
        $('li.IECollectionItem').attr('data-selected', 'false');
        $('li.IECollectionItem').css('opacity', 0.5);
      }
  };

  this.onAction = function() {
    console.log('Action called');
  }

  this.onCancel = function() {
    App.mainPage();
  }

  this.sortDataByKeyAZ = function() {
    this.data.sort(function (a, b) {
       var as = a['key'];
       var bs = b['key'];
       return as == bs ? 0 : (as > bs ? 1 : -1);
    });
  }

  this.sortDataByKeyZA = function() {
    this.data.sort(function (a, b) {
       var as = a['key'];
       var bs = b['key'];
       return as == bs ? 0 : (as < bs ? 1 : -1);
    });
  }
  this.sortDataByPropAZ = function(prop) {
    this.data.sort(function (a, b) {
       var as = a['object']['data'][prop];
       var bs = b['object']['data'][prop];
       return as == bs ? 0 : (as > bs ? 1 : -1);
    });
  }

  this.sortDataByPropZA = function(prop) {
    this.data.sort(function (a, b) {
       var as = a['object']['data'][prop];
       var bs = b['object']['data'][prop];
       return as == bs ? 0 : (as < bs ? 1 : -1);
    });
  }

  this.show = function() {
    this.downloadImages();
  }

  this.downloadImages = function() {
    var list = [];
    var downloader = new App.DownloadManager();
    for(var i=0;i<this.data.length;i++) {
      if (this.data[i].imageUrl) {
        list.push({'key' : this.data[i].key, 'url' : this.data[i].imageUrl });
      }
    }
    downloader.downloadFiles(list,this.images,this.prepareHeader);
  }

  this.prepareHeader = function() {
    App.prepareHeaderActions = self.actions;
    self.showScreen();
  }
  this.showScreen = function() {
    var container = document.createElement('div');
    var container1 = document.createElement('div');
    var container2 = document.createElement('div');

    //Search form!
    var form = document.createElement('form');
    var fsb = document.createElement('button');
    var fp = document.createElement('p');
    var fi = document.createElement('input');
    var frb = document.createElement('button');

    form.setAttribute('role','search');
    form.setAttribute('class','full');
    form.setAttribute('style','top:-8px;z-index:25;');
    
    fsb.setAttribute('type','submit');
    fsb.innerHTML='Send';
    fi.setAttribute('type','text');
    fi.setAttribute('Placeholder','Search...');
    fi.setAttribute('required','');
    fi.setAttribute('id','IEScreenSearchField');
    fi.setAttribute('style','z-index:15;');

    fi.oninput = function() {
      self.updateList(this.value);
    }

    frb.setAttribute('type','reset');
    frb.innerHTML='Clear';

    form.appendChild(fsb);
    fp.appendChild(fi);
    fp.appendChild(frb);
    form.appendChild(fp);

    container1.setAttribute('style','position:absolute;width:100%;overflow:scroll;')
    container2.setAttribute('style','position:fixed;width:100%;bottom:0px;left:0px;background-color:#000;padding-top:1em;padding-bototm:1em;z-index:500;')

    container1.style.height = $(window).height()-153+ 'px';

    var actionButton = document.createElement('button');
    var cancelButton = document.createElement('button');

    actionButton.setAttribute('style','padding:0px;margin:0px;width:48%;background-color:#fff;;margin-left:1%;margin-right:1%;margin-bottom:0.5em;');
    actionButton.setAttribute('class','recommend');
    cancelButton.setAttribute('style','padding:0px;margin:0px;width:48%;background-color:#fff;;margin-left:1%;margin-right:1%;margin-bottom:0.5em;');

    actionButton.innerHTML=this.actionText;
    cancelButton.innerHTML=this.cancelText;

    var section = document.createElement('section');
    var header = document.createElement('header');
    var list = document.createElement('ul');

    section.setAttribute('data-type','list');
    header.innerHTML = this.header;

    for(var i in this.data) {
      var item = document.createElement('li');
      var p = document.createElement('p');
      var p2 = document.createElement('p');

      item.setAttribute('class', 'IECollectionItem');
      item.setAttribute('data-collection-key', this.data[i].key);
      
      if (this.data[i].selected) {
        item.setAttribute('data-selected','true');
        item.style.opacity='1';
      } else {
        item.setAttribute('data-selected','false');
        item.style.opacity='0.5';
      }

      p.setAttribute('class','IECollectionText1');
      p2.setAttribute('class','IECollectionText2');

      if (self.images[this.data[i].key]) {
          var aside = document.createElement('aside');
          var image = document.createElement('img');
          image.setAttribute('alt','avatar');
          image.onload = function() {
            URL.revokeObjectURL(self.images[self.data[i].key]);
          }
          image.src = window.URL.createObjectURL(self.images[self.data[i].key]);
          aside.setAttribute('class','pack-end');
          aside.appendChild(image);
          item.appendChild(aside);
      }

      p.innerHTML=this.data[i]['text1'];

      if (this.data[i]['text2']) p2.innerHTML = (this.data[i]['text2']);

      item.onclick = function() {
        if (this.getAttribute('data-selected') == "true") {
          this.setAttribute('data-selected','false');
          this.style.opacity='0.5';
        } else {
          this.setAttribute('data-selected','true');
          this.style.opacity='1';
        }
      }

      item.appendChild(p);
      item.appendChild(p2);
      list.appendChild(item);
    }

    actionButton.onclick=function() {
      self.onAction(self.getSelected());
    }
    cancelButton.onclick=function() {
      self.onCancel();
    }


    section.appendChild(header);
    section.appendChild(list);

    container1.appendChild(section);
    container2.appendChild(cancelButton);
    container2.appendChild(actionButton);
    container.appendChild(form);
    container.appendChild(container1);
    container.appendChild(container2);

    this.screen = container
    App.switchScreen(this.screen);
  }
  this.getSelected = function() {
    var list = [];
    var items = document.getElementsByClassName('IECollectionItem');
    for (var i = 0;i<items.length;i++) {
      if (items[i].getAttribute('data-selected') == 'true') list.push(items[i].getAttribute('data-collection-key'));
    }
    return list;
  }
  this.updateList = function(str) {
    var items = document.getElementsByClassName('IECollectionItem');
    var str = str.toLowerCase();
    for (var i in items) {
      if (str != "") {
        switch(this.searchMode) {
          case 't1':
            if (items[i].getElementsByClassName('IECollectionText1')[0].innerHTML.toLowerCase().indexOf(str) != -1) {
              items[i].style.display='block';
            } else {
              items[i].style.display='none';
            }
            break;
          case 't2':
            if (items[i].getElementsByClassName('IECollectionText2')[0].innerHTML.toLowerCase().indexOf(str) != -1) {
              items[i].style.display='block';
            } else {
              items[i].style.display='none';
            }
            break;
          case 't12':
            if (items[i].getElementsByClassName('IECollectionText1')[0].innerHTML.toLowerCase().indexOf(str) != -1 || items[i].getElementsByClassName('IECollectionText2')[0].innerHTML.toLowerCase().indexOf(str)) {
              items[i].style.display='block';
            } else {
              items[i].style.display='none';
            }
            break;
        }
      } else {
        items[i].style.display='block';

      }
    }
  }
}
