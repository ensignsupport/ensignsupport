(function(){
  var form=document.getElementById('ref'), sum=document.getElementById('sum'), done=document.getElementById('done'), logEl=document.getElementById('log');
  var files=[], MAX=10*1024*1024, OK=/\.(pdf|docx?|jpe?g|png|heic)$/i;
  // upload
  var drop=form.querySelector('.drop'), fin=drop.querySelector('input'), list=form.querySelector('.files'), ferr=document.getElementById('files-e');
  function kb(n){return n>1048576?(n/1048576).toFixed(1)+' MB':Math.max(1,Math.round(n/1024))+' KB';}
  function paint(){ list.innerHTML=''; files.forEach(function(f,i){ var li=document.createElement('li'); li.innerHTML='<span></span><small>'+kb(f.size)+'</small><button type="button">Remove</button>'; li.querySelector('span').textContent=f.name; li.querySelector('button').setAttribute('aria-label','Remove '+f.name); li.querySelector('button').onclick=function(){files.splice(i,1);paint();}; list.appendChild(li); }); }
  function add(fl){ var bad=[]; [].forEach.call(fl,function(f){ if(!OK.test(f.name)) bad.push(f.name+' (file type not accepted)'); else if(f.size>MAX) bad.push(f.name+' (over 10 MB)'); else files.push(f); }); ferr.hidden=!bad.length; ferr.textContent=bad.length?"These weren't added: "+bad.join(', ')+'.':''; paint(); fin.value=''; }
  fin.addEventListener('change',function(){add(fin.files);});
  ['dragenter','dragover'].forEach(function(t){drop.addEventListener(t,function(e){e.preventDefault();drop.classList.add('over');});});
  ['dragleave','drop'].forEach(function(t){drop.addEventListener(t,function(e){e.preventDefault();drop.classList.remove('over');});});
  drop.addEventListener('drop',function(e){add(e.dataTransfer.files);});
  // validation
  function setErr(wrap,msg,inputs){ var e=wrap.querySelector('.err'); if(msg){ wrap.setAttribute('data-invalid',''); e.hidden=false; e.textContent=msg; inputs.forEach(function(i){i.setAttribute('aria-invalid','true');i.setAttribute('aria-describedby',e.id);}); } else { wrap.removeAttribute('data-invalid'); e.hidden=true; inputs.forEach(function(i){i.removeAttribute('aria-invalid');i.removeAttribute('aria-describedby');}); } return msg; }
  function v(n){return (form.elements[n].value||'').trim();}
  function blank(p){return !v(p+'-d')&&!v(p+'-m')&&!v(p+'-y');}
  function dateOk(p){ var d=+v(p+'-d'),m=+v(p+'-m'),y=+v(p+'-y'); if(!d||!m||!y) return false; var dt=new Date(y,m-1,d); return dt.getFullYear()===y&&dt.getMonth()===m-1&&dt.getDate()===d&&y>1900&&y<2100; }
  var rules=[
    ['w-rname','Enter your name.',function(){return v('rname').length>1;},['rname']],
    ['w-rrole','Enter your role.',function(){return v('rrole').length>1;},['rrole']],
    ['w-rphone','Enter a phone number, like 0412 345 678.',function(){return /^(0[2-478]\d{8}|61[2-478]\d{8})$/.test(v('rphone').replace(/\D/g,''));},['rphone']],
    ['w-remail','Enter an email address, like name@example.com.',function(){return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v('remail'));},['remail']],
    ['w-pname',"Enter the participant's name.",function(){return v('pname').length>1;},['pname']],
    ['w-sub',"Enter the participant's suburb.",function(){return v('sub').length>1;},['sub']],
    ['w-dob','Enter a real date of birth in the past, for example 14 3 1990.',function(){ if(!dateOk('dob')) return false; var dt=new Date(+v('dob-y'),+v('dob-m')-1,+v('dob-d')), now=new Date(); return dt<now && now.getFullYear()-dt.getFullYear()<=110; },['dob-d','dob-m','dob-y']],
    ['w-ndis','An NDIS number has 9 digits.',function(){var d=v('ndis').replace(/\D/g,'');return !d||d.length===9;},['ndis']],
    ['w-knows','Choose yes, no or not sure.',function(){return !!form.querySelector('input[name=knows]:checked');},['knows-0','knows-1','knows-2']],
    ['w-who','Choose who Andrew should contact first.',function(){return !!form.querySelector('input[name=who]:checked');},['who-0','who-1','who-2']],
    ['w-cphone','Enter their phone number, like 0412 345 678.',function(){var w=form.querySelector('input[name=who]:checked'); if(!w||w.value==='Me') return true; return /^(0[2-478]\d{8}|61[2-478]\d{8})$/.test(v('cphone').replace(/\D/g,''));},['cphone']],
    ['w-ps','Enter a real plan start date, or leave it blank.',function(){return blank('ps')||dateOk('ps');},['ps-d','ps-m','ps-y']],
    ['w-pe','Enter a real plan end date after the start date, or leave it blank.',function(){ if(blank('pe')) return true; if(!dateOk('pe')) return false; if(!dateOk('ps')) return true; return new Date(+v('pe-y'),+v('pe-m')-1,+v('pe-d'))>new Date(+v('ps-y'),+v('ps-m')-1,+v('ps-d')); },['pe-d','pe-m','pe-y']],
    ['w-svc','Choose a service.',function(){return !!form.querySelector('input[name=svc]:checked');},['svc-0','svc-1','svc-2']],
    ['w-pm','Choose how the plan is managed.',function(){return !!form.querySelector('input[name=pm]:checked');},['pm-0','pm-1']],
    ['w-c1','Tick to confirm you have consent to share these details.',function(){return form.elements.c1.checked;},['c1']],
    ['w-c2','Tick to confirm you have read the collection notice and Privacy Policy.',function(){return form.elements.c2.checked;},['c2']]
  ];
  function validate(){
    var errs=[];
    rules.forEach(function(r){ var w=document.getElementById(r[0]); var ins=r[3].map(function(n){return form.elements[n]||document.getElementById(n);}); var bad=!r[2](); setErr(w,bad?r[1]:'',ins); if(bad) errs.push([r[0],r[1],ins[0]||w.querySelector('input')]); });
    return errs;
  }
  // live re-check once a field was flagged
  form.addEventListener('input',function(e){ var w=e.target.closest('[data-invalid]'); if(!w) return; rules.forEach(function(r){ if(r[0]===w.id){ var ins=r[3].map(function(n){return form.elements[n]||document.getElementById(n);}); setErr(w,r[2]()?'':r[1],ins); }}); });
  function sync(){ if(!sum.hidden && !form.querySelector('[data-invalid]')) sum.hidden=true; }
  form.addEventListener('input',sync); form.addEventListener('change',function(){setTimeout(sync,0);});
  form.addEventListener('change',function(e){ var w=e.target.closest('[data-invalid]'); if(!w) return; rules.forEach(function(r){ if(r[0]===w.id){ var ins=r[3].map(function(n){return form.elements[n]||document.getElementById(n);}); setErr(w,r[2]()?'':r[1],ins); }}); });
  form.querySelectorAll('.date .in').forEach(function(inp){ inp.addEventListener('input',function(){ inp.value=inp.value.replace(/\D/g,''); }); });
  form.addEventListener('change',function(e){ if(e.target.name==='who'){ document.getElementById('nom').hidden = e.target.value==='Me'; } });
  if(window.matchMedia('(max-width:820px)').matches){ var rd=document.querySelector('.ready-d'); if(rd) rd.open=false; }
  var dirty=false; form.addEventListener('input',function(){dirty=true;}); window.addEventListener('beforeunload',function(e){ if(dirty && !form.hidden){ e.preventDefault(); e.returnValue=''; } });
  if(window.matchMedia('(pointer:coarse)').matches){ drop.querySelector('p').innerHTML='<strong>Choose files or take a photo</strong> of the plan or reports.'; }
  var failNext=false; window.__ref={fail:function(){failNext=true;}};
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var errs=validate(); var ul=sum.querySelector('ul'); ul.innerHTML='';
    form.querySelector('.send-err').hidden=true;
    if(errs.length){ errs.forEach(function(x){ var li=document.createElement('li'), a=document.createElement('a'); a.href='#'+x[0]; a.textContent=x[1]; a.onclick=function(ev){ev.preventDefault(); (x[2]||document.getElementById(x[0])).focus();}; li.appendChild(a); ul.appendChild(li); }); sum.hidden=false; sum.focus(); return; }
    sum.hidden=true;
    var btn=form.querySelector('.submit .btn'), lab=btn.querySelector('span'); btn.disabled=true; lab.textContent='Sending referral';
    setTimeout(function(){
      btn.disabled=false; lab.textContent='Send referral';
      if(failNext){ failNext=false; var se=form.querySelector('.send-err'); se.hidden=false; se.focus(); return; }
      var ref='ENS-'+String(Date.now()).slice(-6);
      var data={}; [].forEach.call(form.elements,function(el){ if(!el.name||el.type==='file') return; if((el.type==='radio'||el.type==='checkbox')&&!el.checked) return; data[el.name]=el.value; });
      data.files=files.map(function(f){return f.name+' ('+kb(f.size)+')';}); data.reference=ref;
      logEl.textContent='Saved: POST /api/referrals (files to private storage)\n'+JSON.stringify(data,null,2)+'\n\nServer then emails Andrew with Resend (no documents attached, link to admin page), and emails the referrer a copy with the reference number (no health details).';
      dirty=false; form.hidden=true; done.hidden=false; document.querySelector('.aside').hidden=true; document.querySelector('.ref-body').classList.add('is-done'); done.querySelector('.refval').textContent=ref; done.querySelector('.refmail').textContent=v('remail');
      var h=done.querySelector('h2'); h.setAttribute('tabindex','-1'); h.focus(); window.scrollTo({top:done.getBoundingClientRect().top+scrollY-24});
    },700);
  });
  done.querySelector('.again').onclick=function(){ form.reset(); files=[]; paint(); document.getElementById('nom').hidden=true; form.hidden=false; done.hidden=true; document.querySelector('.aside').hidden=false; document.querySelector('.ref-body').classList.remove('is-done'); logEl.textContent=''; form.querySelector('h2').scrollIntoView(); };
  // section jump highlight
  var links=[].slice.call(document.querySelectorAll('.jump a'));
  var blocks=[].slice.call(document.querySelectorAll('.block[id]')); function spy(){ var cur=blocks[0]; blocks.forEach(function(x){ if(x.getBoundingClientRect().top<innerHeight*0.35) cur=x; }); links.forEach(function(l){ l.classList.toggle('on', l.getAttribute('href')==='#'+cur.id); }); } addEventListener('scroll',spy,{passive:true}); spy();
})();
