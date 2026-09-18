g={}; exec(open('build_home.py').read(),g)
body_home=g['body']; S=g['S']; arrow=g['arrow']
header=body_home[:body_home.index('<main id="main">')].replace('<a href="#">Services</a>','<a href="#" aria-current="page">Services</a>')
footer=body_home[body_home.index('</main>')+7:]
down=S('<path d="M12 5v14M6 13l6 6 6-6"/>')
ph=lambda t:'<span class="ph-note">PLACEHOLDER: %s</span>'%t
tick='<svg class="tick" viewBox="0 0 40 32" aria-hidden="true"><path pathLength="1" d="M4 17 C 8 20, 11 24, 14 27 C 20 17, 27 9, 37 4"/></svg>'
underline='<svg class="uline" viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M3 13 C 70 6, 160 4, 230 8 S 292 14, 297 7"/></svg>'
plan_rows=[('Reads your plan with you','So you both know what is funded',''),('Looks for providers with room','And talks the options through with you',''),('Sets up service agreements','And bookings',ph('Andrew to confirm')),('Writes a summary','Before each plan review','')]
sheet_rows=''.join('<li><span class="box">%s</span><div><p class="k">%s</p><p class="v">%s</p>%s</div></li>'%(tick,k,v,x) for k,v,x in plan_rows)
wave_pts=[('Starts with what you want',''),('Moves at your pace','Including through harder weeks'),('In person or by phone','Whichever suits you that day'),('Connects with your other supports','')]
wave_items=''.join('<li style="--i:%d"><span class="dot">%d</span><div><p class="k">%s</p>%s</div></li>'%(i,i+1,k,('<p class="v">%s</p>'%v) if v else '') for i,(k,v) in enumerate(wave_pts))
main='''<main id="main">
<section class="sv-hero"><div class="wrap">
  <div class="sv-intro">
    <h1>Two services, <span class="mk">one person%(underline)s</span></h1>
    <div><p class="lead">Both are funded from your NDIS plan. Your plan shows which one you have.</p>%(ph_cost)s</div>
  </div>
  <div class="paths">
    <a class="path-card a" href="#sc">
      <span class="num">01</span>
      <span class="t">Support coordination</span>
      <span class="fit">For help putting your plan into action</span>
      <span class="go">See what Andrew does %(down)s</span>
    </a>
    <a class="path-card b" href="#rc">
      <span class="num">02</span>
      <span class="t">Psychosocial recovery coaching</span>
      <span class="fit">For people living with psychosocial disability</span>
      <span class="go">See how it works %(down)s</span>
    </a>
  </div>
</div></section>

<section class="chapter" id="sc"><div class="wrap ch-grid">
  <div class="ch-text">
    <p class="ch-num">01</p>
    <h2>Support coordination</h2>
    <p class="scene-q">A plan on the fridge and a list of phone numbers that go to voicemail.</p>
    <p class="intro">Support coordination is hands-on help to put your plan into action. Andrew does the legwork with you.</p>
    <div class="week"><p class="lbl">A normal week</p>%(ph_week)s</div>
    <a class="btn btn-primary" href="#">Ask about support coordination %(arrow)s</a>
  </div>
  <div class="sheet-wrap">
    <div class="sheet" aria-label="What Andrew does">
      <span class="magnet" aria-hidden="true"></span>
      <div class="sheet-head"><p class="sh-t">What Andrew does</p><div class="bars" aria-hidden="true"><i style="width:70%%"></i><i style="width:45%%"></i></div></div>
      <ul class="sheet-list">%(sheet_rows)s</ul>
    </div>
  </div>
</div></section>

<section class="chapter alt" id="rc"><div class="wrap ch-grid rev">
  <div class="ch-text">
    <p class="ch-num">02</p>
    <h2>Psychosocial recovery coaching</h2>
    <p class="scene-q">A plan that has to work on the hard days too.</p>
    <p class="intro">Recovery coaching is for people living with psychosocial disability. Andrew works with you on what you want next and adjusts the plan with you as things change.</p>
    <div class="week"><p class="lbl">A normal week</p>%(ph_week)s</div>
    <a class="btn btn-primary" href="#">Ask about recovery coaching %(arrow)s</a>
  </div>
  <div class="wave-wrap">
    <div class="wave-card">
      <div class="wave-head"><p class="sh-t">How it works</p>%(ph_rc)s</div>
      <svg class="wave" viewBox="0 0 600 120" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M0 70 C 60 20, 110 20, 150 60 S 240 110, 300 64 S 390 18, 450 58 S 550 104, 600 50"/></svg>
      
      <ol class="wave-list">%(wave_items)s</ol>
    </div>
  </div>
</div></section>

<section class="terms"><div class="wrap">
  <h2 class="terms-h">How Andrew works</h2>
  <div class="tw">
    <div class="tw-card yes">
      <p class="tw-lbl"><span class="badge yes-b">%(ck)s</span>You can count on</p>
      <ul>
        <li><span class="ic">%(i_clock)s</span><div><b>Replies within 1 business day</b></div></li>
        <li><span class="ic">%(i_pin)s</span><div><b>Visits in person</b><span>for every participant he takes on</span></div></li>
        <li><span class="ic">%(i_time)s</span><div><b>Bills the actual time worked</b></div></li>
        <li><span class="ic">%(i_inv)s</span><div><b>Sends itemised invoices</b><span>to plan managers every time</span></div></li>
      </ul>
    </div>
    <div class="tw-card no">
      <p class="tw-lbl"><span class="badge no-b">%(x)s</span>Not part of Ensign</p>
      <ul>
        <li><span class="ic">%(i_no)s</span><div><b>Specialist support coordination</b></div></li>
        <li><span class="ic">%(i_no)s</span><div><b>Support work or personal care</b></div></li>
        <li><span class="ic">%(i_no)s</span><div><b>Crisis or emergency support</b></div></li>
        <li><span class="ic">%(i_no)s</span><div><b>After hours support</b></div></li>
      </ul>
      <p class="tw-crisis">Need crisis support now? Call <span class="nowrap">Lifeline on <a href="tel:131114">13 11 14</a></span>, or <a href="tel:000">000</a> in an emergency.</p>
    </div>
  </div>
</div></section>

<section class="section close" style="padding-top:0"><div class="wrap"><div class="close-card">
  <h2>Not sure which one you need?</h2>
  <p>Send Andrew a message with who it's for and where, and talk it through with him.</p>
  <div class="close-cta"><a class="btn btn-primary" href="#">Talk to Andrew %(arrow)s</a></div>
</div></div></section>
</main>'''%dict(underline=underline,ph_cost=ph('cost wording, confirm with Allen'),ph_week=ph('week to week description, Andrew to sign off'),ph_rc=ph('Andrew to confirm these four'),down=down,arrow=arrow,sheet_rows=sheet_rows,wave_items=wave_items,ck=S('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),x=S('<path d="M7 7l10 10M17 7 7 17"/>'),i_clock=S('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),i_pin=S('<path d="M12 21s-6.5-5.8-6.5-11a6.5 6.5 0 0113 0c0 5.2-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>'),i_time=S('<path d="M7 3h10M7 21h10M8 3c0 5 8 5 8 9s-8 4-8 9M16 3c0 5-8 5-8 9s8 4 8 9"/>'),i_inv=S('<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>'),i_no=S('<circle cx="12" cy="12" r="8.5"/><path d="M6 6l12 12"/>'))
css='''
.nav a[aria-current="page"]{font-weight:600;text-decoration:underline;text-underline-offset:6px;text-decoration-thickness:2px;text-decoration-color:var(--accent)}
.ph-note{display:inline-block;font-size:13px;font-weight:600;color:#8a5a00;background:#fff3d6;border-radius:6px;padding:2px 8px;margin-top:var(--s2)}
/* hero */
.sv-hero{padding:var(--s8) 0 var(--s9)}
.sv-intro{display:grid;grid-template-columns:7fr 5fr;gap:var(--s7);align-items:end}
.sv-intro h1{font-size:clamp(44px,5vw + 16px,96px);letter-spacing:var(--track-display);line-height:1}
.mk{position:relative;white-space:nowrap}
.uline{position:absolute;left:-1%;bottom:-.16em;width:102%;height:.24em;overflow:visible}
.uline path{fill:none;stroke:#6993fa;stroke-width:9;stroke-linecap:round;stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset 900ms var(--ease-out) 200ms}
.in .uline path,.uline.in path{stroke-dashoffset:0}
.sv-intro .lead{margin:0}
.paths{display:grid;grid-template-columns:1fr 1fr;gap:var(--s5);margin-top:var(--s8)}
.path-card{position:relative;display:flex;flex-direction:column;gap:var(--s3);min-height:300px;border-radius:var(--r-lg);padding:var(--s7) var(--s6) var(--s6);text-decoration:none;overflow:hidden;transition:transform 260ms var(--ease-out),box-shadow 260ms ease}
.path-card.a{background:var(--indigo-900);color:var(--n-0)}
.path-card.b{background:var(--indigo-100);color:var(--indigo-900)}
.path-card .num{font-size:clamp(64px,6vw,110px);font-weight:300;letter-spacing:-.05em;line-height:.8;opacity:.9}
.path-card.a .num{color:#a0bdfe}.path-card.b .num{color:var(--accent)}
.path-card .t{font-size:clamp(26px,1.4vw + 18px,38px);letter-spacing:-.02em;line-height:1.1;margin-top:auto}
.path-card .fit{font-size:18px;opacity:.85}
.path-card .go{display:inline-flex;align-items:center;gap:var(--s2);font-weight:600;margin-top:var(--s3)}
.path-card .go svg{width:20px;height:20px;transition:transform 220ms var(--ease-out)}
.path-card::after{content:"";position:absolute;right:-60px;top:-60px;width:220px;height:220px;border-radius:50%;border:2px solid currentColor;opacity:.12}
@media (hover:hover) and (pointer:fine){.path-card:hover{transform:translateY(-4px);box-shadow:0 24px 40px -24px rgba(15,34,94,.45)}.path-card:hover .go svg{transform:translateY(4px)}}
.path-card:active{transform:scale(.99)}
/* chapters */
.chapter{padding:var(--section) 0;scroll-margin-top:0}
.chapter.alt{background:var(--n-100)}
.ch-grid{display:grid;grid-template-columns:5fr 6fr;gap:var(--s9);align-items:center}
.ch-grid.rev{grid-template-columns:6fr 5fr}
.ch-grid.rev .ch-text{order:2}
.ch-num{font-size:15px;font-weight:600;letter-spacing:.12em;color:var(--accent);margin:0 0 var(--s3)}
.ch-text h2{font-size:clamp(36px,2.6vw + 20px,60px)}
.scene-q{font-size:clamp(20px,.7vw + 17px,26px);line-height:1.4;color:var(--indigo-900);margin:var(--s5) 0 0;padding-left:var(--s4);border-left:3px solid #6993fa;max-width:32ch}
.intro{margin-top:var(--s5);max-width:44ch}
.week{margin:var(--s5) 0 var(--s6)}
.lbl{font-size:15px;font-weight:600;color:var(--muted);margin:0}
/* plan sheet */
.sheet-wrap{position:relative;padding:var(--s5)}
.sheet-wrap::before{content:"";position:absolute;inset:var(--s7) 0 0 var(--s7);background:var(--indigo-100);border-radius:var(--r-lg);transform:rotate(3deg)}
.sheet{position:relative;background:var(--surface);border-radius:var(--r-md);padding:var(--s7) var(--s6) var(--s6);box-shadow:0 30px 60px -36px rgba(35,31,25,.4);transform:rotate(-1.5deg)}
.magnet{position:absolute;top:-14px;left:50%;width:30px;height:30px;margin-left:-15px;border-radius:50%;background:var(--accent);box-shadow:0 6px 10px -4px rgba(15,34,94,.5),inset -3px -4px 0 rgba(0,0,0,.15)}
.sheet-head{display:flex;justify-content:space-between;align-items:center;gap:var(--s4);padding-bottom:var(--s4);border-bottom:2px dashed var(--line);margin-bottom:var(--s3)}
.sh-t{font-size:20px;font-weight:600;margin:0}
.bars{flex:1;max-width:160px;display:grid;gap:6px}.bars i{display:block;height:8px;border-radius:4px;background:var(--n-100)}
.sheet-list{list-style:none;margin:0;padding:0}
.sheet-list li{display:grid;grid-template-columns:40px 1fr;gap:var(--s4);align-items:start;padding:var(--s4) 0;border-bottom:1px solid var(--line)}
.sheet-list li:last-child{border-bottom:0}
.box{width:34px;height:34px;border-radius:9px;box-shadow:inset 0 0 0 2px var(--field-line);position:relative;margin-top:2px}
.tick{position:absolute;left:2px;top:-6px;width:40px;height:32px;overflow:visible}
.tick path{fill:none;stroke:var(--accent);stroke-width:4.5;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset 420ms var(--ease-out)}
.sheet.in .tick path{stroke-dashoffset:0}
.sheet.in li:nth-child(2) .tick path{transition-delay:220ms}.sheet.in li:nth-child(3) .tick path{transition-delay:440ms}.sheet.in li:nth-child(4) .tick path{transition-delay:660ms}
.sheet-list .k{font-size:18px;font-weight:600;margin:0}
.sheet-list .v{font-size:16px;color:var(--muted);margin:2px 0 0}
/* wave */
.wave-card{background:var(--surface);border-radius:var(--r-lg);padding:var(--s6);box-shadow:0 30px 60px -40px rgba(35,31,25,.35)}
.wave-head{display:flex;justify-content:space-between;align-items:center;gap:var(--s3);flex-wrap:wrap}
.wave{display:block;width:100%;height:110px;margin-top:var(--s5);overflow:visible}
.wave path{fill:none;stroke:#6993fa;stroke-width:5;stroke-linecap:round;stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset 1400ms var(--ease-out)}
.wave-card.in .wave path{stroke-dashoffset:0}
.wave-labels{display:flex;justify-content:space-between;font-size:14px;color:var(--muted);margin-top:var(--s1)}
.wave-list{list-style:none;margin:var(--s5) 0 0;padding:0;display:grid;grid-template-columns:repeat(4,1fr);gap:var(--s4)}
.wave-list li{display:flex;flex-direction:column;gap:var(--s2);opacity:0;transform:translateY(8px);transition:opacity 360ms var(--ease-out),transform 360ms var(--ease-out);transition-delay:calc(var(--i) * 120ms + 500ms)}
.wave-card.in .wave-list li{opacity:1;transform:none}
.dot{width:36px;height:36px;border-radius:50%;background:var(--indigo-900);color:var(--n-0);display:grid;place-items:center;font-weight:600}
.wave-list .k{font-size:17px;font-weight:600;margin:0;line-height:1.3}
.wave-list .v{font-size:15px;color:var(--muted);margin:0}
/* terms */
.terms{padding:var(--section) 0 var(--s8)}
.terms-card{background:var(--indigo-900);color:var(--n-0);border-radius:var(--r-lg);padding:clamp(32px,5vw,72px)}
.terms-card h2{color:var(--n-0);margin-bottom:var(--s7)}
.big4{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(4,1fr);gap:0}
.big4 li{display:flex;flex-direction:column;gap:var(--s2);padding:0 var(--s5);border-left:1px solid rgba(160,189,254,.25)}
.big4 li:first-child{padding-left:0;border-left:0}
.big4 b{font-size:clamp(24px,1.2vw + 14px,34px);font-weight:400;letter-spacing:-.02em;line-height:1.05;color:#a0bdfe}
.big4 span{font-size:16px;color:var(--indigo-100);line-height:1.45}
/* limits */
.limits2{padding:0 0 var(--s8)}
.lim{display:flex;align-items:center;gap:var(--s5);flex-wrap:wrap;border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:var(--s5) 0}
.lim-h{font-weight:600;margin:0}
.lim ul{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:var(--s2)}
.lim li{font-size:15px;color:var(--muted);background:var(--n-100);border-radius:var(--r-pill);padding:6px 14px;display:inline-flex;align-items:center;gap:6px}
.lim li::before{content:"";width:14px;height:14px;border-radius:50%;border:1.5px solid currentColor;background:linear-gradient(45deg,transparent 45%,currentColor 45%,currentColor 55%,transparent 55%)}
.lim-c{margin:0 0 0 auto;font-size:15px}
@media (max-width:1080px){.big4{grid-template-columns:1fr 1fr;gap:var(--s6) 0}.big4 li:nth-child(3){padding-left:0;border-left:0}.wave-list{grid-template-columns:1fr 1fr}}
@media (max-width:820px){
  .sv-hero{padding:var(--s5) 0 var(--s7)}
  .sv-intro{grid-template-columns:1fr;gap:var(--s4)}
  .paths{grid-template-columns:1fr;gap:var(--s3);margin-top:var(--s6)}
  .path-card{min-height:220px;padding:var(--s6) var(--s5) var(--s5)}
  .ch-grid,.ch-grid.rev{grid-template-columns:1fr;gap:var(--s7)}
  .ch-grid.rev .ch-text{order:0}
  .chapter .btn{width:100%}
  .sheet{padding:var(--s6) var(--s4) var(--s4)}
  .sheet-wrap{padding:var(--s3) var(--s2)}
  .wave-card{padding:var(--s5) var(--s4)}
  .wave-list{grid-template-columns:1fr;gap:var(--s3)}
  .wave-list li{display:grid;grid-template-columns:36px 1fr;gap:var(--s3);align-items:start}
  .wave-list .k{margin-top:6px}
  .path-card .t{margin-top:var(--s4)}
  .big4{grid-template-columns:1fr}.big4 li{padding:0 0 var(--s4)!important;border-left:0!important;border-bottom:1px solid rgba(160,189,254,.25)}
  .lim-c{margin-left:0}
}
@media (prefers-reduced-motion:reduce){.uline path,.tick path,.wave path,.wave-list li{transition:none!important;stroke-dashoffset:0!important;opacity:1!important;transform:none!important}}
'''
css+='\n/* terms v2: count on vs not part of */\n.terms{padding:var(--section) 0}\n.terms-h{text-align:center;margin-bottom:var(--s7)}\n.tw{display:grid;grid-template-columns:1fr 1fr;gap:var(--s5);align-items:stretch}\n.tw-card{border-radius:var(--r-lg);padding:var(--s6);display:flex;flex-direction:column}\n.tw-card.yes{background:var(--indigo-900);color:var(--n-0)}\n.tw-card.no{background:var(--surface);box-shadow:inset 0 0 0 1px var(--line)}\n.tw-lbl{display:flex;align-items:center;gap:var(--s3);font-size:20px;font-weight:600;margin:0 0 var(--s4)}\n.badge{width:36px;height:36px;border-radius:50%;display:grid;place-items:center;flex:none}\n.badge svg{width:20px;height:20px}\n.yes-b{background:#a0bdfe;color:var(--indigo-900)}\n.no-b{background:var(--n-100);color:var(--muted)}\n.tw-card ul{list-style:none;margin:0;padding:0}\n.tw-card li{display:grid;grid-template-columns:44px 1fr;gap:var(--s4);align-items:center;padding:var(--s4) 0;border-top:1px solid rgba(160,189,254,.22)}\n.tw-card.no li{border-top-color:var(--line)}\n.tw-card .ic{width:44px;height:44px;border-radius:12px;display:grid;place-items:center}\n.tw-card.yes .ic{background:rgba(160,189,254,.14);color:#a0bdfe}\n.tw-card.no .ic{background:var(--n-100);color:var(--muted)}\n.tw-card .ic svg{width:24px;height:24px}\n.tw-card b{display:block;font-size:18px;font-weight:600;line-height:1.35}\n.tw-card.no b{font-weight:500;color:var(--text)}\n.tw-card li span:not(.ic){display:block;font-size:15px;line-height:1.4;margin-top:2px}\n.tw-card.yes li span:not(.ic){color:var(--indigo-200)}\n.tw-crisis{margin:auto 0 0;padding-top:var(--s4);border-top:1px solid var(--line);font-size:16px;color:var(--muted);max-width:none}\n@media (max-width:820px){.tw{grid-template-columns:1fr;gap:var(--s4)}.tw-card{padding:var(--s5)}.terms-h{text-align:left;margin-bottom:var(--s5)}.tw-crisis{margin-top:var(--s3)}}\n'
js='''(function(){var els=document.querySelectorAll('.sheet,.wave-card,.uline');if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in')});return;}var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}})},{rootMargin:'0px 0px -20% 0px'});els.forEach(function(e){io.observe(e)});})();'''
html=g['html']; head=html[:html.index('</style>')]
head=head.replace('<title>Support Coordination and Recovery Coaching in South East Queensland | Ensign</title>','<title>NDIS Support Coordination and Psychosocial Recovery Coaching | Ensign</title>').replace('content="Andrew Manoba provides NDIS support coordination and psychosocial recovery coaching across South East Queensland. Taking new participants now. Replies within 1 business day."','content="What support coordination and psychosocial recovery coaching involve with Andrew Manoba, for self managed and plan managed NDIS participants across South East Queensland."')
out=head+css+'</style></head><body>'+header+main+footer+'<script>'+js+'</script></body></html>'
open('ensign-services.html','w').write(out); print(len(out))
