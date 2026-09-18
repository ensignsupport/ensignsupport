(function(){
  var DEMO_PW='ensign-demo'; // Phase 4: checked on the server against ADMIN_PASSWORD (Netlify env var)
  var $=function(s,r){return (r||document).querySelector(s);};
  var login=$('#login'), app=$('#app');
  var enq=[
    {id:'Q-1042',at:'2026-09-17T08:12',status:'new',channel:'Phone (Messages)',who:'Someone I support',where:'Ipswich',name:'Sample: Priya Example',phone:'0400 000 101',note:'Best to call after 3pm.'},
    {id:'Q-1041',at:'2026-09-16T19:40',status:'new',channel:'Website',who:'Me',where:'Logan',name:'Sample: Sam Example',phone:'0400 000 102',note:''},
    {id:'Q-1039',at:'2026-09-15T10:05',status:'contacted',channel:'Phone (Messages)',who:"I'm referring someone",where:'Brisbane',name:'Sample: Jordan Example',phone:'0400 000 103',note:'LAC, will send full referral.'},
    {id:'Q-1033',at:'2026-09-11T14:22',status:'closed',channel:'Website',who:'Me',where:'Somewhere else',name:'Sample: Casey Example',phone:'0400 000 104',note:'Outside service area.'}
  ];
  var ref=[
    {id:'ENS-515143',at:'2026-09-17T09:30',status:'new',rname:'Sample: Alex Example',rrole:'LAC',org:'Sample Org',rphone:'0400 000 201',remail:'alex@example.com',pname:'Sample: Jo Example',sub:'Springfield Lakes',dob:'14/03/1990',ndis:'',knows:'Yes',who:'Their nominee or guardian',cname:'Sample: Pat Example',cphone:'0400 000 202',ps:'01/07/2026',pe:'30/06/2027',svc:'Support coordination',pm:'Plan managed',files:['ndis-plan.pdf (1.2 MB)','ot-report.pdf (840 KB)'],more:'Goals: live more independently.'},
    {id:'ENS-514870',at:'2026-09-14T11:02',status:'contacted',rname:'Sample: Morgan Example',rrole:'Social worker',org:'',rphone:'0400 000 203',remail:'morgan@example.com',pname:'Sample: Lee Example',sub:'Redcliffe',dob:'02/11/1978',ndis:'430000000',knows:'Not sure',who:'Me',cname:'',cphone:'',ps:'',pe:'',svc:'Psychosocial recovery coaching',pm:'Not sure',files:[],more:''}
  ];
  var tab='all', q='', st='all', current=null;
  var LBL={new:'New',contacted:'Contacted',closed:'Closed'};
  function when(s){var d=new Date(s); return d.toLocaleDateString('en-AU',{day:'numeric',month:'short'})+', '+d.toLocaleTimeString('en-AU',{hour:'numeric',minute:'2-digit'});}
  function pill(s){return '<span class="pillst st-'+s+'"><i></i>'+LBL[s]+'</span>';}
  function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function rows(){ var data=tab==='enq'?enq:(tab==='ref'?ref:enq.concat(ref)); var order={new:0,contacted:1,closed:2}; return data.slice().sort(function(a,b){ return order[a.status]-order[b.status] || (a.at<b.at?1:-1); }).filter(function(r){ if(st!=='all'&&r.status!==st) return false; if(!q) return true; return JSON.stringify(r).toLowerCase().indexOf(q)>-1; }); }
  function stats(){ var all=enq.concat(ref); var nn=all.filter(function(r){return r.status==='new';}).length; $('#s-new').textContent=nn; $('#s-new2').textContent=nn; $('#s-week').textContent=all.length; $('#s-enq').textContent=enq.length; $('#s-ref').textContent=ref.length; $('#c-all').textContent=enq.length+ref.length; $('#c-enq').textContent=enq.length; $('#c-ref').textContent=ref.length; }
  function paint(){
    var r=rows(), tb=$('tbody'), cards=$('.cards'); tb.innerHTML=''; cards.innerHTML='';
    $('thead').innerHTML = tab==='all' ? '<tr><th>Received</th><th>Name</th><th>Type</th><th>Details</th><th>Area</th><th>Status</th></tr>' : tab==='enq' ? '<tr><th>Received</th><th>Name</th><th>For</th><th>Area</th><th>Came in by</th><th>Status</th></tr>' : '<tr><th>Received</th><th>Participant</th><th>Referrer</th><th>Service</th><th>Suburb</th><th>Status</th></tr>';
    r.forEach(function(x){
      var tr=document.createElement('tr');
      var isE=!!x.channel;
      tr.innerHTML = tab==='all'
        ? '<td class="ch">'+when(x.at)+'</td><td><button class="open-row nm">'+esc(isE?x.name:x.pname)+'</button></td><td>'+(isE?'Enquiry':'Referral')+'</td><td>'+esc(isE?x.who:x.svc)+'</td><td>'+esc(isE?x.where:x.sub)+'</td><td>'+pill(x.status)+'</td>'
        : tab==='enq'
        ? '<td class="ch">'+when(x.at)+'</td><td><button class="open-row nm">'+esc(x.name)+'</button><div class="sub">'+esc(x.phone)+'</div></td><td>'+esc(x.who)+'</td><td>'+esc(x.where)+'</td><td class="ch">'+esc(x.channel)+'</td><td>'+pill(x.status)+'</td>'
        : '<td class="ch">'+when(x.at)+'<div class="sub">'+x.id+'</div></td><td><button class="open-row nm">'+esc(x.pname)+'</button></td><td>'+esc(x.rname)+'<div class="sub">'+esc(x.rrole)+'</div></td><td>'+esc(x.svc)+'</td><td>'+esc(x.sub)+'</td><td>'+pill(x.status)+'</td>';
      tr.onclick=function(){open(x,tr.querySelector('.open-row'));}; tb.appendChild(tr);
      var li=document.createElement('li'); li.innerHTML='<button><span class="nm">'+esc(isE?x.name:x.pname)+'</span>'+pill(x.status)+'<span class="sub">'+(isE?'Enquiry · '+esc(x.who)+' · '+esc(x.where):'Referral · '+esc(x.svc)+' · '+esc(x.sub))+'</span><span class="sub">'+when(x.at)+'</span></button>';
      li.querySelector('button').onclick=function(){open(x,li.querySelector('button'));}; cards.appendChild(li);
    });
    $('.empty').hidden=r.length>0; stats();
  }
  var lastFocus=null;
  function open(x,from){
    current=x; lastFocus=from;
    var p=$('#panel'), isEnq=!!x.channel;
    $('#p-title').textContent=isEnq?x.name:x.pname;
    $('#p-sub').textContent=(isEnq?'Enquiry ':'Referral ')+x.id+' · '+when(x.at);
    var first=function(n){return String(n).replace('Sample: ','').split(' ')[0];};
    var callNo, callWho;
    if(isEnq){ callNo=x.phone; callWho=first(x.name); }
    else if(x.who==='Their nominee or guardian' && x.cphone){ callNo=x.cphone; callWho=first(x.cname)+' (nominee)'; }
    else if(x.who==='The participant' && x.cphone){ callNo=x.cphone; callWho=first(x.pname)+' (participant)'; }
    else { callNo=x.rphone; callWho=first(x.rname)+' (referrer)'; }
    $('#p-call').href='tel:'+callNo.replace(/\s/g,''); $('#p-call span').textContent='Call '+callWho; $('#p-call').setAttribute('aria-label','Call '+callWho+' on '+callNo);
    $('#p-mail').hidden=isEnq; if(!isEnq) $('#p-mail').href='mailto:'+x.remail+'?subject=Your referral '+x.id;
    document.querySelectorAll('.status-set button').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.s===x.status);});
    var F=isEnq?[['For',x.who],['Area',x.where],['Phone',x.phone],['Came in by',x.channel],['Note',x.note||'None']]
      :[['Referrer',x.rname+', '+x.rrole+(x.org?' ('+x.org+')':'')],['Referrer phone',x.rphone],['Referrer email',x.remail],['Participant',x.pname],['Suburb',x.sub],['Date of birth',x.dob],['NDIS number',x.ndis||'Not given'],['Participant knows',x.knows],['Contact first',x.who+(x.cname?': '+x.cname+', '+x.cphone:'')],['Plan dates',x.ps?x.ps+' to '+x.pe:'Not given'],['Service',x.svc],['Plan management',x.pm],['Documents',x.files.length?'<ul class="docs">'+x.files.map(function(f){return '<li><a href="#" onclick="return false">'+esc(f)+' · Download</a></li>';}).join('')+'</ul>':'None'],['Anything else',x.more||'None']];
    $('#p-dl').innerHTML=F.map(function(f){return '<dt>'+f[0]+'</dt><dd>'+(f[0]==='Documents'?f[1]:esc(f[1]))+'</dd>';}).join('');
    $('#p-notes').value=x.notes||'';
    $('#scrim').hidden=false; p.hidden=false; requestAnimationFrame(function(){ $('#scrim').classList.add('show'); p.classList.add('show'); $('#p-title').focus(); });
    document.body.style.overflow='hidden';
  }
  function close(){ var p=$('#panel'); p.classList.remove('show'); $('#scrim').classList.remove('show'); document.body.style.overflow=''; setTimeout(function(){p.hidden=true;$('#scrim').hidden=true;},260); if(lastFocus) lastFocus.focus(); }
  $('#p-x').onclick=close; $('#scrim').onclick=close;
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&!$('#panel').hidden) close();
    if(e.key==='Tab'&&!$('#panel').hidden){ var f=[].slice.call($('#panel').querySelectorAll('a[href]:not([hidden]),button,textarea')).filter(function(el){return el.offsetParent!==null;}); var a=f[0],z=f[f.length-1]; if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus();} else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus();} } });
  document.querySelectorAll('.status-set button').forEach(function(b){ b.onclick=function(){ if(!current) return; var prev=current.status, rec=current; current.status=b.dataset.s; document.querySelectorAll('.status-set button').forEach(function(x){x.setAttribute('aria-pressed',x===b);}); toast('Saved: '+LBL[b.dataset.s], function(){ rec.status=prev; if(current===rec) document.querySelectorAll('.status-set button').forEach(function(x){x.setAttribute('aria-pressed',x.dataset.s===prev);}); paint(); }); paint(); }; });
  var nt; $('#p-notes').addEventListener('input',function(){ if(!current) return; current.notes=this.value; $('#p-saved').textContent='Saving'; clearTimeout(nt); nt=setTimeout(function(){ $('#p-saved').textContent='Saved'; },600); });
  var tt; function toast(msg,undo){ var t=$('#toast'); t.querySelector('span').textContent=msg; var u=t.querySelector('button'); u.hidden=!undo; u.onclick=function(){ undo(); t.hidden=true; }; t.hidden=false; $('#p-live').textContent=msg; clearTimeout(tt); tt=setTimeout(function(){t.hidden=true;},5000); }
  document.querySelectorAll('.tabs button').forEach(function(b){ b.onclick=function(){ tab=b.dataset.t; document.querySelectorAll('.tabs button').forEach(function(x){x.setAttribute('aria-selected',x===b);}); paint(); }; });
  $('#search').addEventListener('input',function(){ q=this.value.trim().toLowerCase(); paint(); });
  $('#status').addEventListener('change',function(){ st=this.value; paint(); });
  // login
  $('#show').onclick=function(){ var i=$('#pw'); var s=i.type==='password'; i.type=s?'text':'password'; this.textContent=s?'Hide':'Show'; this.setAttribute('aria-pressed',s); };
  $('#login-form').addEventListener('submit',function(e){ e.preventDefault(); var ok=$('#pw').value===DEMO_PW; $('#pw-err').hidden=ok; if(!ok){ $('#pw').setAttribute('aria-invalid','true'); $('#pw').focus(); return; } login.hidden=true; app.hidden=false; paint(); $('#app h1').focus(); armIdle(); });
  $('#logout').onclick=function(){ app.hidden=true; login.hidden=false; $('#pw').value=''; $('#pw').focus(); };
  var idleT, warnT; function armIdle(){ clearTimeout(idleT); clearTimeout(warnT); $('#idle-warn').hidden=true; warnT=setTimeout(function(){ if(!app.hidden) $('#idle-warn').hidden=false; }, 13*60*1000); idleT=setTimeout(function(){ if(!app.hidden){ app.hidden=true; login.hidden=false; $('#pw').value=''; $('#idle-msg').hidden=false; } }, 15*60*1000); }
  ['click','keydown','touchstart','scroll'].forEach(function(t){document.addEventListener(t,function(){ if(!app.hidden) armIdle(); },{passive:true});});
  window.__admin={enter:function(){ $('#pw').value=DEMO_PW; $('#login-form').requestSubmit(); }, open:function(i){ open(tab==='enq'?enq[i]:ref[i],null); }, tab:function(t){ document.querySelector('.tabs button[data-t="'+t+'"]').click(); }};
})();
