src=open('build_visuals.py').read()
exec(src[:src.index("m='''")])
ic={
'plan':'<path d="M7 3.5h7l4 4V20a.5.5 0 01-.5.5h-10.5a.5.5 0 01-.5-.5V4a.5.5 0 01.5-.5z"/><path d="M14 3.5V8h4M9.5 12.5h5M9.5 16h5"/>',
'who':'<circle cx="9" cy="7" r="2.8"/><circle cx="16.5" cy="10.5" r="2"/><path d="M4.5 20.5v-4a4.5 4.5 0 019 0v4M14 20.5v-2.5a2.5 2.5 0 015 0v2.5"/>',
'where':'<path d="M12 21s-6.5-5.8-6.5-11a6.5 6.5 0 0113 0c0 5.2-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
'lang':'<path d="M4 5.5h10v7.5H8.5L4 16.5z"/><path d="M14 9h6v7.5l-3.5-2.5H11V13"/>'}
def svg(k): return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">%s</svg>'%ic[k]
facts=[('plan','Your plan','Self managed or plan managed'),('who','Who','All ages and all disability types'),('where','Where','In person across South East Queensland'),('lang','Languages','English and Tamil, with interpreters arranged')]
tiles=''.join('<li class="t"><span class="ico">%s</span><div><p class="k">%s</p><p class="v">%s</p></div></li>'%(svg(a),b,c) for a,b,c in facts)
rows=''.join('<li class="r"><span class="ico">%s</span><p class="k">%s</p><p class="v">%s</p></li>'%(svg(a),b,c) for a,b,c in facts)
note='<p class="note">If your plan is NDIA managed, you\'ll need a registered NDIS provider.</p>'
css='''
.opt-label{font-size:15px;font-weight:600;color:var(--muted);margin:0 0 var(--s4)}
.fx{background:var(--indigo-900);color:var(--n-0);border-radius:var(--r-lg);padding:clamp(28px,5.5vw,72px)}
.fx h2{color:var(--n-0)}
.fx .ico{flex:none;width:48px;height:48px;border-radius:14px;background:rgba(160,189,254,.14);color:var(--indigo-200);display:grid;place-items:center}
.fx .ico svg{width:26px;height:26px}
.fx .k{font-size:15px;font-weight:600;color:var(--indigo-300);margin:0;line-height:1.3}
.fx .v{font-size:20px;line-height:1.35;margin:4px 0 0;max-width:none;color:var(--n-0)}
.fx .note{margin:var(--s6) 0 0;padding-top:var(--s5);border-top:1px solid rgba(160,189,254,.25);color:var(--indigo-100);font-size:16px;max-width:none}
/* F1: 2 by 2 tiles, heading left */
.f1{display:grid;grid-template-columns:4fr 7fr;gap:var(--s8);align-items:center}
.f1 h2{font-size:clamp(34px,2.4vw + 18px,52px)}
.f1 ul{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr 1fr;grid-auto-rows:1fr;gap:var(--s4)}
.f1 .t{display:flex;gap:var(--s4);align-items:flex-start;background:rgba(255,255,255,.05);border:1px solid rgba(160,189,254,.18);border-radius:var(--r-md);padding:var(--s5);min-height:128px}
/* F2: aligned rows */
.f2 h2{margin-bottom:var(--s6)}
.f2 ul{list-style:none;margin:0;padding:0}
.f2 .r{display:grid;grid-template-columns:48px 200px 1fr;gap:var(--s5);align-items:center;padding:var(--s4) 0;border-top:1px solid rgba(160,189,254,.2)}
.f2 .r:last-child{border-bottom:1px solid rgba(160,189,254,.2)}
.f2 .k{font-size:17px}
.f2 .v{margin:0}
.f2 .note{border-top:0;padding-top:0}
.f2 .r{grid-template-columns:48px 160px 1fr}
/* F3: question centred on top, four tiles in one row */
.f3{text-align:center}
.f3 h2{margin:0 auto var(--s7);max-width:none}
.f3 ul{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(4,1fr);grid-auto-rows:1fr;gap:var(--s4)}
.f3 .t{display:flex;flex-direction:column;align-items:center;gap:var(--s4);background:rgba(255,255,255,.05);border:1px solid rgba(160,189,254,.18);border-radius:var(--r-md);padding:var(--s6) var(--s5)}
.f3 .t .v{max-width:18ch;margin-left:auto;margin-right:auto}
.f3 .note{text-align:center;border-top:0;padding-top:0;margin-top:var(--s6)}
@media (max-width:1080px){.f3 ul{grid-template-columns:1fr 1fr}}
@media (max-width:820px){
  .f3 ul{grid-template-columns:1fr;grid-auto-rows:auto;gap:var(--s3)}
  .f3 .t{flex-direction:row;text-align:left;align-items:flex-start;padding:var(--s4)}
  .f3 .t .v{max-width:none;margin:4px 0 0}
  .f3 h2{margin-bottom:var(--s6)}
  .f1{grid-template-columns:1fr;gap:var(--s6)}
  .f1 ul{grid-template-columns:1fr;grid-auto-rows:auto;gap:var(--s3)}
  .f1 .t{min-height:0;padding:var(--s4)}
  .f2 .r{grid-template-columns:44px 1fr;row-gap:2px;align-items:start}
  .f2 .r .ico{grid-row:span 2;width:44px;height:44px}
  .f2 .k{font-size:15px}
  .fx .v{font-size:18px}
}
'''
m='''<div class="sheet-bar"><div class="wrap"><strong>Is Ensign right for you? · two options</strong> &nbsp; Same four facts, same order, every item the same size.</div></div>
<header class="site-head"><div class="wrap"><a class="logo" href="#" aria-label="Ensign home"><img src="%s" alt="Ensign"></a><nav class="nav" aria-label="Main"><a href="#">Services</a><a href="#">About Andrew</a><a href="#">Contact</a><a class="btn btn-ghost" href="#">Refer someone</a><button class="btn btn-ghost menu-btn">Menu</button></nav></div></header>
<main>
<section class="section" id="F1"><div class="wrap"><p class="opt-label">F1 · Tiles, question centred on the left</p><div class="fx"><div class="f1"><h2>Is Ensign right for you?</h2><div><ul>%s</ul>%s</div></div></div></div></section>
<section class="section" id="F3" style="padding-top:0"><div class="wrap"><p class="opt-label">F3 · Question centred, four tiles in a row</p><div class="fx f3"><h2>Is Ensign right for you?</h2><ul>%s</ul>%s</div></div></section>
</main>'''%(logo,tiles,note,tiles,note)
html='<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Ensign Fit Facts</title><link rel="icon" href="%s"><style>@font-face{font-family:"Figtree";src:url(data:font/woff2;base64,%s) format("woff2");font-weight:300 900}'%(fav,fig)+tokens+phone_rules+extra.replace('.js .fact','.js .nofact')+css+'</style></head><body>'+m+'</body></html>'
open("ensign-fit-facts.html","w").write(html); print(len(html))
