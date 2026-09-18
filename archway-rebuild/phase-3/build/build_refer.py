src=open('build.py').read()
exec(src[:src.index("arrow=")])
ink='<svg class="ink" viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M2 8 C 22 4, 48 3, 70 5 S 94 9, 98 5"/></svg>'
def S(p): return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">%s</svg>'%p
I={'plan':'<path d="M7 3.5h7l4 4V20a.5.5 0 01-.5.5h-10.5a.5.5 0 01-.5-.5V4a.5.5 0 01.5-.5z"/><path d="M14 3.5V8h4M9.5 12.5h5M9.5 16h5"/>',
'where':'<path d="M12 21s-6.5-5.8-6.5-11a6.5 6.5 0 0113 0c0 5.2-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
'clock':'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
'meet':'<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3.5 19c.8-3.2 3-5 5.5-5s4.7 1.8 5.5 5M14.5 14.3c.8-.4 1.6-.6 2.5-.6 2 0 3.6 1.4 4.2 3.8"/>',
'hash':'<path d="M9 4 7.5 20M16.5 4 15 20M4.5 9h16M3.5 15h16"/>',
'doc':'<path d="M6 3h9l4 4v14H6z"/><path d="M14.5 3v4.5H19M9 12h7M9 15.5h7M9 19h4"/>',
'check':'<circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.8 2.8L16.5 9.5"/>',
'up':'<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3"/>',
'arrow':'<path d="M4 12h15M13 6l6 6-6 6"/>'}
def tile(i,k,v): return '<li><span class="ico">%s</span><div><p class="k">%s</p><p class="v">%s</p></div></li>'%(S(I[i]),k,v)
areas=['Brisbane','Ipswich','Logan','Moreton Bay','Redlands','Gold Coast','Sunshine Coast','Scenic Rim','Lockyer Valley']
tiles=tile('plan','Plans','Self managed and plan managed')+tile('clock','Reply','Within 1 business day, with a reference number')+tile('meet','First meeting',"In the participant's first week")+'<li class="area"><span class="ico">%s</span><div><p class="k">Area</p><ul class="chips">%s</ul><p class="v chips-line">%s</p></div></li>'%(S(I['where']),''.join('<li>%s</li>'%a for a in areas),', '.join(areas))
def fld(id_,label,name,typ='text',ac='',opt=False,full=False,hint='',extra=''):
    return '<div class="f%s" id="w-%s"><label for="%s">%s%s</label><input class="in" id="%s" name="%s" type="%s"%s%s>%s<p class="err" id="%s-e" hidden></p></div>'%(' full' if full else '',id_,name,label,' <span class="opt">(optional)</span>' if opt else '',name,name,typ,(' autocomplete="%s"'%ac) if ac else '',extra,'<p class="hint" id="%s-h">%s</p>'%(name,hint) if hint else '','w-'+id_)
def date(id_,label,p,hint):
    return '<fieldset class="f" id="w-%s"><legend class="lbl">%s</legend><p class="hint">%s</p><div class="date"><div><label for="%s-d">Day</label><input class="in" id="%s-d" name="%s-d" inputmode="numeric" maxlength="2"></div><div><label for="%s-m">Month</label><input class="in" id="%s-m" name="%s-m" inputmode="numeric" maxlength="2"></div><div><label for="%s-y">Year</label><input class="in yy" id="%s-y" name="%s-y" inputmode="numeric" maxlength="4"></div></div><p class="err" id="w-%s-e" hidden></p></fieldset>'%(id_,label,hint,p,p,p,p,p,p,p,p,p,id_)
def pills(id_,legend,name,opts,cls):
    return '<fieldset class="f full" id="w-%s"><legend class="lbl">%s</legend><div class="pills %s">%s</div><p class="err" id="w-%s-e" hidden></p></fieldset>'%(id_,legend,cls,''.join('<div class="pill"><input type="radio" id="%s-%d" name="%s" value="%s"><label for="%s-%d"><span class="txt">%s%s</span></label></div>'%(name,i,name,o,name,i,o,ink) for i,o in enumerate(opts)),id_)
