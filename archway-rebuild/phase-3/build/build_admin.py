src=open('build.py').read()
exec(src[:src.index("arrow=")])
def S(p): return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">%s</svg>'%p
body='''<div class="sheet-bar"><div class="wrap"><strong>Component 5 · Admin page</strong> &nbsp; Prototype password: <code>ensign-demo</code>. All records are fake sample data.</div></div>
<section id="login" class="login" aria-labelledby="l-h">
  <form id="login-form" class="login-card" novalidate>
    <img src="%(logo)s" alt="Ensign">
    <h1 id="l-h">Andrew's enquiries</h1>
    <p>Private page. Enter the admin password.</p>
    <p id="idle-msg" class="err" hidden>You were signed out after 15 minutes without activity.</p>
    <label for="pw">Password</label>
    <div class="pw"><input class="in" id="pw" type="password" autocomplete="current-password" aria-describedby="pw-err"><button type="button" id="show" aria-pressed="false" aria-label="Show password">Show</button></div>
    <p id="pw-err" class="err" hidden>That password isn't right. Try again.</p>
    <button class="btn btn-primary" type="submit">Sign in</button>
    <p class="fine">Signs out after 15 minutes without activity.</p>
  </form>
</section>
<div id="app" hidden>
  <header class="top"><div class="wrap"><img src="%(logo)s" alt="Ensign"><span class="sample">SAMPLE DATA</span><span class="who">Signed in as admin</span><button class="btn btn-ghost" id="logout">Sign out</button></div></header>
  <main class="app"><div class="wrap">
    <h1 tabindex="-1" style="font-size:clamp(28px,2vw + 18px,40px);letter-spacing:-.02em;margin-bottom:var(--s5)">Enquiries and referrals</h1>
    <p class="newline"><b id="s-new2">0</b> new, not contacted</p><div class="stats"><div class="stat new"><b id="s-new">0</b><span>New, not contacted</span></div><div class="stat"><b id="s-week">0</b><span>Total</span></div><div class="stat"><b id="s-enq">0</b><span>Enquiries</span></div><div class="stat"><b id="s-ref">0</b><span>Referrals</span></div></div>
    <div class="bar">
      <div class="tabs" role="tablist" aria-label="Type"><button role="tab" data-t="all" aria-selected="true">All<span class="count" id="c-all"></span></button><button role="tab" data-t="enq" aria-selected="false">Enquiries<span class="count" id="c-enq"></span></button><button role="tab" data-t="ref" aria-selected="false">Referrals<span class="count" id="c-ref"></span></button></div>
      <label class="sr" for="search">Search</label><input class="in search" id="search" type="search" placeholder="Search name, suburb, phone">
      <label class="sr" for="status">Status</label><select class="in" id="status"><option value="all">All statuses</option><option value="new">New</option><option value="contacted">Contacted</option><option value="closed">Closed</option></select>
    </div>
    <div class="list"><table><thead></thead><tbody></tbody></table><ul class="cards"></ul><p class="empty" hidden>Nothing matches. Try a different search or status.</p></div>
  </div></main>
</div>
<div class="toast" id="toast" role="status" hidden><span></span><button type="button">Undo</button></div>
<p class="idle" id="idle-warn" role="alert" hidden>You'll be signed out in 2 minutes. Tap anywhere to stay signed in.</p>
<div class="scrim" id="scrim" hidden></div>
<aside class="panel" id="panel" role="dialog" aria-modal="true" aria-labelledby="p-title" hidden>
  <header><div><h2 id="p-title" tabindex="-1"></h2><p class="sub" id="p-sub"></p></div><button class="x" id="p-x" aria-label="Close">%(x)s</button></header>
  <div class="body">
    <div class="quick"><a class="btn btn-primary" id="p-call" href="#">%(phone)s<span>Call</span></a><a class="btn btn-ghost" id="p-mail" href="#">%(mail)s<span>Email referrer</span></a></div>
    <p class="note-h" id="st-h">Status</p>
    <div class="status-set" role="group" aria-labelledby="st-h"><button data-s="new">New</button><button data-s="contacted">Contacted</button><button data-s="closed">Closed</button></div>
    <p id="p-live" class="sr" aria-live="polite"></p>
    <p class="note-h"><label for="p-notes">Andrew's notes</label> <span class="saved" id="p-saved" aria-live="polite"></span></p>
    <textarea class="in" id="p-notes" placeholder="Only for Andrew. Not sent to anyone."></textarea>
    <p class="note-h">Details</p>
    <dl id="p-dl"></dl>
    <p class="fine">Documents open through a private link that expires after a few minutes.</p>
  </div>
</aside>'''%dict(logo=logo,x=S('<path d="M6 6l12 12M18 6 6 18"/>'),phone=S('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2"/>'),mail=S('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'))
html='<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Ensign Admin</title><link rel="icon" href="%s"><style>@font-face{font-family:"Figtree";src:url(data:font/woff2;base64,%s) format("woff2");font-weight:300 900}'%(fav,fig)+tokens+open('admin.css').read()+'</style></head><body>'+body+'<script>'+open('admin.js').read()+'</script></body></html>'
open('ensign-admin.html','w').write(html); print(len(html))
