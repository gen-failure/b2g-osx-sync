App.Confirm = {
  show : function(header,msg,callback) {
    var form = document.createElement('form');
    var section = document.createElement('section');
    var heading = document.createElement('h1');
    var p = document.createElement('p');
    var menu = document.createElement('menu');

    var okButton = document.createElement('button');
    var cancelButton = document.createElement('button');

    form.setAttribute('role','dialog');
    form.setAttribute('data-type','confirm');
    form.setAttribute('id','confirmScreen');
    heading.innerHTML=header;
    p.innerHTML=msg;
    okButton.innerHTML='Continue';
    okButton.setAttribute('class','recommend');
    cancelButton.innerHTML='Cancel';
    
    okButton.onclick = function() {
      callback();
    }
    cancelButton.onclick = App.Confirm.close;
    
    section.appendChild(heading);
    section.appendChild(p);

    menu.appendChild(cancelButton);
    menu.appendChild(okButton);

    form.appendChild(section);
    form.appendChild(menu);

    document.body.appendChild(form);
  },
  close : function() {
    if (document.getElementById('confirmScreen')) document.body.removeChild(document.getElementById('confirmScreen'));
  }
}
