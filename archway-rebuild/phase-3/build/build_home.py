import re
def run(f):
    g={}; exec(open(f).read(),g); return g
E=run('build.py'); P=run('build_portrait.py'); V=run('build_visuals.py'); F=run('build_facts2.py')
fig,fav,tokens,logo=E['fig'],E['fav'],E['tokens'],E['logo']
b64=E['b64']
logo_dark="data:image/svg+xml;base64,"+b64("/tmp/claude-0/p3/logo3/final/logo-ensign-dark.svg")
# enquiry form markup
em=E['m']; form=em[em.index('<form id="enq"'):em.index('</form>')+7]
# portrait
pt1=P['pt'](P['p1'],"Andrew Manoba, smiling, in a suit","Support coordinator")
pt2=P['pt'](P['p2'],"Andrew Manoba standing by a window, smiling, in a navy blazer","Support coordinator")
mask=P['mask']; pm=P['m']; meet=pm[pm.index('<section class="section meet"'):pm.index('</section></main>')+10]
# steps only
st=V['steps']; steps=st[:st.index('<section class="section" style="padding-top:0">')]
# facts F1
fm=F['m']; f1=fm[fm.index('<section class="section" id="F1">'):fm.index('<section class="section" id="F3"')]
f1=f1.replace('<p class="opt-label">F1 · Tiles, question centred on the left</p>','').replace('id="F1"','id="fit" style="padding-top:0"')
ds=open('/tmp/claude-0/p3/ds/ds.css').read(); scene_css=ds[ds.index('/* ===== Site: scene'):ds.index('/* ===== Site: how it starts')]
def S(p): return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">%s</svg>'%p
arrow=S('<path d="M4 12h15M13 6l6 6-6 6"/>')
i_tick=S('<path d="M4.5 12.5 9 17l10.5-10"/>')
swaparrow='<svg viewBox="1 4 46 20" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 15.5C13 12 28 11.5 44 13.5"/><path d="M36 7.5 45 14l-8 7.5"/></svg>'
home_css='''
.home-hero{padding:var(--s7) 0 var(--s8)}
.home-hero .grid{display:grid;grid-template-columns:7fr 5.6fr;gap:var(--s8);align-items:center}
.home-hero h1{font-size:clamp(40px,4.1vw + 17px,76px);letter-spacing:var(--track-display);line-height:var(--lh-head)}
.home-hero .mark-wrap{position:relative;white-space:nowrap}
.home-hero .mark{position:absolute;left:-2%;bottom:-0.22em;width:104%;height:0.3em;overflow:visible;color:var(--indigo-400,#6993fa)}
.home-hero .lead{margin-top:var(--s5)}
.home-hero .enq{margin-top:var(--s6);max-width:none}
.home-hero .pt{margin:0;width:100%;max-width:500px}
@media (min-width:821px){.home-hero .pt .card{left:-3%}}
.home-hero h1 .l1{display:block}
.dbr{display:none}
@media (min-width:821px){.dbr{display:inline}}
.status{display:inline-flex;align-items:center;gap:var(--s2);font-size:var(--t-small);font-weight:600;color:var(--accent-strong);background:var(--indigo-100);padding:var(--s2) var(--s4);border-radius:var(--r-pill);margin-bottom:var(--s5)}
.status i{width:8px;height:8px;border-radius:50%;background:#1f8a4c}
.services .head{margin-bottom:var(--s7)}
.svc-grid{display:grid;grid-template-columns:1fr 1fr;gap:var(--s5)}
.svc{background:var(--surface);border-radius:var(--r-lg);padding:var(--s7) var(--s6);display:flex;flex-direction:column;gap:var(--s4);box-shadow:0 1px 0 var(--line)}
.svc .ico{width:56px;height:56px;border-radius:16px;background:var(--indigo-50);color:var(--accent);display:grid;place-items:center}
.svc .ico svg{width:28px;height:28px}
.svc h3{font-size:clamp(24px,1vw + 18px,32px);font-weight:500;letter-spacing:-.015em}
.svc p{margin:0}
.svc .ph{font-size:13px;font-weight:600;color:#8a5a00;background:#fff3d6;border-radius:6px;padding:2px 8px;align-self:flex-start}
.svc a{margin-top:auto;display:inline-flex;align-items:center;gap:var(--s2);font-weight:600;color:var(--text);text-decoration:none;border-bottom:1.5px solid var(--text);align-self:flex-start;min-height:44px}
.svc a svg{width:18px;height:18px;transition:transform 200ms var(--ease-out)}
@media (hover:hover) and (pointer:fine){.svc a:hover svg{transform:translateX(4px)}}
.services .small{margin-top:var(--s5)}
.referrers .band{display:grid;grid-template-columns:7fr 5fr;gap:var(--s7);align-items:center;background:var(--indigo-50);border-radius:var(--r-lg);padding:clamp(28px,5vw,64px)}
.referrers h2{font-size:clamp(30px,2vw + 18px,48px)}
.referrers p{margin-top:var(--s4)}
.referrers .side{display:flex;flex-direction:column;align-items:flex-start;gap:var(--s3)}
.referrers .side .btn{min-height:56px;padding:0 var(--s6);font-size:18px}
.close{text-align:center}
/* The page title has to be the largest heading on its own page. The hero H1
   is capped at 50px by the laptop fold, so the section headings come down to
   48px rather than the 60px site token. Home only. */
.scene-grid h2,.head h2,.steps-head h2,.f1 h2,.meet h2,.close h2{font-size:clamp(28px,2.2vw + 16px,48px)}
.close p{margin:var(--s4) auto 0;max-width:40ch}
.close .btn{margin-top:var(--s6);min-height:60px;padding:0 var(--s7);font-size:18px}
.foot{background:var(--indigo-900);color:var(--indigo-100);padding:var(--s8) 0 var(--s6);font-size:16px}
.foot .grid{display:grid;grid-template-columns:5fr 3fr 4fr;gap:var(--s7)}
.foot img{height:48px;margin-bottom:var(--s4)}
.foot p{margin:0 0 var(--s3);max-width:44ch}
.foot a{color:var(--n-0)}
.foot ul{list-style:none;margin:0;padding:0;display:grid;gap:var(--s2)}
.foot .crisis{background:rgba(255,255,255,.07);border-radius:var(--r-md);padding:var(--s4) var(--s5);color:var(--n-0)}
.foot .base{margin-top:var(--s7);padding-top:var(--s5);border-top:1px solid rgba(160,189,254,.25);display:flex;justify-content:space-between;gap:var(--s4);flex-wrap:wrap;font-size:14px;color:var(--indigo-200)}
.btn{white-space:nowrap}.btn svg{width:20px;height:20px;flex:none}
.call-link{display:inline-flex;align-items:center;gap:6px;font-weight:600;color:var(--text)!important;white-space:nowrap}
.call-link svg{width:18px;height:18px;color:var(--accent);flex:none}
.call-btn{display:none!important}
.call-btn span{color:var(--n-0)}
.trust{padding:0 0 var(--s8)}
.trust ul{list-style:none;margin:0;padding:var(--s5) 0;display:grid;grid-template-columns:repeat(4,1fr);gap:var(--s5);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.trust li{display:grid;grid-template-columns:28px 1fr;gap:var(--s3);align-items:start;font-size:16px;line-height:1.4}
.trust svg{width:24px;height:24px;color:var(--accent)}
.trust b{font-weight:600}
.close-card{text-align:center;background:var(--indigo-50);border-radius:var(--r-lg);padding:clamp(40px,6vw,88px) var(--s5)}
.close-cta{display:flex;justify-content:center;gap:var(--s3);flex-wrap:wrap;margin-top:var(--s6)}
.close-cta .btn{min-height:60px;padding:0 var(--s6);font-size:18px;margin:0}
.close-card .small{margin-top:var(--s5)}
.close-card p{margin-left:auto;margin-right:auto}
.btn{min-height:52px}
main .btn-primary,main .btn-ghost{min-height:56px;padding:0 var(--s6);font-size:17px}
.site-head .btn{min-height:48px;padding:0 var(--s5);font-size:17px}
.services+.section{padding-top:var(--s7)}
@media (min-width:821px){.step h3{min-height:2.4em}}
.nowrap{white-space:nowrap}
h1,h2,h3{text-wrap:balance}
p,li,dd{text-wrap:pretty}
.skip{position:absolute;left:-999px;top:8px;background:var(--n-0);padding:var(--s2) var(--s4);border-radius:8px;z-index:70}
.skip:focus{left:8px}
@media (max-width:820px){
  .home-hero{padding-top:var(--s4)}
  .home-hero .grid{grid-template-columns:1fr;gap:var(--s5)}
  .home-hero .pt{max-width:230px;margin:0 auto;order:-1}
  .home-hero .grid>div:first-child{display:contents}
  .home-hero .status{order:1;justify-self:start}.home-hero h1{order:2}.home-hero .lead{order:3}.home-hero .grid>.pt{order:4}.home-hero .enq{order:5}
  .home-hero .grid{row-gap:var(--s5)}
  .home-hero .lead{margin-top:0}
  .home-hero .enq{margin-top:var(--s3)}
  .scene-grid{grid-template-columns:1fr!important;gap:var(--s5)!important}.scene h2{max-width:none}
  .svc-grid{grid-template-columns:1fr}
  .svc{padding:var(--s6) var(--s5)}
  .referrers .band{grid-template-columns:1fr;gap:var(--s5)}
  .referrers .side .btn{width:100%}
  .close-cta{flex-direction:column}.close-cta .btn{width:100%}
  .nav{gap:var(--s2)}.site-head .logo img{height:34px!important}.call-link{display:none!important}.call-btn{display:inline-flex!important;min-height:44px;padding:0 var(--s4)}
  .trust{padding-bottom:var(--s6)}.trust ul{grid-template-columns:1fr 1fr;gap:var(--s4)}
  .foot .grid{grid-template-columns:1fr;gap:var(--s6)}
  /* On a phone the footer is the navigation, so its links have to be as
     tappable as anything else. They were 19px tall. */
  .foot ul{gap:0}
  .foot ul li a{display:flex;align-items:center;min-height:48px}
  .foot .base{gap:var(--s2)}
  .foot .base a{display:inline-flex;align-items:center;min-height:44px}
  .foot .crisis a{display:inline-flex;align-items:center;min-height:44px}
}
.pt-phone{display:none}

.scene .scene-grid{display:block}
.scene h2{max-width:36ch;margin:0;text-wrap:initial}
.scene .scene-grid p{margin:0}
.swap{display:grid;grid-template-columns:1fr auto 1fr;gap:var(--s4);align-items:stretch;margin-top:var(--s8)}
.swap .panel{border-radius:var(--r-lg);padding:var(--s6) var(--s6) var(--s7);display:flex;flex-direction:column;gap:var(--s5)}
.swap .ptag{margin:0;font-size:var(--t-small);font-weight:700;letter-spacing:.08em;text-transform:uppercase}
.swap ul{list-style:none;margin:0;padding:0;display:grid;gap:var(--s4);font-size:18px;line-height:1.45}
.swap li{display:grid;grid-template-columns:24px 1fr;gap:var(--s3);align-items:start}
.swap .before{background:transparent;box-shadow:inset 0 0 0 2px var(--n-200)}
.swap .before .ptag{color:var(--muted)}
.swap .before li{color:var(--muted)}
.swap .before .dot{width:11px;height:11px;border-radius:50%;background:transparent;box-shadow:inset 0 0 0 2px var(--n-600);opacity:.45;margin:8px 0 0 6px}
.swap .after{background:var(--surface);box-shadow:0 18px 40px -26px rgba(35,31,25,.45)}
.swap .after .ptag{color:var(--accent-strong)}
.swap .after li{font-weight:600}
/* a short line of feeling under each panel, and one line that resolves it */
.swap .pfoot{margin:auto 0 0;padding-top:var(--s3);font-size:16px;line-height:1.45}
.swap .before .pfoot{color:var(--muted)}
.swap .after .pfoot{color:var(--accent-strong);font-weight:600}
.swap-close{margin:var(--s6) 0 0;max-width:none;text-align:center;font-size:20px;font-weight:600;color:var(--text)}

.swap .after{box-shadow:0 22px 48px -24px rgba(35,31,25,.5),0 0 0 1px rgba(35,31,25,.04)}
.swap .after svg{width:24px;height:24px;color:var(--accent);margin-top:1px}
.swap-arrow{display:grid;place-items:center;color:var(--indigo-400,#6993fa);padding:0 var(--s2)}
.swap-arrow svg{width:88px;height:38px;overflow:visible}
@media (max-width:820px){
  .swap{grid-template-columns:1fr;gap:var(--s4);margin-top:var(--s6)}
  .swap .panel{padding:var(--s5)}
  .swap-arrow{transform:rotate(90deg);justify-self:center}
  .swap-arrow svg{width:44px}
  .swap ul{font-size:17px}
}
'''
mark='<svg class="mark" viewBox="0 0 300 30" preserveAspectRatio="none" aria-hidden="true"><path d="M4 20 C 60 9, 130 6, 205 12 S 290 19, 296 10" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round"/></svg>'
body='''<a class="skip" href="#main">Skip to content</a>
<header class="site-head"><div class="wrap"><a class="logo" href="#" aria-label="Ensign home"><img src="%(logo)s" alt="Ensign"></a><nav class="nav" aria-label="Main"><a href="#">Services</a><a href="#">About Andrew</a><a href="#">Contact</a><a class="call-link" href="tel:[PLACEHOLDER]">%(phone)s<span>[PLACEHOLDER: phone]</span></a><a class="btn btn-ghost" href="#">Refer someone</a><a class="btn btn-primary call-btn" href="tel:[PLACEHOLDER]" aria-label="Call Andrew">%(phone)s<span>Call</span></a><button class="btn btn-ghost menu-btn">Menu</button></nav></div></header>
<main id="main">
<section class="home-hero"><div class="wrap grid">
  <div>
    <p class="status"><i></i>Taking new participants now</p>
    <h1><span class="l1">One coordinator</span>you know <span class="mark-wrap">by name.%(mark)s</span></h1>
    <p class="lead">Andrew reads your NDIS plan with you <br class="dbr">and comes to you in person.</p>
    %(form)s
  </div>
  %(pt1)s
</div></section>

<section class="trust" aria-label="Why people trust Andrew"><div class="wrap"><ul>
  <li>%(i_years)s<span><b>7+ years</b> in disability and mental health</span></li>
  <li>%(i_cap)s<span><b>Master of Social Work</b>, University&nbsp;of&nbsp;Queensland</span></li>
  <li>%(i_shield)s<span><b>Worker Screening</b> and Blue Card checked</span></li>
  <li>%(i_bill)s<span><b>Actual time billed</b>, with itemised invoices</span></li>
</ul></div></section>

<section class="section scene"><div class="wrap">
  <div class="scene-grid">
    <h2>Four providers on the list. <br class="dbr">Nobody calling back.</h2>
  </div>
  <div class="swap">
    <article class="panel before">
      <p class="ptag">On your own</p>
      <ul>
        <li><span class="dot" aria-hidden="true"></span>A budget and a list of names</li>
        <li><span class="dot" aria-hidden="true"></span>Ringing around, leaving messages</li>
        <li><span class="dot" aria-hidden="true"></span>A week of waiting</li>
      </ul>
      <p class="pfoot">It is a lot to carry on your own.</p>
    </article>
    <div class="swap-arrow" aria-hidden="true">%(swaparrow)s</div>
    <article class="panel after">
      <p class="ptag">With Andrew</p>
      <ul>
        <li>%(i_tick)s Andrew does the ringing</li>
        <li>%(i_tick)s He checks who has room</li>
        <li>%(i_tick)s He checks with you before anything is booked</li>
      </ul>
      <p class="pfoot">One person who does it with you.</p>
    </article>
  </div>
  <p class="swap-close">You do not have to chase any of it.</p>
</div></section>

<section class="section services"><div class="wrap">
  <div class="head"><h2>Two ways Andrew can help</h2></div>
  <div class="svc-grid">
    <article class="svc"><span class="ico">%(i_sc)s</span><h3>Support coordination</h3><p>Andrew works through your plan with you and looks for providers who have room.</p><a href="#">How support coordination works %(arrow)s</a></article>
    <article class="svc"><span class="ico">%(i_rc)s</span><h3>Psychosocial recovery coaching</h3><p>For people living with psychosocial disability. You and Andrew plan the next steps together and he works through them with you, in person or by phone.</p><span class="ph">PLACEHOLDER: Andrew to confirm wording</span><a href="#">How recovery coaching works %(arrow)s</a></article>
  </div>
  <p class="small">Not sure which is in your plan? <a href="#enq">Ask Andrew.</a></p>
</div></section>

%(steps)s
%(f1)s
%(meet)s

<section class="section close"><div class="wrap"><div class="close-card">
  <h2>Talk to Andrew</h2>
  <p>Tell him who it's for and where. He'll reply within 1 business day.</p>
  <div class="close-cta"><a class="btn btn-primary" href="#enq" id="start-here">Start here %(up)s</a><a class="btn btn-ghost" href="#">Refer someone %(arrow)s</a></div>
  <p class="small">Referring a participant? Self managed and plan managed plans across South East Queensland.</p>
</div></div></section>
</main>
<footer class="foot"><div class="wrap">
  <div class="grid">
    <div><img src="%(logo_dark)s" alt="Ensign"><p>Support coordination and psychosocial recovery coaching across South East Queensland.</p><p>Phone [PLACEHOLDER: phone] · Email [PLACEHOLDER: email]</p><p>7am to 7pm, seven days. Replies within 1 business day.</p></div>
    <nav aria-label="Footer"><ul><li><a href="#">Services</a></li><li><a href="#">About Andrew</a></li><li><a href="#">Refer someone</a></li><li><a href="#">Contact</a></li><li><a href="#">Privacy policy</a></li></ul></nav>
    <div><p class="crisis">Ensign does not provide crisis support. In an emergency call <a href="tel:000">000</a>. For 24 hour crisis support call Lifeline on <a href="tel:131114">13 11 14</a>.</p></div>
  </div>
  <div class="base"><span>Ensign is an unregistered NDIS provider, working with self managed and plan managed participants. <span class="nowrap">ABN 19 518 036 825</span></span><span>Built by Archway Automation</span></div>
</div></footer>'''%dict(logo=logo,logo_dark=logo_dark,mark=mark,form=form,pt1=pt1,pt1b=pt1.replace('class="pt"','class="pt pt-small"'),steps=steps,f1=f1,meet=meet.replace(P['p2'],P['p2']),arrow=arrow,phone=S('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2"/>'),i_years=S('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),i_cap=S('<path d="M2.5 9.5 12 5l9.5 4.5L12 14z"/><path d="M6.5 11.5V16c1.5 1.6 3.5 2.5 5.5 2.5s4-.9 5.5-2.5v-4.5"/>'),i_shield=S('<path d="M12 3 4.5 6v5.5c0 4.5 3.2 8 7.5 9.5 4.3-1.5 7.5-5 7.5-9.5V6z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>'),i_bill=S('<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>'),up=S('<path d="M12 19V5M6 11l6-6 6 6"/>'),
 i_sc=S('<path d="M7 3.5h7l4 4V20a.5.5 0 01-.5.5h-10.5a.5.5 0 01-.5-.5V4a.5.5 0 01.5-.5z"/><path d="M14 3.5V8h4M9 12.5l2 2 4-4"/>'),
 i_rc=S('<path d="M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z"/>'),
 i_tick=i_tick,swaparrow=swaparrow)
# meet section in portrait page has pt2 placeholder token already inserted
js_close="document.getElementById('start-here').addEventListener('click',function(e){e.preventDefault();var f=document.getElementById('enq');f.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});setTimeout(function(){var h=f.querySelector('.enq-step:not([hidden]) .enq-q');if(h){h.setAttribute('tabindex','-1');h.focus({preventScroll:true});}},500);});"
vis_js=V['js']
css=tokens+open('enq.css').read()+open('portrait.css').read()+'.pt img{--mask:url("'+mask+'")}'+scene_css+V['vis_css']+V['phone_rules']+V['extra']+F['css']+home_css
css=css.replace('.sheet-bar','.x-sheet')  # no demo bar on the page
html='<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Support Coordination and Recovery Coaching in South East Queensland | Ensign</title><meta name="description" content="Andrew Manoba provides NDIS support coordination and psychosocial recovery coaching across South East Queensland. Taking new participants now. Replies within 1 business day."><link rel="icon" href="%s"><style>@font-face{font-family:"Figtree";src:url(data:font/woff2;base64,%s) format("woff2");font-weight:300 900}'%(fav,fig)+css+'</style><script>'+vis_js.split('\n')[0]+'</script></head><body>'+body+'<script>'+open('enq.js').read()+'\n'+'\n'.join(vis_js.split('\n')[1:])+'\n'+js_close+'</script></body></html>'
open('ensign-home.html','w').write(html); print(len(html))
