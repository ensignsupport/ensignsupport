(function(){
  var ANDREW_SMS='+61400000000'; // [PLACEHOLDER: Andrew's mobile]
  var STEPS=5, DONE_WEB=5, DONE_SMS=6;
  var form=document.getElementById('enq'), steps=[].slice.call(form.querySelectorAll('.enq-step')),
      bars=[].slice.call(form.querySelectorAll('.enq-progress span')), live=document.getElementById('enq-live'),
      logEl=document.getElementById('log');
  var pick=form.querySelector('.where-pick'), other=form.querySelector('.where-other'),
      otherBtn=form.querySelector('.other-btn'), nextOnWhere=form.querySelector('[data-step="1"] .next');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var forced=null; // demo override: 'phone' | 'computer'
  function isPhone(){ if(forced) return forced==='phone'; return window.matchMedia('(pointer:coarse)').matches && window.matchMedia('(max-width: 820px)').matches; }
  function val(n){var c=form.querySelector('input[name="'+n+'"]:checked');return c?c.value:'';}
  function areaVal(){ return form.elements.area ? form.elements.area.value.trim() : ''; }
  function whereLabel(){ return val('where') || areaVal(); }

  function show(i,focus){
    steps.forEach(function(s,k){ s.hidden=k!==i; s.classList.remove('enter'); });
    var s=steps[i]; if(!reduce){ void s.offsetWidth; s.classList.add('enter'); }
    bars.forEach(function(b,k){ b.classList.toggle('on',k<=Math.min(i,STEPS-1)); });
    var label = i<STEPS ? 'Question '+(i+1)+' of '+STEPS : 'Done';
    if(i<STEPS) live.textContent=label;
    form.querySelector('.enq-count').textContent=label;
    form.querySelector('.meta').hidden = i>=STEPS-1;
    if(i===4){ paintRecap(); paintButton(); }
    if(focus){ var h=s.querySelector('.enq-q,h2'); if(h){h.setAttribute('tabindex','-1'); h.focus({preventScroll:true});} }
  }
  function log(t){ if(logEl) logEl.textContent=t; }

  // ---- choice steps: pick an answer, the line draws, then move on ----------
  var arrowNav=false, timer=null;
  function advanceFrom(t){ var i=t.name==='who'?0:1; clearTimeout(timer); timer=setTimeout(function(){ show(i+1,true); }, reduce?0:480); }
  form.addEventListener('keydown',function(e){
    var t=e.target; if(t.type!=='radio') return;
    if(e.key.indexOf('Arrow')===0){ arrowNav=true; return; }
    if(e.key==='Enter'){ e.preventDefault(); t.checked=true; if(t.name==='who') wording(); advanceFrom(t); }
    if(e.key===' '){ arrowNav=false; if(t.checked) advanceFrom(t); }
  });
  form.addEventListener('change',function(e){
    var t=e.target; if(t.type!=='radio') return;
    if(t.name==='who') wording();
    if(t.name==='where') clearArea();
    if(arrowNav){ arrowNav=false; return; }
    advanceFrom(t);
  });

  // ---- 'Somewhere else' opens a field in place, so the box never grows -----
  function clearArea(){ if(form.elements.area) form.elements.area.value=''; }
  function openOther(){
    var w=form.querySelector('input[name="where"]:checked'); if(w) w.checked=false;
    pick.hidden=true; other.hidden=false; nextOnWhere.hidden=false;
    otherBtn.setAttribute('aria-expanded','true');
    var inp=form.elements.area; if(inp) inp.focus({preventScroll:true});
  }
  function closeOther(){
    pick.hidden=false; other.hidden=true; nextOnWhere.hidden=true;
    otherBtn.setAttribute('aria-expanded','false'); clearArea(); clearErr('area');
  }
  if(otherBtn) otherBtn.onclick=openOther;

  function wording(){
    var w=val('who');
    form.querySelector('[data-step="1"] .enq-q').textContent = w==='Me'?'Where are you?':(w==="I'm referring someone"?'Where is the participant?':'Where are they?');
    form.querySelector('.ref-note').hidden = w!=="I'm referring someone";
  }

  function paintRecap(){
    var r=form.querySelector('.recap'); r.innerHTML='';
    [[val('who'),0],[whereLabel(),1]].forEach(function(p){
      if(!p[0]) return;
      var b=document.createElement('button'); b.type='button';
      b.innerHTML=p[0]+' <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M11 2.5l2.5 2.5L6 12.5 3 13l.5-3z"/></svg>';
      b.setAttribute('aria-label','Change: '+p[0]); b.onclick=function(){ show(p[1],true); }; r.appendChild(b);
    });
  }
  function paintButton(){
    var phone=isPhone(), b=form.querySelector('.btn-send');
    b.querySelector('span').textContent=phone?'Open my messages':'Send to Andrew';
  }

  // ---- validation, one step at a time --------------------------------------
  function setErr(name,msg){
    var inp=form.elements[name]; if(!inp) return;
    var wrap=inp.closest('.field'), err=wrap.querySelector('.err');
    wrap.setAttribute('data-invalid',''); inp.setAttribute('aria-invalid','true');
    err.textContent=msg; err.hidden=false; inp.setAttribute('aria-describedby',err.id);
  }
  function clearErr(name){
    var inp=form.elements[name]; if(!inp) return;
    var wrap=inp.closest('.field'), err=wrap.querySelector('.err');
    wrap.removeAttribute('data-invalid'); inp.removeAttribute('aria-invalid');
    inp.removeAttribute('aria-describedby'); err.hidden=true;
  }
  function okPhone(v){ var d=v.replace(/\D/g,''); return /^(0[2-478]\d{8}|61[2-478]\d{8})$/.test(d); }
  function okEmail(v){ return /^[^@\s]+@[^@\s.]+\.[^@\s]{2,}$/.test(v); }

  function validate(step){
    var ok=true;
    if(step===1){
      if(!val('where')){
        if(!areaVal()){ setErr('area','Please tell Andrew which area you are in.'); ok=false; }
        else clearErr('area');
      }
    }
    if(step===2){
      var n=form.elements.name.value;
      if(n.trim().length>1){ clearErr('name'); } else { setErr('name','Please add your name.'); ok=false; }
    }
    if(step===3){
      var p=form.elements.phone.value;
      if(okPhone(p)){ clearErr('phone'); } else { setErr('phone','Please add an Australian phone number, like 0412 345 678.'); ok=false; }
      var em=form.elements.email.value.trim();
      if(!em || okEmail(em)){ clearErr('email'); } else { setErr('email','Please check this email address.'); ok=false; }
    }
    if(!ok){ var first=form.querySelector('[aria-invalid="true"]'); if(first) first.focus(); }
    return ok;
  }

  form.querySelectorAll('.next').forEach(function(b){
    b.onclick=function(){
      var cur=Number(b.closest('.enq-step').dataset.step);
      if(validate(cur)) show(Number(b.dataset.to),true);
    };
  });
  form.querySelectorAll('.back').forEach(function(b){
    if(b.classList.contains('again')||!b.dataset.to) return;
    b.onclick=function(){
      var cur=Number(b.closest('.enq-step').dataset.step);
      if(cur===1 && !other.hidden){ closeOther(); return; }
      show(Number(b.dataset.to),true);
    };
  });

  function saveLead(data){ // Phase 4: fetch('/api/enquiries',{method:'POST',body:JSON.stringify(data)})
    return new Promise(function(res){ setTimeout(res, 450); });
  }
  function smsText(d){
    var who = d.who==='Me' ? "I'd like to ask about support for myself" : (d.who==="I'm referring someone" ? "I'd like to refer a participant" : "I'm asking for someone I support");
    return "Hi Andrew, I'm "+d.name+". "+who+" in "+d.where+". My number is "+d.phone+"."+(d.note?' '+d.note:'');
  }
  var lastHref='';
  form.addEventListener('submit',function(e){
    e.preventDefault(); if(!validate(1)||!validate(2)||!validate(3)) return;
    var btn=form.querySelector('.btn-send'), label=btn.querySelector('span'), before=label.textContent;
    var data={who:val('who'),where:whereLabel(),name:form.elements.name.value.trim(),
      phone:form.elements.phone.value.trim(),email:form.elements.email.value.trim(),
      note:form.elements.note.value.trim(),channel:isPhone()?'sms':'web',at:new Date().toISOString()};
    btn.disabled=true; label.textContent= data.channel==='sms' ? 'Getting your message ready' : 'Sending';
    saveLead(data).then(function(){
      btn.disabled=false; label.textContent=before;
      var saved='Saved: POST /api/enquiries\n'+JSON.stringify(data,null,2);
      if(data.channel==='sms'){
        lastHref='sms:'+ANDREW_SMS+'?&body='+encodeURIComponent(smsText(data));
        log(saved+'\n\nMessage text: '+smsText(data));
        show(DONE_SMS,true);
        if(!forced) window.location.href=lastHref;
      } else {
        log(saved+'\n\nServer then emails Andrew with Resend.');
        show(DONE_WEB,true);
      }
    }, function(){
      btn.disabled=false; label.textContent=before;
      form.querySelector('.save-err').hidden=false;
    });
  });
  var retry=form.querySelector('.retry'); if(retry) retry.onclick=function(){ if(lastHref && !forced) window.location.href=lastHref; };
  form.querySelectorAll('.again').forEach(function(a){ a.onclick=function(){ form.reset(); closeOther(); wording(); show(0,true); log(''); }; });
  // demo switch
  document.querySelectorAll('[data-dev]').forEach(function(b){ b.onclick=function(){ forced=b.dataset.dev; document.querySelectorAll('[data-dev]').forEach(function(x){x.setAttribute('aria-pressed',x===b);}); if(!steps[4].hidden) paintButton(); }; });
  form.classList.add('js'); show(0,false);
  window.__enq={show:show,setDev:function(d){forced=d;}};
})();
