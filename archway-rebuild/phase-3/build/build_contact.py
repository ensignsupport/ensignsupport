g={}; exec(open('build_home.py').read(),g)
body_home=g['body']; S=g['S']; arrow=g['arrow']; form=g['form']
header=body_home[:body_home.index('<main id="main">')].replace('<a href="#">Contact</a>','<a href="#" aria-current="page">Contact</a>')
footer=body_home[body_home.index('</main>')+7:]
ic=lambda p:'<span class="c-ic">%s</span>'%S(p)
form2=form.replace('<p class="meta">','<p class="notice-s">We use these details to reply to you. Please don\'t include health information here. <a href="#">Use the referral form</a> instead. See our <a href="#">Privacy Policy</a>.</p><p class="meta">')
main='''<main id="main">
<section class="ct"><div class="wrap ct-grid">
  <div>
    <h1>Talk to Andrew</h1>
    <ul class="ways">
      <li><a href="tel:[PLACEHOLDER]">%(i_phone)s<span><small>Phone</small><b>[PLACEHOLDER: phone]</b></span></a></li>
      <li><a href="mailto:[PLACEHOLDER]">%(i_mail)s<span><small>Email</small><b>[PLACEHOLDER: email]</b></span></a></li>
      <li><div>%(i_clock)s<span><small>Hours</small><b>7am to 7pm, seven days</b></span></div></li>
      <li><div>%(i_reply)s<span><small>Reply</small><b>Within 1 business day</b></span></div></li>
    </ul>
    <div class="tis">%(i_lang)s<p><b>Need an interpreter?</b> Call the Translating and Interpreting Service on <a href="tel:131450">131 450</a> and ask them to call Andrew.</p></div>
  </div>
  <div><p class="send-h">Send a message</p>%(form)s</div>
</div></section>
<section class="crisis-sec"><div class="wrap"><div class="crisis-card">
  <div class="cc-ic">%(i_heart)s</div>
  <div><h2>Ensign is not a crisis service</h2><p>If someone is in danger, call <b>000</b>. For 24 hour crisis support, call <b>Lifeline on 13 11 14</b>.</p></div>
  <div class="cc-btns"><a class="btn btn-crisis" href="tel:000">Call 000</a><a class="btn btn-ghost-w" href="tel:131114">Call Lifeline 13 11 14</a></div>
</div></div></section>
</main>'''%dict(form=form2,i_phone=ic('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2"/>'),i_mail=ic('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),i_clock=ic('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),i_reply=ic('<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5"/>'),i_lang=ic('<path d="M4 5h10v8H8l-4 3z"/><path d="M14 9h6v8l-3-2h-6v-2"/>'),i_heart=S('<path d="M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z"/>'))
css='''
.nav a[aria-current="page"]{font-weight:600;text-decoration:underline;text-underline-offset:6px;text-decoration-thickness:2px;text-decoration-color:var(--accent)}
.ct{padding:var(--s8) 0 var(--s8)}
.ct-grid{display:grid;grid-template-columns:6fr 6fr;gap:var(--s8);align-items:start}
.ct h1{font-size:clamp(44px,4.6vw + 18px,84px);letter-spacing:var(--track-display);line-height:var(--lh-head)}
.ways{list-style:none;margin:var(--s7) 0 0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:var(--s3)}
.ways li>a,.ways li>div{display:flex;gap:var(--s4);align-items:center;background:var(--surface);border-radius:var(--r-md);padding:var(--s4) var(--s5);color:var(--text);text-decoration:none;box-shadow:0 1px 0 var(--line);min-height:88px;transition:box-shadow 200ms ease}
@media (hover:hover) and (pointer:fine){.ways li>a:hover{box-shadow:inset 0 0 0 1.5px var(--accent)}}
.c-ic{flex:none;width:44px;height:44px;border-radius:12px;background:var(--indigo-50);color:var(--accent);display:grid;place-items:center}
.c-ic svg{width:22px;height:22px}
.ways small{display:block;font-size:14px;color:var(--muted)}
.ways b{display:block;font-size:17px;font-weight:600;overflow-wrap:anywhere}
.tis{display:flex;gap:var(--s4);align-items:flex-start;margin-top:var(--s5);padding:var(--s5);border-radius:var(--r-md);background:var(--n-100)}
.tis p{margin:0;font-size:16px}
.send-h{font-size:var(--t-h3);font-weight:500;margin:0 0 var(--s4)}
.enq{margin-top:0}
.notice-s{font-size:14px;color:var(--muted);margin:var(--s4) 0 0}
.crisis-sec{padding:0 0 var(--section)}
.crisis-card{display:grid;grid-template-columns:auto 1fr auto;gap:var(--s5);align-items:center;background:var(--indigo-900);color:var(--n-0);border-radius:var(--r-lg);padding:var(--s6)}
.cc-ic{width:56px;height:56px;border-radius:50%;background:rgba(160,189,254,.16);color:#a0bdfe;display:grid;place-items:center}
.cc-ic svg{width:28px;height:28px}
.crisis-card h2{font-size:clamp(24px,1vw + 18px,32px);color:var(--n-0)}
.crisis-card p{margin:var(--s2) 0 0;color:var(--indigo-100)}
.cc-btns{display:flex;gap:var(--s3);flex-wrap:wrap}
.btn-crisis{background:var(--n-0);color:var(--indigo-900)}
.btn-ghost-w{box-shadow:inset 0 0 0 1.5px var(--indigo-200);color:var(--n-0)}
@media (max-width:1080px){.crisis-card{grid-template-columns:auto 1fr}.cc-btns{grid-column:1/-1}}
@media (max-width:820px){.ct{padding-top:var(--s5)}.ct-grid{grid-template-columns:1fr;gap:var(--s6)}.ways{grid-template-columns:1fr}.crisis-card{grid-template-columns:1fr;padding:var(--s5)}.cc-btns .btn{width:100%}}
'''
html=g['html']
head=html[:html.index('</style>')].replace('<title>Support Coordination and Recovery Coaching in South East Queensland | Ensign</title>','<title>Contact Andrew | Ensign Support Coordination</title>').replace('content="Andrew Manoba provides NDIS support coordination and psychosocial recovery coaching across South East Queensland. Taking new participants now. Replies within 1 business day."','content="Call or message Andrew Manoba at Ensign. Available 7am to 7pm, seven days. Replies within 1 business day."')
enqjs=open('enq.js').read()
out=head+css+'</style></head><body>'+header+main+footer+'<script>'+enqjs+'</script></body></html>'
open('ensign-contact.html','w').write(out)
# 404
m404='''<main id="main"><section class="nf"><div class="wrap">
<p class="nf-code" aria-hidden="true">404</p>
<h1>This page isn't here.</h1>
<p class="lead">The link may be old. Try the home page, or talk to Andrew.</p>
<div class="nf-btns"><a class="btn btn-primary" href="#">Home %s</a><a class="btn btn-ghost" href="#">Talk to Andrew</a></div>
</div></section></main>'''%arrow
css404='''.nf{padding:var(--s9) 0 var(--section);text-align:center}
.nf-code{font-size:clamp(120px,16vw,240px);font-weight:300;letter-spacing:-.06em;line-height:.9;color:#5f86ec;margin:0}
.nf h1{font-size:clamp(36px,3vw + 20px,64px);letter-spacing:var(--track-h2)}
.nf .lead{margin:var(--s4) auto 0}
.nf-btns{display:flex;gap:var(--s3);justify-content:center;flex-wrap:wrap;margin-top:var(--s6)}
@media (max-width:820px){.nf-btns .btn{width:100%}}'''
head404=html[:html.index('</style>')].replace('<title>Support Coordination and Recovery Coaching in South East Queensland | Ensign</title>','<title>Page not found | Ensign</title>')
open('ensign-404.html','w').write(head404+css404+'</style></head><body>'+body_home[:body_home.index('<main id="main">')]+m404+footer+'</body></html>')
print('ok')
