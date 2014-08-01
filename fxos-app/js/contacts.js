App.ContactsManager = function() {
  var self=this;
  this.contactImages = {};
  this.pointer = 0;
  this.toImport = [];
  this.getList = function() {
    var url = 'http://' + App.getServerAddress() + ':' + App.getServerPort() + '/contacts/list';
    console.log('fetching ' + url);
    $.ajax({
      url : url,
      dataType: 'text',
      xhr : function() {
        return new XMLHttpRequest( { mozSystem : true } );
      },
      username : 'sync',
      password : App.getServerPassword(),
      success : function(response,status,xhr) {
        self.contacts = response;
        self.showScreen();
      },
      error : function(xhr,ajaxOptions,err) {
        App.Loading.close();
        console.log('Failed!');
        alert('Error in downloading the contacts from remote host: ' + App.getAppUrl());
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
  this.showScreen = function() {
    var list = [];
    var selected = [];
    for (var i in this.contacts) {
      selected.push(i);
      var c = this.contacts[i];
      var displayName = [];
      var item = {};
      item.key = i;

      if (c.data.givenName.length > 0) displayName.push(c.data.givenName[0]);
      if (c.data.additionalName.length > 0) displayName.push(c.data.additionalName[0]);
      if (c.data.familyName.length > 0) displayName.push(c.data.familyName[0]);
      if (c.data.nickname.length > 0 && displayName.length == 0) displayName.push(c.data.nickName[0]);
      if (displayName.length == 0 && c.data.org.length > 0) {
        displayName.push(c.data.org[0]);
      } else if (displayName.length > 0 && c.data.org.length > 0) {
        item.text2=c.data.org[0];
      }
      
      item.text1 = displayName.join(' ');
      if (c.image) {
        item.imageUrl= App.getAppUrl() + 'contacts/image/' + i
      }
      if (window.localStorage.getItem('c_updates_' + i) != c.data.modificationDate) {
        item.selected=true;
        console.log(window.localStorage.getItem('c_updates_5FEE5D58-A4B2-4673-A460-A21FD69414CC:ABPerson'));
        console.log('selected');
      } else {
        console.log("It's not selected")
        item.selected=false;
      }
      list.push(item);
    }
    this.screen = new App.UI.IEScreen();
    this.screen.header='Contacts on mac';
    this.screen.data=list;
    this.screen.show();
    this.screen.onAction=this.importContacts;
  }
  this.importContacts = function(list) {
    App.Loading.show('Import started');
    self.pointer = 0;
    self.toImport = list;
    if (self.toImport.length > 0) {
      self.importContact(self.toImport[self.pointer]);
    }
  }
  this.importContact = function(uid) {
    console.log('importing ' + uid);
     var c = self.contacts[uid];
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
     
     if (c['image'] && this.screen.images[uid]) {
        contact.photo = [self.screen.images[uid]];
     }
     var saving = navigator.mozContacts.save(contact);
     saving.onsuccess = function() {
       console.log('contact saved');
       window.localStorage.setItem('c_uid2id_' + uid, contact.id);
       window.localStorage.setItem('c_updates_' + uid, c['data']['modificationDate']);
       console.log('setting c_updates_' + uid + ' ' +  c['data']['modificationDate']);
       self.finishImport();
     }
     saving.onerror = function(err) {
       console.log('error in saving contact' + err);
       self.finishImport();
        //TODO: Ok, some error handling would be nice here :D
     }

  }
  this.finishImport = function() {
    self.pointer++;
    if (self.pointer === self.toImport.length) {
      alert('Import finished');
      App.mainPage();
    } else {
      self.importContact(self.toImport[self.pointer]);
    }

  }
}
