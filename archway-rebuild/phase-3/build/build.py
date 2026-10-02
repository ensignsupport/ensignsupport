import base64
def b64(p): return base64.b64encode(open(p,'rb').read()).decode()
fig=b64("/tmp/claude-0/p3/ds/node_modules/@fontsource-variable/figtree/files/figtree-latin-wght-normal.woff2")
ds=open("/tmp/claude-0/p3/ds/ds.css").read()
root=ds[ds.index(":root{"):ds.index("[data-font=")]
base=ds[ds.index("*{box-sizing"):ds.index("/* Sheet chrome")]
head=ds[ds.index("/* ===== Site: header"):ds.index("/* ===== Site: first screen")]
tokens=root+'body{--f-head:"Figtree";--f-body:"Figtree";--w-head:400}\n'+base+head
logo="data:image/svg+xml;base64,"+b64("/tmp/claude-0/p3/logo3/final/logo-ensign.svg")
fav="data:image/svg+xml;base64,"+b64("/tmp/claude-0/p3/logo3/final/favicon.svg")
arrow='<span class="arrow" aria-hidden="true"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10h12M11 5l5 5-5 5"/></svg></span>'
ink='<svg class="ink" viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M2 8 C 22 4, 48 3, 70 5 S 94 9, 98 5"/></svg>'
def rows(name,opts):
    return "".join('<li class="row"><input type="radio" id="%s-%d" name="%s" value="%s" required><label for="%s-%d"><span class="txt">%s%s</span>%s</label></li>'%(name,i,name,o,name,i,o,ink,arrow) for i,o in enumerate(opts))
