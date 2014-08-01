App.Loading = {
  show : function(msg) {
    var form = document.createElement('form');
    var section = document.createElement('section');
    var header = document.createElement('h1');
    var p = document.createElement('p');
    var progress = document.createElement('progress');
    var menu = document.createElement('menu');
    var button = document.createElement('button');
    
    form.setAttribute('role','dialog');
    form.setAttribute('id','loadingScreen');
    form.setAttribute('data-type','confirm');
    header.innerHTML=msg;
    header.setAttribute('style','text-align:center;');
    header.setAttribute('id','waitingMsg');
    p.setAttribute('style','text-align:center;');
    p.appendChild(progress);

    section.appendChild(header);
    section.appendChild(p);

    button.setAttribute('class','full danger');
    button.innerHTML='Cancel';

    button.onclick = function() {
      App.Loading.close();
      App.mainPage();
    }

    menu.appendChild(button);

    form.appendChild(section);
    form.appendChild(menu);

    document.body.appendChild(form);
  },
  setMsg : function(msg) {
     if (document.getElementById('loadingScreen')) document.getElementById('waitingMsg').innerHTML=msg
  },
  close : function() {
    if (document.getElementById('loadingScreen')) document.body.removeChild(document.getElementById('loadingScreen'));
  }
}