for f in ['w-rname','w-rphone','w-remail','w-rrole','w-pname']: pass
body='''
<div class="sheet-bar"><div class="wrap"><strong>Component 4 · Referral form</strong> &nbsp; Prototype: nothing is sent. Try sending it empty to see the error list.</div></div>
<header class="site-head"><div class="wrap"><a class="logo" href="#" aria-label="Ensign home"><img src="%(logo)s" alt="Ensign"></a><nav class="nav" aria-label="Main"><a href="#">Services</a><a href="#">About Andrew</a><a href="#">Contact</a><a class="btn btn-ghost" href="#">Refer someone</a><button class="btn btn-ghost menu-btn">Menu</button></nav></div></header>
<main>
<section class="ref-head"><div class="wrap rh">
  <div class="rh-text">
    <p class="status"><i></i>Taking referrals now</p>
    <h1>Refer a participant</h1>
    <p class="lead">About 5 minutes. Andrew replies within 1 business day.</p>
    <div class="rh-cta"><a class="btn btn-primary btn-big" href="#s-you">Start the referral %(down)s</a><a class="call" href="tel:[PLACEHOLDER]">Rather call? [PLACEHOLDER: phone]</a></div>
  </div>
  <div class="ticket" aria-label="What to expect">
    <div class="t-top"><span class="t-lbl">Your referral</span><span class="t-ref" aria-hidden="true">ENS-······</span></div>
    <ul class="t-list">
      <li>%(ck)s<span><b>Self managed or plan managed</b> plans</span></li>
      <li>%(ck)s<span><b>Reply within 1 business day</b>, with a reference number</span></li>
      <li>%(ck)s<span><b>First meeting</b> in the participant's first week</span></li>
      <li>%(pin)s<span><b>South East Queensland</b> <details class="areas"><summary>See areas</summary><p>Brisbane, Ipswich, Logan, Moreton Bay, Redlands, Gold Coast, Sunshine Coast, Scenic Rim, Lockyer Valley</p></details></span></li>
    </ul>
    <p class="t-foot">NDIA managed plans need a registered provider, so Ensign can't take those.</p>
  </div>
</div></section>
<div class="wrap ref-body">
  <aside class="aside">
    <details class="ready-d" open><summary><h2>Have these ready</h2></summary>
    <ul class="ready">
      <li>%(ck)s<span>The participant's consent to share their details</span></li>
      <li>%(ck)s<span>Their suburb and the best number to reach them</span></li>
      <li>%(ck)s<span>Any documents you can share, such as the NDIS plan or reports. Optional.</span></li>
      <li>%(ck)s<span>About 5 minutes</span></li>
    </ul></details>
    <nav aria-label="Form sections"><ul class="jump"><li><a href="#s-you" class="on">About you</a></li><li><a href="#s-p">About the participant</a></li><li><a href="#s-docs">Documents</a></li><li><a href="#s-more">Anything else</a></li><li><a href="#s-send">Consent and send</a></li></ul></nav>
  </aside>
  <div>
  <form id="ref" class="rform" action="/api/referrals" method="post" enctype="multipart/form-data" novalidate>
    <div class="summary" id="sum" tabindex="-1" hidden><h2>Please fix these to send the referral</h2><ul></ul></div>
    <section class="block" id="s-you" aria-labelledby="h-you"><h2 id="h-you">About you</h2><p class="sub">So Andrew knows who to reply to.</p>
      <div class="grid2">%(rname)s%(rrole)s%(rphone)s%(remail)s%(org)s</div></section>
    <section class="block" id="s-p" aria-labelledby="h-p"><h2 id="h-p">About the participant</h2><p class="sub">Only what Andrew needs to reply.</p>
      <div class="grid2">%(pname)s%(sub)s%(dob)s%(ndis)s%(knows)s%(who)s<div class="grid2 full nom" id="nom" hidden>%(cname)s%(cphone)s</div>%(ps)s%(pe)s%(svc)s%(pm)s</div></section>
    <section class="block" id="s-docs" aria-labelledby="h-docs"><h2 id="h-docs">Documents <span class="opt">(optional)</span></h2><p class="sub">Upload the NDIS plan or reports. PDF, Word or photos, up to 10 MB each.</p>
      <div class="drop">%(up)s<p><strong>Drag files here</strong> or choose them from your device.</p><span class="btn btn-ghost" aria-hidden="true">Choose files</span><input type="file" id="files" name="files" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.heic" aria-label="Choose files to upload" aria-describedby="files-e"></div>
      <p class="err" id="files-e" hidden></p><ul class="files" aria-live="polite"></ul></section>
    <section class="block" id="s-more" aria-labelledby="h-more"><h2 id="h-more">Anything else Andrew should know <span class="opt">(optional)</span></h2><p class="sub">For example goals, supports already in place, or the best time to call.</p>
      <div class="f"><label class="sr" for="more">Anything else Andrew should know</label><textarea class="in" id="more" name="more" rows="4"></textarea></div></section>
    <section class="block" id="s-send" aria-labelledby="h-send"><h2 id="h-send">Consent and send</h2><p class="sub">Both boxes need a tick.</p>
      <div class="notice"><strong>How we use this information</strong>Ensign Support Coordination collects the details in this form, including health information and any documents you upload, to respond to this referral and, if we accept it, to provide our services. We may share it with the participant's providers, plan manager and the NDIA, as explained in our <a href="#">Privacy Policy</a>. If key details are missing, we may not be able to accept the referral. Our Privacy Policy explains how to access or correct information and how to complain.</div>
      <div id="w-c1"><label class="tick"><input type="checkbox" name="c1" id="c1"><span>I am the participant, or I have the consent of the participant (or their nominee or guardian) to share their personal and health information, including uploaded documents, with Ensign Support Coordination.</span></label><p class="err" id="w-c1-e" hidden></p></div>
      <div id="w-c2"><label class="tick"><input type="checkbox" name="c2" id="c2"><span>I have read the collection notice above and the Privacy Policy.</span></label><p class="err" id="w-c2-e" hidden></p></div>
      <p class="err send-err" tabindex="-1" hidden>Something went wrong and the referral didn't send. Your details are still here. Try again, or call Andrew on [PLACEHOLDER: phone].</p>
      <div class="submit"><button class="btn btn-primary" type="submit"><span>Send referral</span>%(arrow)s</button><p class="hint">Andrew will reply within 1 business day.</p></div>
    </section>
  </form>
  <section class="block done" id="done" hidden aria-live="polite">
    <div class="tickc">%(ckbig)s</div>
    <h2>Referral sent.</h2>
    <p style="margin-top:12px">Andrew will reply within 1 business day. A copy with your reference number is on its way to <b class="refmail">your email</b>. It has no health details or documents.</p>
    <p class="refno">Your reference number <b class="refval">ENS-000000</b></p>
    <ul class="next">
      <li><span class="ico">%(hash)s</span><b>Reference number</b><span class="hint">Straight away</span></li>
      <li><span class="ico">%(clock)s</span><b>Reply within 1 business day</b></li>
      <li><span class="ico">%(meet)s</span><b>First meeting</b><span class="hint">In the participant's first week</span></li>
      <li><span class="ico">%(doc)s</span><b>Written summary</b><span class="hint">Before each plan review</span></li>
    </ul>
    <p style="margin-top:24px"><button type="button" class="btn btn-ghost again">Refer someone else</button></p>
  </section>
  <pre id="log" class="log" aria-label="Prototype log"></pre>
  </div>
</div>
</main>'''%dict(logo=logo,tiles=tiles,down=S('<path d="M12 5v14M6 13l6 6 6-6"/>'),pin=S(I['where']),ck=S(I['check']),ckbig=S('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),up=S(I['up']),arrow=S(I['arrow']),hash=S(I['hash']),clock=S(I['clock']),meet=S(I['meet']),doc=S(I['doc']),
 rname=fld('rname','Your name','rname',ac='name'),rrole=fld('rrole','Your role','rrole',hint='For example LAC, social worker, family member'),rphone=fld('rphone','Phone','rphone','tel','tel',extra=' inputmode="tel"'),remail=fld('remail','Email','remail','email','email'),
 org='<div class="f full"><label for="org">Organisation <span class="opt">(optional)</span></label><input class="in" id="org" name="org" autocomplete="organization"></div>',
 pname=fld('pname',"Participant's name",'pname'),sub=fld('sub',"Participant's suburb",'sub',hint='For example Springfield Lakes'),ndis=fld('ndis','NDIS number','ndis',opt=True,hint='9 digits, if you have it',extra=' inputmode="numeric"'),knows=pills('knows','Does the participant know about this referral?','knows',['Yes','No','Not sure'],'three'),who=pills('who','Who should Andrew contact first?','who','The participant|Their nominee or guardian|Me'.split('|'),'three'),cname=fld('cname','Their name','cname',hint='Leave blank if it is the participant'),cphone=fld('cphone','Their phone','cphone','tel',extra=' inputmode="tel"'),dob=date('dob','Date of birth','dob','For example 14 3 1990'),ps=date('ps','NDIS plan start date <span class="opt">(optional)</span>','ps','Leave blank if you don\'t know'),pe=date('pe','NDIS plan end date <span class="opt">(optional)</span>','pe','Leave blank if you don\'t know'),
 svc=pills('svc','Service needed','svc',['Support coordination','Psychosocial recovery coaching','Not sure yet'],'three'),pm=pills('pm','Plan management','pm',['Self managed','Plan managed','Not sure'],'three'))
body=body.replace('<p class="err" id="w-rname-e"','<p class="err" id="w-rname-e"')
html='<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Ensign Referral Form</title><link rel="icon" href="%s"><style>@font-face{font-family:"Figtree";src:url(data:font/woff2;base64,%s) format("woff2");font-weight:300 900}'%(fav,fig)+tokens+open('refer.css').read()+'</style></head><body>'+body+'<script>'+open('refer.js').read()+'</script></body></html>'
open('ensign-referral-form.html','w').write(html); print(len(html))
