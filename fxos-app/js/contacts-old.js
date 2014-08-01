App.ContactsManager = function() {
  var self=this;
  this.contactImages = {};
  this.pointer = 0;
  this.toImport = [];
  this.imageDownloader = new App.ImageDownloader();
  this.getList = function() {
    var url = 'http://' + App.getServerAddress() + ':' + App.getServerPort() + '/contacts/list';
    console.log('fetching ' + url);
    $.ajax({
      url : url,
      dataType: 'json',
      xhr : function() {
        return new XMLHttpRequest( { mozSystem : true } );
      },
      username : 'sync',
      password : App.getServerPassword(),
      success : function(response,status,xhr) {
        self.contacts = response;
        self.imageDownloader.downloadImages(self.contacts.people,self.contactImages,'contacts',self.importContactsScreen);
      },
      error : function(xhr,ajaxOptions,err) {
        App.Loading.close();
        alert('Error in downloading the contacts from remote host: ' + xhr.status);
      }
    });
  },
  this.startImport = function() {
    this.contactImages = {};
    this.pointer = 0;
    this.keys = {};
    this.contacts = null;
    App.Loading.show('Loading contact from remote host');
    self.getList();
  }
  this.importContactsScreen = function() {

    console.log(self.contacts.people.length);

    App.Loading.setMsg('Processing contacts');
    var container = document.createElement('div');
    var container1 = document.createElement('div');
    var container2 = document.createElement('div');

    container1.setAttribute('style','position:absolute;width:100%;overflow:scroll;')
    container2.setAttribute('style','position:fixed;width:100%;bottom:0px;left:0px;background-color:#000;padding-top:1em;padding-bototm:1em;z-index:500;')

    container1.style.height = $(window).height()-110+ 'px';

    var importButton = document.createElement('button');
    var cancelButton = document.createElement('button');

    importButton.setAttribute('style','padding:0px;margin:0px;width:48%;background-color:#fff;;margin-left:1%;margin-right:1%;margin-bottom:0.5em;');
    importButton.setAttribute('class','recommend');
    cancelButton.setAttribute('style','padding:0px;margin:0px;width:48%;background-color:#fff;;margin-left:1%;margin-right:1%;margin-bottom:0.5em;');

    importButton.innerHTML='Import';
    cancelButton.innerHTML='Cancel';

    var section = document.createElement('section');
    var header = document.createElement('header');
    var list = document.createElement('ul');

    section.setAttribute('data-type','list');
    header.innerHTML = 'Available contacts';

    for (var i in self.contacts.people) {
      console.log('Iterating');
      var uid = i;
      var c = self.contacts.people[i];
      var item = document.createElement('li');
      var p = document.createElement('p');
      var p2 = document.createElement('p');
      var displayName = []

      if (c.data.givenName.length > 0) displayName.push(c.data.givenName[0]);
      if (c.data.additionalName.length > 0) displayName.push(c.data.additionalName[0]);
      if (c.data.familyName.length > 0) displayName.push(c.data.familyName[0]);
      if (c.data.nickname.length > 0 && displayName.length == 0) displayName.push(c.data.nickName[0]);
      if (displayName.length == 0 && c.data.org.length > 0) {
        displayName.push(c.data.org[0]);
      } else if (displayName.length > 0 && c.data.org.length > 0) {
        p2.innerHTML=c.data.org[0];
      }

      if (displayName.length != 0) { //otherwise, contact si probably broken
        if (c.image && self.contactImages[uid]) {
            var aside = document.createElement('aside');
            var image = document.createElement('img');
            image.setAttribute('alt','avatar');
            image.onload = function() {
              URL.revokeObjectURL(self.contactImages[i]);
            }
            console.log("UID: " + uid + " Size: " + self.contactImages[uid].size);
            image.src = window.URL.createObjectURL(self.contactImages[uid]);
            aside.setAttribute('class','pack-end');
            aside.appendChild(image);
            item.appendChild(aside);
        }
      }
      p.innerHTML=displayName.join(' ');
      item.appendChild(p);
      if (p2.innerHTML != '') item.appendChild(p2);
      list.appendChild(item);
      item.setAttribute('data-do-import','true');
      item.setAttribute('data-contact-uid',i);
      item.onclick = function() {
        if (this.getAttribute('data-do-import') == "true") {
          this.setAttribute('data-do-import','false');
          this.style.opacity='0.2';
        } else {
          this.setAttribute('data-do-import','true');
          this.style.opacity='1';
        }
      }
    }

    cancelButton.onclick=function() {
      App.mainPage();
    }

    importButton.onclick=function() {
      self.importContacts();
    }
    
    section.appendChild(header);
    section.appendChild(list);
    container1.appendChild(section);
    container2.appendChild(cancelButton);
    container2.appendChild(importButton);

    container.appendChild(container1);
    container.appendChild(container2);
    App.Loading.close();
    App.switchScreen(container);
  }
  this.importContacts = function() {
    App.Loading.show('Import started');

    for (var i in self.contacts.people) {
      var item = $("li[data-contact-uid='" + i + "']");
      if (item.length == 1 && item[0].getAttribute('data-do-import') == 'true') {
        this.toImport.push(i);
      }
    }

    if (this.toImport.length > 0) {
      this.importContact(this.toImport[this.pointer]);
    }
  }
  this.importContact = function(uid) {
    console.log('importing ' + uid);
     var c = self.contacts.people[uid];
     var contact = new mozContact();

     contact.givenName = c['data']['givenName'];
     contact.familyName = c['data']['familyName'];
     contact.additionalName = c['data']['additionalName'];
     contact.nickname = c['data']['nickname'];
     contact.email = c['data']['emails'];
     contact.honorificPrefix = c['data']['honorificPrefix'];
     contact.honorificSuffix = c['data']['honorificSuffix'];
     contact.note = c['data']['note'];
     contact.tel = c['data']['tel'];
     contact.org = c['data']['org'];
     contact.adr = c['data']['adr'];
     contact.url = c['data']['url'];
     
     if (c['image'] && self.contactImages[uid]) {
        contact.photo = [self.contactImages[uid]];
     }
     var saving = navigator.mozContacts.save(contact);
     saving.onsuccess = function() {
       window.localStorage['c_uid2id']['uid'] = contact.id;
       self.finishImport();
     }
     saving.onerror = function(err) {
        this.finishImport();
        //TODO: Ok, some error handling would be nice here :D
     }

  }
  this.finishImport = function() {
    self.pointer++;
    if (self.pointer === self.toImport.length) {
      alert('Import finished');
      App.Loading.close();
      App.mainPage();
    } else {
      self.importContact(this.toImport[this.pointer]);
    }

  }
}
