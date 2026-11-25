(function(){
  var start=new Date(2026,10,20), end=new Date(2027,1,17), DAY=864e5;
  var now=new Date(), today=new Date(now.getFullYear(),now.getMonth(),now.getDate());
  var n=Math.floor((today-start)/DAY)+1, total=90;
  var num=document.getElementById('dnum'), lbl=document.getElementById('dlbl');
  var fill=document.getElementById('pfill'), bar=document.getElementById('pbar');
  var pct=0, phase=-1;
  if(today<start){
    var d=Math.ceil((start-today)/DAY);
    num.textContent=d; lbl.textContent=d===1?'day to launch':'days to launch';
  }else if(today>end){
    num.textContent=total; lbl.textContent='days complete'; pct=100; phase=2;
  }else{
    num.textContent='Day '+n; lbl.textContent='of '+total;
    pct=Math.min(100,n/total*100); phase=Math.min(2,Math.floor((n-1)/30));
    bar.setAttribute('aria-valuenow',n);
  }
  var spans=document.querySelectorAll('#phs span');
  if(phase>=0) spans[phase].className='on';
  requestAnimationFrame(function(){requestAnimationFrame(function(){fill.style.width=pct+'%'})});
  var items=document.querySelectorAll('#places .p');
  if(items.length>1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    var i=0;
    setInterval(function(){
      items[i].classList.remove('on'); i=(i+1)%items.length; items[i].classList.add('on');
    },2400);
  }
  var yr=document.getElementById('yr'); if(yr) yr.textContent=new Date().getFullYear();
})();


/* ---- volunteer sign-up: builds a ready-to-send WhatsApp or email message ---- */
(function(){
  var form=document.getElementById('volForm'); if(!form) return;
  var status=document.getElementById('volStatus'), how='whatsapp';
  var WHATSAPP='254720032125', EMAIL='lerber.ke@outlook.com';
  form.querySelectorAll('button[type=submit]').forEach(function(b){
    b.addEventListener('click',function(){how=b.value});
  });
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var f=form.elements, bad=[];
    ['name','phone','area'].forEach(function(k){
      var el=f[k], ok=el.value.trim()!=='';
      el.classList.toggle('invalid',!ok); if(!ok) bad.push(el);
    });
    if(bad.length){
      status.className='vol-status err';
      status.textContent='Please fill in your name, phone number and area.';
      bad[0].focus(); return;
    }
    var help=Array.prototype.map.call(form.querySelectorAll('input[name=help]:checked'),function(c){return c.value});
    var lines=['Hello Ler Ber CBO, I would like to volunteer.','',
      'Name: '+f.name.value.trim(),
      'Phone: '+f.phone.value.trim(),
      'Area: '+f.area.value,
      'Free: '+(f.time.value||'Not stated'),
      'I can help with: '+(help.length?help.join(', '):'Not stated')];
    var msg=f.message.value.trim(); if(msg) lines.push('Note: '+msg);
    var text=lines.join('\n');
    status.className='vol-status';
    if(how==='email'){
      status.textContent='Opening your email app. Press send to finish.';
      location.href='mailto:'+EMAIL+'?subject='+encodeURIComponent('Volunteer sign-up: '+f.name.value.trim())+'&body='+encodeURIComponent(text);
    }else{
      status.textContent='Opening WhatsApp. Press send to finish.';
      window.open('https://wa.me/'+WHATSAPP+'?text='+encodeURIComponent(text),'_blank','noopener');
    }
  });
  form.addEventListener('input',function(e){e.target.classList.remove('invalid')});
})();