NXT='<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 10h12M11 5l5 5-5 5"/></svg>'
CHEV='<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 4l6 6-6 6"/></svg>'
TICK='<div class="tick" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5"/></svg></div>'
who=["Me","Someone I support","I'm referring someone"]
# Four shown up front, the rest are reached through "Somewhere else".
# PLACEHOLDER: Andrew to confirm which four areas he actually sees most.
# Full service area list stays in phase-1/ensign-facts.md and on the Contact page.
where=["Brisbane","Ipswich","Logan","Moreton Bay"]
m='''<div class="sheet-bar"><div class="wrap"><strong>Component 1 · Enquiry flow</strong>
<button data-dev="computer" aria-pressed="false">Preview as computer</button><button data-dev="phone" aria-pressed="false">Preview as phone</button>
<span class="note">Prototype: nothing is sent. The grey box shows what would be saved.</span></div></div>
<header class="site-head"><div class="wrap"><a class="logo" href="#" aria-label="Ensign home"><img src="%(logo)s" alt="Ensign"></a>
<nav class="nav" aria-label="Main"><a href="#">Services</a><a href="#">About Andrew</a><a href="#">Contact</a><a class="btn btn-ghost" href="#">Refer someone</a><button class="btn btn-ghost menu-btn">Menu</button></nav></div></header>
<main class="page-demo"><div class="wrap demo-grid">
<div><h1>One coordinator you know by name.</h1><p class="lead">Andrew reads your NDIS plan with you and comes to you in person.</p></div>
<div>
<form id="enq" class="enq" action="/api/enquiries" method="post" novalidate aria-label="Start an enquiry">
  <div class="enq-top"><div class="enq-progress" aria-hidden="true"><span class="bar"></span></div><span class="enq-count" aria-hidden="true">Question 1 of 5</span></div>
  <p id="enq-live" class="sr" aria-live="polite"></p>

  <fieldset class="enq-step" data-step="0"><legend class="enq-q">Who is this for?</legend><ul class="rows">%(who)s</ul>
    <div class="actions spacer" aria-hidden="true"></div></fieldset>

  <fieldset class="enq-step" data-step="1" hidden><legend class="enq-q">Where are you?</legend>
    <div class="where-pick">
      <ul class="rows two">%(where)s</ul>
      <div class="other-slot">
        <button type="button" class="other-btn" aria-expanded="false"><span class="txt">Somewhere else</span><span class="arrow" aria-hidden="true">%(chev)s</span></button>
        <div class="field other-field" hidden><label class="sr" for="f-area">Which area are you in?</label><input id="f-area" name="area" placeholder="Type your area" autocomplete="address-level2"><p class="err" id="f-area-e" hidden></p></div>
      </div>
    </div>
    <div class="actions"><button type="button" class="btn btn-primary next" data-to="2" hidden><span>Next</span>%(nxt)s</button><button type="button" class="back" data-to="0">Back</button><p class="ph">PLACEHOLDER: Andrew to confirm these four areas</p></div>
  </fieldset>

  <fieldset class="enq-step" data-step="2" hidden><legend class="enq-q">What is your name?</legend>
    <div class="fields"><div class="field"><label class="sr" for="f-name">Your name</label><input id="f-name" name="name" autocomplete="name" required><p class="err" id="f-name-e" hidden></p></div></div>
    <div class="actions"><button type="button" class="btn btn-primary next" data-to="3"><span>Next</span>%(nxt)s</button><button type="button" class="back" data-to="1">Back</button></div>
  </fieldset>

  <fieldset class="enq-step" data-step="3" hidden><legend class="enq-q">How can Andrew reach you?</legend>
    <div class="fields two">
      <div class="field"><label for="f-phone">Phone</label><input id="f-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required><p class="err" id="f-phone-e" hidden></p></div>
      <div class="field"><label for="f-email">Email <span class="opt">(optional)</span></label><input id="f-email" name="email" type="email" inputmode="email" autocomplete="email"><p class="err" id="f-email-e" hidden></p></div>
    </div>
    <div class="actions"><button type="button" class="btn btn-primary next" data-to="4"><span>Next</span>%(nxt)s</button><button type="button" class="back" data-to="2">Back</button></div>
  </fieldset>

  <fieldset class="enq-step" data-step="4" hidden aria-labelledby="q4">
    <div class="recap" aria-label="Your answers"></div>
    <p class="enq-q" id="q4">Anything Andrew should know first?</p>
    <div class="fields"><div class="field"><label class="sr" for="f-note">Anything Andrew should know first, optional</label><textarea id="f-note" name="note" rows="2" aria-describedby="f-note-h"></textarea><p class="help" id="f-note-h">Optional. Please don%(rsq)st include health details.</p></div></div>
    <p class="hint ref-note" hidden>Sending a full referral with documents? <a href="#">Use the referral form</a>.</p>
    <p class="err save-err" role="alert" hidden>That didn%(rsq)st go through. Please try again, or call Andrew on [PLACEHOLDER: phone].</p>
    <div class="actions"><button class="btn btn-primary btn-send" type="submit"><span>Send to Andrew</span>%(nxt)s</button><button type="button" class="back" data-to="3">Back</button></div>
  </fieldset>

  <div class="enq-step done" data-step="5" hidden>%(tick)s<h2>Sent. Andrew will reply within 1 business day.</h2><p>Available 7am to 7pm, seven days.</p><button type="button" class="back again">Start a new enquiry</button></div>
  <div class="enq-step done" data-step="6" hidden>%(tick)s<h2>Your details are saved. Now press send in your messages app.</h2><p>Andrew replies within 1 business day.</p><div class="actions"><button type="button" class="btn btn-ghost retry">Messages didn%(rsq)st open? Try again</button><a class="back" href="tel:[PLACEHOLDER]">Or call Andrew</a></div><button type="button" class="back again">Start a new enquiry</button></div>
  <p class="meta">Replies within 1 business day. Available 7am to 7pm, seven days.</p>
</form>
<pre id="log" class="log" aria-label="Prototype log"></pre>
</div></div></main>'''%dict(logo=logo,who=rows("who",who),where=rows("where",where),nxt=NXT,chev=CHEV,tick=TICK,rsq="'")
html='<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Ensign Enquiry Flow</title><link rel="icon" href="%s"><style>@font-face{font-family:"Figtree";src:url(data:font/woff2;base64,%s) format("woff2");font-weight:300 900}'%(fav,fig)+tokens+open("enq.css").read()+'</style></head><body>'+m+'<script>'+open("enq.js").read()+'</script></body></html>'
open("ensign-enquiry-flow.html","w").write(html); print(len(html))
