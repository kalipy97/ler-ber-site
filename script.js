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
  var yr=document.getElementById('yr'); if(yr) yr.textContent=new Date().getFullYear();
})();
