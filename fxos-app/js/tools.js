App.Tools = {
  clearContacts : function() {
    App.Loading.show('Clearing contact list');
    var request = navigator.mozContacts.clear();
    request.onload = function() {
       alert('Contacts cleared');
       App.mainPage();
     }
     request.onerror = function(err) {
       alert('failed to remove contacts ' + JSON.stringify(err));
       App.mainPage();
     }
  },
  page : function() {
    var container = document.createElement('div');
    container.setAttribute('class','appDiv');
    var rCButton = document.createElement('button');
    var tButton = document.createElement('button');
    var backButton = document.createElement('button');
    rCButton.innerHTML='Clear contacts';

    tButton.innerHTML='Test Download';
    backButton.innerHTML='Back to main page';

    rCButton.setAttribute('class','danger');

    tButton.onclick = function() {
        downloadMediaTrack('music','http://10.0.1.2:19090/media/music/track/503134AB16B9070E','test.mp3','audio/mpeg',function() {
          alert('ano!!!!');
        }, function() {
            alert(this.error.name);
        },'sync','123456');
    }

    rCButton.onclick = function() {
      App.Confirm.show('Warning!', 'This will remove ALL contacts stored on your device. Do you really wants to proceed? (some builds of Firefox OS may require to close your contact application first)',App.Tools.clearContacts);
    }

    backButton.onclick = function() {
      App.mainPage();
    }
    container.appendChild(rCButton);
    container.appendChild(tButton);
    container.appendChild(backButton);
    App.switchScreen(container);
  }
}
