import base64
src=open('build.py').read()
exec(src[:src.index("arrow=")])  # fig, tokens, logo, fav, b64
brush=open("brush_bg_soft.svg").read()
mask=open("brush_mask_soft.txt").read().strip()
p1="data:image/jpeg;base64,"+b64("andrew-hero.jpg"); p2="data:image/jpeg;base64,"+b64("andrew-meet.jpg")
sig='<svg class="sig" viewBox="0 0 92 22" aria-hidden="true"><path d="M3 16 C 10 4, 16 4, 14 14 C 13 19, 22 8, 27 9 C 31 10, 27 17, 33 14 C 40 10, 42 6, 46 12 C 49 17, 55 7, 60 10 C 64 12, 62 16, 68 13 C 74 10, 80 11, 89 9" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
def pt(img,alt,cap):
    return '<figure class="pt">%s<div class="photo"><img src="%s" alt="%s"></div><figcaption class="card"><strong>Andrew Manoba</strong><span>%s</span></figcaption></figure>'%(brush,img,alt,cap)
ic={'years':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
'cap':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 9.5 12 5l9.5 4.5L12 14z"/><path d="M6.5 11.5V16c1.5 1.6 3.5 2.5 5.5 2.5s4-.9 5.5-2.5v-4.5"/></svg>',
'lang':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h10v8H8l-4 3z"/><path d="M14 9h6v8l-3-2h-6v-2"/></svg>',
'check':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 4.5 6v5.5c0 4.5 3.2 8 7.5 9.5 4.3-1.5 7.5-5 7.5-9.5V6z"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg>'}
m='''<div class="sheet-bar"><div class="wrap"><strong>Component 2 · Andrew's portrait</strong> &nbsp; Hover the photo on a computer. Brush shape is a placeholder until a real painted stroke is traced. Andrew's real signature goes here later.</div></div>
<header class="site-head"><div class="wrap"><a class="logo" href="#" aria-label="Ensign home"><img src="%(logo)s" alt="Ensign"></a><nav class="nav" aria-label="Main"><a href="#">Services</a><a href="#">About Andrew</a><a href="#">Contact</a><a class="btn btn-ghost" href="#">Refer someone</a><button class="btn btn-ghost menu-btn">Menu</button></nav></div></header>
<main>
<section class="hero2" id="hero"><div class="wrap grid"><div><h1>One coordinator you know by name.</h1><p class="lead">Andrew reads your NDIS plan with you and comes to you in person.</p></div>
%(pt1)s</div></section>
<section class="section meet" id="meet"><div class="wrap grid">%(pt2)s
<div><h2>The person you'll actually speak to</h2>
<p>Andrew Manoba has worked in disability and mental health for 7+ years, including as a support coordinator and a social worker.</p>
<ul class="creds">
<li>%(years)s<div><b>7+ years</b><span>Disability and mental health</span></div></li>
<li>%(cap)s<div><b>Bachelor and Master of Social Work</b><span>University of Queensland</span></div></li>
<li>%(lang)s<div><b>English and Tamil</b><span>Interpreters arranged</span></div></li>
<li>%(check)s<div><b>Screened and checked</b><span>Worker Screening, Blue Card, Police Check</span></div></li>
</ul>
<a class="more" href="#">Meet Andrew <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10h12M11 5l5 5-5 5"/></svg></a>
</div></div></section></main>'''%dict(logo=logo,pt1=pt(p1,"Andrew Manoba, smiling, in a suit","Support coordinator"),pt2=pt(p2,"Andrew Manoba standing by a window, smiling, in a navy blazer","Support coordinator"),**ic)
html='<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Ensign Portrait</title><link rel="icon" href="%s"><style>@font-face{font-family:"Figtree";src:url(data:font/woff2;base64,%s) format("woff2");font-weight:300 900}'%(fav,fig)+tokens+open("portrait.css").read()+'.pt img{--mask:url("'+mask+'")}</style></head><body>'+m+'</body></html>'
open("ensign-portrait.html","w").write(html); print(len(html))
