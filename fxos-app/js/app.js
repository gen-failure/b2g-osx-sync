App = {
  headerActions : {},
  prepareHeaderActions : {},
  getServerAddress : function() {
    if (window.localStorage['serverAddress'] == null) {
      return ""
    } else {
      return String(window.localStorage['serverAddress']) }
  },
  getServerPort : function() {
    var port = window.localStorage['serverPort'] || 19099
    return parseInt(port)
  },
  getAppUrl : function() {
    return('http://' + App.getServerAddress() + ':' + App.getServerPort() + '/');
  },
  getServerPassword : function() { return String(window.localStorage['serverPassword']) },
  setServerAddress : function(address) { window.localStorage['serverAddress'] = address },
  setServerPort : function(port) { window.localStorage['serverPort'] = port },
  setServerPassword : function(password) { window.localStorage['serverPassword'] = password },
  saveSettings : function() {
    App.setServerAddress(document.getElementById('serverField').value);
    App.setServerPort(document.getElementById('portField').value);
    App.setServerPassword(document.getElementById('passwordField').value);
    alert('Settings saved');
    App.mainPage();
  },
  init: function() {
    App.contactImages = {};
    App.contactsManager = new App.ContactsManager();
    App.mediaManager = new App.MediaManager();

    $.ajaxSetup({
      xhr: function() {
        return new window.XMLHttpRequest( {
          mozSystem: true
        } );
      }
    } );
    document.getElementById('appMenuIcon').onclick = function() {
      App.switchDrawer();
    }
    App.mainPage();
  },
  switchDrawer : function() {
    if (document.getElementById('appHeader').getAttribute('data-type') == 'sidebar') {
      document.getElementById('appHeader').setAttribute('data-type','none');
      document.getElementById('appSidebar').style.visibility='hidden';
      document.getElementById('appHeader').style.zIndex='5';
    } else {
      document.getElementById('appHeader').setAttribute('data-type','sidebar');
      document.getElementById('appSidebar').style.visibility='visible';
      document.getElementById('appHeader').style.zIndex='15';
    }
  },
  mainPage : function() {
    var container = document.createElement('div');
    container.setAttribute('class','appDiv');
    var contactsButton = document.createElement('button');
    var musicButton = document.createElement('button');
    var settingsButton = document.createElement('button');
    var toolsButton = document.createElement('button');
    var aboutButton = document.createElement('button');

    contactsButton.innerHTML='Contacts';
    musicButton.innerHTML='Music';
    settingsButton.innerHTML='Settings';
    toolsButton.innerHTML='Tools';
    aboutButton.innerHTML='About this app';

    container.appendChild(contactsButton);
    container.appendChild(musicButton);
    container.appendChild(settingsButton);
    container.appendChild(toolsButton);
    container.appendChild(aboutButton);

    settingsButton.onclick = function() {
      App.editSettings();
    }

    musicButton.onclick = function() {
      App.mediaManager.startMusicImport();
    }

    toolsButton.onclick = function() {
      App.Tools.page();
    }
    contactsButton.onclick = function() {
      App.contactsManager.startImport();
    }
    $('#content').empty();
    App.switchScreen(container);
  },
  editSettings: function() {
    var form = document.createElement('form');
    var fs = document.createElement('fieldset');
    var l = document.createElement('legend');
    form.setAttribute('class','appDiv');
    l.innerHTML='Host';
    var sec = document.createElement('section');
    var sec2 = document.createElement('section');
    var container = document.createElement('div');
    var heading = document.createElement('h2');
    heading.innerHTML='Edit settings';
    container.setAttribute('id','editOptions');
    var p1 = document.createElement('p');
    var p2 = document.createElement('p');

    var serverField = document.createElement('input');
    var portField = document.createElement('input');
    var passwordField = document.createElement('input');

    serverField.setAttribute('placeholder','address');
    portField.setAttribute('placeholder','port');
    passwordField.setAttribute('placeholder','password');

    serverField.setAttribute('id','serverField');
    portField.setAttribute('id','portField');
    passwordField.setAttribute('id','passwordField');

    serverField.setAttribute('type','text');
    portField.setAttribute('type','number');
    passwordField.setAttribute('type','password');

    serverField.setAttribute('value',App.getServerAddress());
    portField.setAttribute('value',App.getServerPort());
    passwordField.setAttribute('value',App.getServerPassword());

    var cancelButton = document.createElement('button');
    var submitButton = document.createElement('button');

    cancelButton.setAttribute('type','reset');
    submitButton.setAttribute('type','submit');

    submitButton.onclick = function() {
      App.saveSettings();
    }
    cancelButton.onclick = function() {
      App.mainPage();
    }

    submitButton.setAttribute('class','recommend');
    cancelButton.innerHTML='Cancel';
    submitButton.innerHTML='Save';

    p1.appendChild(serverField);
    p1.appendChild(portField);
    p1.appendChild(passwordField);

    p2.appendChild(cancelButton);
    p2.appendChild(submitButton);

    sec.appendChild(p1);
    fs.appendChild(l);
    fs.appendChild(sec);
    form.appendChild(fs);    
    form.appendChild(p2);    
    container.appendChild(form);
    $('#content').empty();
    App.switchScreen(container);
  },
  switchScreen : function(element) {
    document.getElementById('appHeader').setAttribute('data-type','none');
    App.headerActions = {};
    $('#content').empty();
    $('#appSidebarList').empty();
    var actionKeys = Object.keys(App.prepareHeaderActions);
    if (actionKeys.length > 0) {
      App.headerActions = App.prepareHeaderActions;

      document.getElementById('appHeader').setAttribute('data-type','none');
      document.getElementById('appSidebar').style.visibility='hidden';
      document.getElementById('appHeader').style.zIndex='5';
      
      for (var i in actionKeys) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        var action = App.headerActions[actionKeys[i]];

        a.innerHTML= actionKeys[i];
        li.onclick = function() {
          console.log($(this).find('a')[0].innerHTML);
          App.headerActions[$(this).find('a')[0].innerHTML]();
          document.getElementById('appHeader').setAttribute('data-type','none');
          document.getElementById('appSidebar').style.visibility='hidden';
          document.getElementById('appHeader').style.zIndex='5';
        }
        li.appendChild(a);
        document.getElementById('appSidebarList').appendChild(li);
      }
      document.getElementById('headerToolbar').style.visibility='visible';
      App.prepareHeaderActions = {};
      //App.headerActions = {};
    } else {
      document.getElementById('appHeader').style.zIndex='5';
      document.getElementById('headerToolbar').style.visibility='hidden';
    }
    $(element).appendTo('#content').hide().fadeToggle();
    App.Loading.close();
  }
}
$(document).ready(function() {
  App.init();
  $('#content')[0].style.height = $(window).height()-60 + 'px;'; 
  $('#content')[0].style.top='60px'; 
});
