src=open('build.py').read()
exec(src[:src.index("arrow=")])
ds=open("/tmp/claude-0/p3/ds/ds.css").read()
vis_css=ds[ds.index("/* ===== Site: how it starts"):ds.index("/* ===== Phone")]
ph=ds[ds.index("/* ===== Phone"):]
phone_rules="@media (max-width:820px){.steps-head{display:block}.steps-head .btn{margin-top:var(--s5)}.path{grid-template-columns:1fr;gap:var(--s6)}.path::before{top:36px;bottom:36px;left:35px;right:auto;height:auto;border-top:0;border-left:2px dashed var(--indigo-300)}.step{display:grid;grid-template-columns:72px 1fr;column-gap:var(--s5)}.step-icon{margin:0;grid-row:span 3}.fact-grid{grid-template-columns:1fr 1fr;gap:var(--s6) var(--s5)}.facts{border-radius:var(--r-md)}.nav a:not(.btn),.nav a.btn{display:none}.menu-btn{display:inline-flex}.site-head .logo img{height:40px}}\n@media (max-width:480px){.fact-grid{grid-template-columns:1fr}.fact{display:grid;grid-template-columns:48px 1fr;column-gap:16px}.fact svg{grid-row:span 2;margin:0}}"
extra='''
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.step-icon{position:relative}
.step-icon .num{position:absolute;top:-4px;right:-4px;width:26px;height:26px;border-radius:50%;background:var(--indigo-900);color:var(--n-0);font-size:14px;font-weight:600;display:grid;place-items:center}
.step h3{margin-top:0}
.path::before{border-top-color:var(--indigo-400,#6993fa)!important;border-left-color:#6993fa!important}
.fact .k{text-transform:none!important;letter-spacing:0!important;font-size:16px!important}
.cta-phone{display:none}
@media (max-width:820px){.cta-desk{display:none}.cta-phone{display:inline-flex;margin-top:var(--s7);width:100%}.fact-grid{gap:var(--s5)!important}.facts h2{margin-bottom:var(--s6)!important}.facts{padding:var(--s6) var(--s5)!important}}

.site-head .logo img{height:52px;width:auto}
.sheet-bar{background:var(--indigo-900);color:var(--n-0);font:500 14px/1.3 "Figtree",sans-serif}.sheet-bar .wrap{padding-top:var(--s3);padding-bottom:var(--s3)}
/* reveal: path draws, steps stagger in (decorative, once) */
.js .path::before{transform:scaleX(0);transform-origin:left;transition:transform 900ms var(--ease-out)}
.js .path.in::before{transform:none}
.js .step{opacity:0;transform:translateY(8px);transition:opacity 360ms var(--ease-out),transform 360ms var(--ease-out)}
.js .path.in .step{opacity:1;transform:none}
.js .path.in .step:nth-child(2){transition-delay:90ms}.js .path.in .step:nth-child(3){transition-delay:180ms}.js .path.in .step:nth-child(4){transition-delay:270ms}
.js .fact{opacity:0;transform:translateY(8px);transition:opacity 360ms var(--ease-out),transform 360ms var(--ease-out)}
.js .fact-grid.in .fact{opacity:1;transform:none}
.js .fact-grid.in .fact:nth-child(2){transition-delay:70ms}.js .fact-grid.in .fact:nth-child(3){transition-delay:140ms}.js .fact-grid.in .fact:nth-child(4){transition-delay:210ms}
@media (max-width:820px){.js .path::before{transform:scaleY(0);transform-origin:top}.js .path.in::before{transform:none}}
@media (prefers-reduced-motion:reduce){.js .path::before,.js .step,.js .fact{transition:none;opacity:1;transform:none}}
'''
mk=open("/tmp/claude-0/p3/ds/ds_markup.html").read()
steps=mk[mk.index('<section class="section"><div class="wrap">\n  <div class="steps-head">'):mk.index('</div>\n\n<!-- ============ PART 2')]
steps=steps.replace('<a class="btn btn-primary" href="#">Start with question 1</a>','<a class="btn btn-primary cta-desk" href="#enq">Get in touch</a>')
steps=steps.replace('</ol>','</ol><a class="btn btn-primary cta-phone" href="#enq">Get in touch</a>')
import re
for n in range(1,5):
    steps=steps.replace('</svg></span><p class="step-n">STEP %d</p>'%n,'</svg><b class="num" aria-hidden="true">%d</b></span><p class="sr">Step %d</p>'%(n,n))
# step 3 icon: checklist
steps=steps.replace('<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/>','<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 3.5h6v2.5H9z"/><path d="m8.5 11 1.5 1.5 2.5-2.5M8.5 16l1.5 1.5 2.5-2.5M14.5 11.5h1.5M14.5 16.5h1.5"/>')
# who icon: adult and child
steps=steps.replace('<circle cx="8" cy="7" r="3"/><circle cx="17" cy="10" r="2"/><path d="M2.5 20c.6-3.6 2.8-6 5.5-6s4.9 2.4 5.5 6M14 20c.3-2.6 1.4-4.4 3-4.4s2.7 1.8 3 4.4"/>','<circle cx="8.5" cy="6" r="2.8"/><circle cx="17" cy="11" r="2"/><path d="M4 21v-5.5a4.5 4.5 0 019 0V21M14 21v-3a3 3 0 016 0v3"/>')
steps=steps.replace('<p class="k">Plan types</p><p class="v">Self managed and plan managed</p>','<p class="k">Your plan</p><p class="v">Self managed or plan managed</p>')
steps=steps.replace('<p class="k">Who</p>','<p class="k">Who</p>').replace('<p class="k">Where</p>','<p class="k">Where</p>').replace('<p class="k">Languages</p>','<p class="k">Languages</p>')
m='''<div class="sheet-bar"><div class="wrap"><strong>Component 3 · How it starts and Is Ensign right for you?</strong> &nbsp; Scroll down: the path draws and the steps appear once.</div></div>
<header class="site-head"><div class="wrap"><a class="logo" href="#" aria-label="Ensign home"><img src="%s" alt="Ensign"></a><nav class="nav" aria-label="Main"><a href="#">Services</a><a href="#">About Andrew</a><a href="#">Contact</a><a class="btn btn-ghost" href="#">Refer someone</a><button class="btn btn-ghost menu-btn">Menu</button></nav></div></header>
<main>%s</main>'''%(logo,steps)
js='''document.documentElement.classList.add('js');
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}})},{rootMargin:'0px 0px -15% 0px'});
var reveal=document.querySelectorAll('.path,.fact-grid');
reveal.forEach(function(el){io.observe(el)});
/* safety net (C49): if the observer never fires, show everything anyway */
setTimeout(function(){reveal.forEach(function(el){el.classList.add('in');io.unobserve(el)})},2200);'''
html='<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Ensign Steps and Facts</title><link rel="icon" href="%s"><style>@font-face{font-family:"Figtree";src:url(data:font/woff2;base64,%s) format("woff2");font-weight:300 900}'%(fav,fig)+tokens+vis_css+phone_rules+extra+'</style><script>'+js.split('\n')[0]+'</script></head><body>'+m+'<script>'+'\n'.join(js.split('\n')[1:])+'</script></body></html>'
open("ensign-steps-facts.html","w").write(html); print(len(html))
