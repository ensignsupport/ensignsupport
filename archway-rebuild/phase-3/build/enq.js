(function(){
  var ANDREW_SMS='+61400000000'; // [PLACEHOLDER: Andrew's mobile]
  var STEPS=5, DONE_WEB=5, DONE_SMS=6;
  var form=document.getElementById('enq'), steps=[].slice.call(form.querySelectorAll('.enq-step')),
      bar=form.querySelector('.enq-progress .bar'), live=document.getElementById('enq-live'),
      logEl=document.getElementById('log');
  var other=form.querySelector('.other-field'),
      otherBtn=form.querySelector('.other-btn'), nextOnWhere=form.querySelector('[data-step="1"] .next');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var forced=null; // demo override: 'phone' | 'computer'
  function isPhone(){ if(forced) return forced==='phone'; return window.matchMedia('(pointer:coarse)').matches && window.matchMedia('(max-width: 820px)').matches; }
  function val(n){var c=form.querySelector('input[name="'+n+'"]:checked');return c?c.value:'';}
  function areaVal(){ return form.elements.area ? form.elements.area.value.trim() : ''; }
  function whereLabel(){ return val('where') || areaVal(); }

  function cancelAdvance(){ clearTimeout(timer); timer=null; }
  function show(i,focus){
    cancelAdvance();
    steps.forEach(function(s,k){ s.hidden=k!==i; s.classList.remove('enter'); });
    var s=steps[i]; if(!reduce){ void s.offsetWidth; s.classList.add('enter'); }
    // starts near empty (nothing answered yet), then runs ahead of the real
    // progress so every step after the first feels nearly done
    var PCT=[8,45,66,82,93];
    if(bar) bar.style.width=(i<STEPS?PCT[i]:100)+'%';
    var label = i<STEPS ? 'Question '+(i+1)+' of '+STEPS : 'Done';
    live.textContent=label;
    form.querySelector('.enq-count').textContent=label;
    form.querySelector('.meta').hidden = i>=STEPS-1;
    if(i===4){ paintRecap(); paintButton(); }
    if(focus){ var h=s.querySelector('.enq-q,h2'); if(h){h.setAttribute('tabindex','-1'); h.focus({preventScroll:true});} }
  }
  function log(t){ if(logEl) logEl.textContent=t; }

  // ---- choice steps: pick an answer, the line draws, then move on ----------
  var arrowNav=false, timer=null;
  // Arrow keys move between answers without committing, so reveal the step's
  // Next button as soon as one is chosen that way. Nothing on screen said
  // Enter or Space would work.
  function showNextFor(t){
    var st=t.closest('.enq-step'); if(!st) return;
    var n=st.querySelector('.next'); if(n) n.hidden=false;
  }
  function advanceFrom(t){ var i=t.name==='who'?0:1; clearTimeout(timer); timer=setTimeout(function(){ show(i+1,true); }, reduce?0:480); }
  form.addEventListener('keydown',function(e){
    var t=e.target; if(t.type!=='radio') return;
    if(e.key.indexOf('Arrow')===0){ arrowNav=true; showNextFor(t); return; }
    if(e.key==='Enter'){ e.preventDefault(); t.checked=true; if(t.name==='who') wording(); advanceFrom(t); }
    if(e.key===' '){ arrowNav=false; if(t.checked) advanceFrom(t); }
  });
  // Enter in a text field means "next question", not "send the form".
  // Without this, Enter on the phone field skipped question 5 and submitted,
  // and Enter on the name field set an error on a step nobody could see.
  form.addEventListener('keydown',function(e){
    if(e.key!=='Enter') return;
    var t=e.target;
    if(t.type==='radio'||t.tagName==='TEXTAREA'||t.tagName==='BUTTON') return;
    var st=t.closest('.enq-step'); if(!st) return;
    var cur=Number(st.dataset.step);
    if(isNaN(cur)||cur>=STEPS-1) return; // last step: let the real submit run
    e.preventDefault();
    if(validate(cur)) show(cur+1,true);
  });
  form.addEventListener('change',function(e){
    var t=e.target; if(t.type!=='radio') return;
    if(t.name==='who') wording();
    if(t.name==='where') clearArea();
    if(arrowNav){ arrowNav=false; return; }
    advanceFrom(t);
  });

  // Coming Back and then clicking the same answer fires no change event, so
  // mouse and touch had no way forward. Keyboard already worked via Space.
  form.addEventListener('click',function(e){
    var lab=e.target.closest('label'); if(!lab) return;
    var inp=lab.htmlFor?document.getElementById(lab.htmlFor):lab.querySelector('input');
    if(!inp||inp.type!=='radio'||!inp.checked) return;
    arrowNav=false; advanceFrom(inp);
  });

  // ---- 'Somewhere else' opens a field in place, so the box never grows -----
  function clearArea(){ if(form.elements.area) form.elements.area.value=''; }
  // the button itself becomes the field, in the same row, so nothing moves
  function openOther(){
    cancelAdvance();
    var w=form.querySelector('input[name="where"]:checked'); if(w) w.checked=false;
    otherBtn.hidden=true; other.hidden=false; nextOnWhere.hidden=false;
    otherBtn.setAttribute('aria-expanded','true');
    var inp=form.elements.area; if(inp) inp.focus({preventScroll:true});
  }
  function closeOther(){
    otherBtn.hidden=false; other.hidden=true; nextOnWhere.hidden=true;
    otherBtn.setAttribute('aria-expanded','false'); clearErr('area');
    // the typed area is kept, so reopening restores it. Picking a suburb clears it.
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
        if(!areaVal()){
          // the message lives inside the 'Somewhere else' field, so open it,
          // or the error is set on something nobody can see and the form
          // fails silently. The suburb buttons stay available either way.
          if(other && other.hidden) openOther();
          setErr('area','Please tell Andrew which area you are in.'); ok=false;
        }
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
      cancelAdvance();
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
    e.preventDefault();
    // Never fail silently on a step the visitor cannot see. Take them to it.
    for(var st=1; st<=3; st++){
      if(!validate(st)){ if(steps[st].hidden) show(st,true); else validate(st); return; }
    }
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
