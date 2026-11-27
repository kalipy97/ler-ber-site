(function(){
  /* day tracker (home page only) */
  var num=document.getElementById('dnum'), lbl=document.getElementById('dlbl');
  var fill=document.getElementById('pfill'), bar=document.getElementById('pbar');
  if(num&&lbl&&fill&&bar){
    var start=new Date(2026,10,20), end=new Date(2027,1,17), DAY=864e5;
    var now=new Date(), today=new Date(now.getFullYear(),now.getMonth(),now.getDate());
    var n=Math.floor((today-start)/DAY)+1, total=90, pct=0, phase=-1;
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
    if(phase>=0&&spans[phase]) spans[phase].className='on';
    requestAnimationFrame(function(){requestAnimationFrame(function(){fill.style.width=pct+'%'})});
  }
  /* rotating towns in the badge (home page only) */
  var items=document.querySelectorAll('#places .p');
  if(items.length>1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    var i=0;
    setInterval(function(){
      items[i].classList.remove('on'); i=(i+1)%items.length; items[i].classList.add('on');
    },2400);
  }
  /* footer year (every page) */
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

/* ---- volunteers in action ----
   PHOTOS: save your own photos in an "images" folder with these names.
   VOICES: add real volunteer quotes (with their permission), for example:
   {name:'Full Name', role:'Clean-up volunteer', rating:5, year:2027, text:'What they said...'}  */
(function(){
  var PHOTOS=[
    {src:'images/volunteer-1.jpg',alt:'Ler Ber volunteers at work',caption:''},
    {src:'images/volunteer-2.jpg',alt:'Ler Ber volunteer photo 2',caption:''},
    {src:'images/volunteer-3.jpg',alt:'Ler Ber volunteer photo 3',caption:''},
    {src:'images/volunteer-4.jpg',alt:'Ler Ber volunteer photo 4',caption:''},
    {src:'images/volunteer-5.jpg',alt:'Ler Ber volunteer photo 5',caption:''},
    {src:'images/volunteer-6.jpg',alt:'Ler Ber volunteer photo 6',caption:''},
    {src:'images/volunteer-7.jpg',alt:'Ler Ber volunteer photo 7',caption:''},
    {src:'images/volunteer-8.jpg',alt:'Ler Ber volunteer photo 8',caption:''}
  ];
  var VOICES=[];

  /* photo mosaic + viewer */
  var list=document.getElementById('mosaic'), dlg=document.getElementById('lb');
  if(list&&dlg){
    var lbImg=dlg.querySelector('img'), lbCap=dlg.querySelector('figcaption'), cur=0;
    PHOTOS.forEach(function(p,i){
      var li=document.createElement('li'), btn=document.createElement('button'), img=document.createElement('img');
      btn.type='button'; btn.className='tile'; btn.setAttribute('aria-label','Open photo '+(i+1));
      img.src=p.src; img.alt=p.alt; img.loading='lazy';
      img.addEventListener('error',function(){li.classList.add('missing')});
      btn.appendChild(img); li.appendChild(btn);
      btn.addEventListener('click',function(){show(i);dlg.showModal()});
      list.appendChild(li);
    });
    var show=function(i){cur=i;lbImg.src=PHOTOS[i].src;lbImg.alt=PHOTOS[i].alt;lbCap.textContent=PHOTOS[i].caption||''};
    var step=function(d){
      var n=PHOTOS.length,i=cur;
      for(var k=0;k<n;k++){i=(i+d+n)%n;if(!list.children[i].classList.contains('missing')){show(i);return}}
    };
    dlg.querySelector('.lb-x').addEventListener('click',function(){dlg.close()});
    dlg.querySelector('.lb-prev').addEventListener('click',function(){step(-1)});
    dlg.querySelector('.lb-next').addEventListener('click',function(){step(1)});
    dlg.addEventListener('click',function(e){if(e.target===dlg)dlg.close()});
    document.addEventListener('keydown',function(e){
      if(!dlg.open)return;
      if(e.key==='ArrowLeft')step(-1);
      if(e.key==='ArrowRight')step(1);
    });
  }

  /* volunteer voices */
  var box=document.getElementById('voices'); if(!box) return;
  if(!VOICES.length){
    var empty=document.createElement('div'); empty.className='voices-empty';
    empty.innerHTML='<p>Volunteer stories will appear here after our first clean-ups.</p><a href="#volunteer">Join us and be the first to share yours</a>';
    box.appendChild(empty); return;
  }
  VOICES.forEach(function(v){
    var d=document.createElement('div'); d.className='voice';
    var initials=v.name.split(/\s+/).slice(0,2).map(function(w){return w.charAt(0).toUpperCase()}).join('');
    var head=document.createElement('div'); head.className='v-head';
    var av=document.createElement('span'); av.className='avatar'; av.textContent=initials; av.setAttribute('aria-hidden','true');
    var who=document.createElement('div');
    var nm=document.createElement('span'); nm.className='name'; nm.textContent=v.name;
    var rl=document.createElement('span'); rl.className='role'; rl.textContent=v.role||'';
    who.appendChild(nm); who.appendChild(rl); head.appendChild(av); head.appendChild(who); d.appendChild(head);
    var meta=document.createElement('div'); meta.className='v-meta';
    if(v.rating){
      var st=document.createElement('span'); st.className='stars'; st.setAttribute('role','img'); st.setAttribute('aria-label',v.rating+' out of 5');
      for(var s=1;s<=5;s++){var x=document.createElement('span'); x.textContent='\u2605'; if(s>v.rating) x.className='off'; st.appendChild(x)}
      meta.appendChild(st);
    }
    if(v.year) meta.appendChild(document.createTextNode(String(v.year)));
    d.appendChild(meta);
    var tx=document.createElement('p'); tx.className='v-text'; tx.textContent=v.text; d.appendChild(tx);
    var more=document.createElement('button'); more.type='button'; more.className='v-more'; more.textContent='Show more'; more.hidden=true;
    more.addEventListener('click',function(){var o=tx.classList.toggle('open');more.textContent=o?'Show less':'Show more'});
    d.appendChild(more); box.appendChild(d);
    var check=function(){if(!tx.classList.contains('open')) more.hidden=!(tx.scrollHeight>tx.clientHeight+1)};
    window.addEventListener('load',check); window.addEventListener('resize',check); check();
  });
})();

/* ---- donate page ----
   M-PESA SETTINGS: fill these in when you have your Paybill or Till number.
   method: 'Paybill' or 'Till'.  account: only needed for Paybill (e.g. 'Ler Ber'). */
(function(){
  var MPESA={method:'', number:'', account:''};
  var WHATSAPP='254720032125', EMAIL='lerber.ke@outlook.com';
  function send(how,subject,text,statusEl){
    if(how==='email'){
      statusEl.textContent='Opening your email app. Press send to finish.';
      location.href='mailto:'+EMAIL+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(text);
    }else{
      statusEl.textContent='Opening WhatsApp. Press send to finish.';
      window.open('https://wa.me/'+WHATSAPP+'?text='+encodeURIComponent(text),'_blank','noopener');
    }
  }
  function fmt(n){return Number(n).toLocaleString('en-US')}

  /* M-Pesa amount + steps */
  var amounts=document.getElementById('amounts');
  if(amounts){
    var other=document.getElementById('amtOther'), show=document.getElementById('amtShow'),
        payBody=document.getElementById('payBody'), pAmt=document.getElementById('pAmt'), amount=0;
    var btns=amounts.querySelectorAll('.amt');
    function setAmount(v,fromBtn){
      amount=v>0?v:0;
      btns.forEach(function(b){b.setAttribute('aria-pressed',String(fromBtn&&Number(b.dataset.v)===amount))});
      if(fromBtn) other.value='';
      show.textContent=amount?('You are giving KES '+fmt(amount)+'. Thank you!'):'Pick an amount to see your payment steps.';
      if(pAmt&&amount) pAmt.value=amount;
      renderPay();
    }
    function copyBtn(val){
      var b=document.createElement('button'); b.type='button'; b.className='copy'; b.textContent='Copy';
      b.addEventListener('click',function(){
        var done=function(){b.textContent='Copied';setTimeout(function(){b.textContent='Copy'},1500)};
        if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(val).then(done,function(){window.prompt('Copy this:',val)});
        else window.prompt('Copy this:',val);
      });
      return b;
    }
    function val(text,copy){
      var s=document.createElement('span'); s.className='pay-val';
      var b=document.createElement('b'); b.textContent=text; s.appendChild(b);
      if(copy) s.appendChild(copyBtn(copy)); return s;
    }
    function li(parts){var l=document.createElement('li'); parts.forEach(function(p){l.appendChild(typeof p==='string'?document.createTextNode(p):p)}); return l}
    function renderPay(){
      payBody.innerHTML='';
      if(!MPESA.number){
        var p=document.createElement('p'); p.textContent='Our M-Pesa details are being added. Message us on WhatsApp and we will send them right away.'; payBody.appendChild(p);
        var a=document.createElement('a'); a.className='btn primary'; a.target='_blank'; a.rel='noopener';
        a.href='https://wa.me/'+WHATSAPP+'?text='+encodeURIComponent('Hello Ler Ber CBO, I would like to donate'+(amount?(' KES '+fmt(amount)):'')+' by M-Pesa. Please send me the payment details.');
        a.textContent='Ask for payment details'; payBody.appendChild(a); return;
      }
      if(!amount){var q=document.createElement('p'); q.textContent='Choose an amount first, then your steps appear here.'; payBody.appendChild(q); return}
      var ol=document.createElement('ol'); ol.className='pay-steps';
      var paybill=MPESA.method==='Paybill';
      ol.appendChild(li(['Open the M-Pesa menu on your phone and choose Lipa na M-Pesa.']));
      ol.appendChild(li([paybill?'Choose Paybill.':'Choose Buy Goods and Services.']));
      ol.appendChild(li([paybill?'Business number: ':'Till number: ',val(MPESA.number,MPESA.number)]));
      if(paybill&&MPESA.account) ol.appendChild(li(['Account number: ',val(MPESA.account,MPESA.account)]));
      ol.appendChild(li(['Amount: ',val('KES '+fmt(amount))]));
      ol.appendChild(li(['Enter your M-Pesa PIN and send. You will receive a confirmation message.']));
      payBody.appendChild(ol);
    }
    btns.forEach(function(b){b.addEventListener('click',function(){setAmount(Number(b.dataset.v),true)})});
    other.addEventListener('input',function(){setAmount(Math.floor(Number(other.value)),false)});
    renderPay();

    /* "I have donated" message */
    var pf=document.getElementById('paidForm'), pst=document.getElementById('paidStatus'), how='whatsapp';
    pf.querySelectorAll('button[type=submit]').forEach(function(b){b.addEventListener('click',function(){how=b.value})});
    pf.addEventListener('submit',function(e){
      e.preventDefault();
      var name=document.getElementById('pName').value.trim(), amt=document.getElementById('pAmt').value, code=document.getElementById('pCode').value.trim();
      if(!amt||Number(amt)<=0){pst.className='vol-status err';pst.textContent='Please enter the amount you donated.';document.getElementById('pAmt').focus();return}
      pst.className='vol-status';
      var t='Hello Ler Ber CBO, I have donated KES '+fmt(amt)+' by M-Pesa.'+(name?'\nName: '+name:'')+(code?'\nM-Pesa code: '+code:'');
      send(how,'M-Pesa donation'+(name?': '+name:''),t,pst);
    });
  }

  /* equipment pledge */
  var gf=document.getElementById('gearForm');
  if(gf){
    var gst=document.getElementById('gearStatus'), ghow='whatsapp';
    gf.querySelectorAll('button[type=submit]').forEach(function(b){b.addEventListener('click',function(){ghow=b.value})});
    gf.addEventListener('submit',function(e){
      e.preventDefault();
      var nm=document.getElementById('gName'), ph=document.getElementById('gPhone'), bad=[];
      [nm,ph].forEach(function(el){var ok=el.value.trim()!==''; el.classList.toggle('invalid',!ok); if(!ok) bad.push(el)});
      var lines=[];
      gf.querySelectorAll('.item input').forEach(function(i){var q=parseInt(i.value,10); if(q>0) lines.push(i.dataset.label+': '+q)});
      var other=document.getElementById('gOther').value.trim();
      if(other) lines.push('Other: '+other);
      if(bad.length){gst.className='vol-status err';gst.textContent='Please add your name and phone number.';bad[0].focus();return}
      if(!lines.length){gst.className='vol-status err';gst.textContent='Please enter a quantity for at least one item.';return}
      gst.className='vol-status';
      var note=document.getElementById('gMsg').value.trim();
      var t='Hello Ler Ber CBO, I would like to donate equipment.\n\n'+lines.join('\n')+'\n\nName: '+nm.value.trim()+'\nPhone: '+ph.value.trim()+'\nHandover: '+document.getElementById('gHand').value+(note?'\nNote: '+note:'');
      send(ghow,'Equipment donation: '+nm.value.trim(),t,gst);
    });
    gf.addEventListener('input',function(e){e.target.classList.remove('invalid')});
  }
})();

/* ---- polish: menu, sticky header, back-to-top, scroll reveal ---- */
(function(){
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var header=document.querySelector('header');
  var tg=document.querySelector('.nav-toggle'), nav=document.getElementById('nav');
  if(tg&&nav){
    var set=function(o){nav.classList.toggle('open',o);tg.setAttribute('aria-expanded',String(o));tg.setAttribute('aria-label',o?'Close menu':'Open menu')};
    tg.addEventListener('click',function(){set(!nav.classList.contains('open'))});
    nav.addEventListener('click',function(e){if(e.target.closest('a'))set(false)});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')set(false)});
    window.addEventListener('resize',function(){if(window.innerWidth>760)set(false)});
  }
  var toTop=document.createElement('button');
  toTop.type='button'; toTop.className='to-top'; toTop.setAttribute('aria-label','Back to top');
  toTop.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 14l6-6 6 6"/></svg>';
  toTop.addEventListener('click',function(){window.scrollTo({top:0,behavior:reduce?'auto':'smooth'})});
  document.body.appendChild(toTop);
  var onScroll=function(){
    if(header) header.classList.toggle('scrolled',window.scrollY>8);
    toTop.classList.toggle('show',window.scrollY>700);
  };
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();

  if('IntersectionObserver' in window && !reduce){
    var sel='main .card, main .feat, main .steps li, main .phase-list li, main .chips li, main section h2';
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(!en.isIntersecting) return;
        var el=en.target; el.classList.add('in'); io.unobserve(el);
        el.addEventListener('transitionend',function done(ev){
          if(ev.propertyName!=='opacity') return;
          el.classList.remove('reveal','in'); el.style.transitionDelay='';
          el.removeEventListener('transitionend',done);
        });
      });
    },{threshold:.12});
    document.querySelectorAll(sel).forEach(function(el){
      if(el.closest('.hero')||el.closest('dialog')) return;
      if(el.getBoundingClientRect().top<window.innerHeight*0.92) return;
      var idx=Array.prototype.indexOf.call(el.parentNode.children,el);
      el.style.transitionDelay=Math.min(idx,4)*70+'ms';
      el.classList.add('reveal'); io.observe(el);
    });
  }
})();
