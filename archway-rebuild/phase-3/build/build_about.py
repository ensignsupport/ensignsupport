g={}; exec(open('build_home.py').read(),g)
body_home=g['body']; S=g['S']; arrow=g['arrow']; P=g['P']
header=body_home[:body_home.index('<main id="main">')].replace('<a href="#">About Andrew</a>','<a href="#" aria-current="page">About Andrew</a>')
footer=body_home[body_home.index('</main>')+7:]
photo=P['pt'](P['p2'],"Andrew Manoba standing by a window, smiling, in a navy blazer","Support coordinator")
ph=lambda t:'<span class="ph-note">PLACEHOLDER: %s</span>'%t
I=dict(
 home='<path d="M4 11 12 4l8 7"/><path d="M6 10v10h12V10"/><path d="M10 20v-5h4v5"/>',
 reply='<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5"/>',
 honest='<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
 voice='<path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16.5 8.5a5 5 0 010 7M19 6a8.5 8.5 0 010 12"/>',
 cap='<path d="M2.5 9.5 12 5l9.5 4.5L12 14z"/><path d="M6.5 11.5V16c1.5 1.6 3.5 2.5 5.5 2.5s4-.9 5.5-2.5v-4.5"/>',
 shield='<path d="M12 3 4.5 6v5.5c0 4.5 3.2 8 7.5 9.5 4.3-1.5 7.5-5 7.5-9.5V6z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
 lang='<path d="M4 5h10v8H8l-4 3z"/><path d="M14 9h6v8l-3-2h-6v-2"/>',
 umb='<path d="M3 12a9 9 0 0118 0z"/><path d="M12 12v6a2 2 0 004 0"/>')
note_rows=[('home','I come to you.','First meeting in your first week, in person.'),('reply','I reply.','Within 1 business day, 7am to 7pm, seven days.'),('honest','I keep it honest.','Actual time billed and itemised invoices.'),('voice','I speak up for you','with providers.')]
note=''.join('<li><span class="n-ic">%s</span><p><b>%s</b> %s</p></li>'%(S(I[i]),k,v) for i,k,v in note_rows)
checks=['NDIS Worker Screening Check','Blue Card','Police Check','Mental Health First Aid','First Aid and CPR']
stamps=''.join('<li class="stamp"><span>%s</span>%s</li>'%(S(I['shield']),c) for c in checks)
main='''<main id="main">
<section class="ab-hero"><div class="wrap ab-grid">
  <div class="ab-text">
    <p class="hello">Hi, I'm</p>
    <h1><span class="mk">Andrew.<svg class="uline in" viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M3 13 C 70 6, 160 4, 230 8 S 292 14, 297 7"/></svg></span></h1>
    <p class="lead">I coordinate NDIS supports and provide recovery coaching for people across South East Queensland. When you contact Ensign, you speak to me.</p>
    <div class="sig">%(ph_sig)s</div>
  </div>
  <div class="ab-photo">%(photo)s</div>
</div></section>

<section class="section ab-note-sec"><div class="wrap note-grid">
  <div class="note-intro"><h2>What working <span class="nobr">with <span class="mk">me<svg class="uline" viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M3 13 C 70 6, 160 4, 230 8 S 292 14, 297 7"/></svg></span></span> <span class="nobr">looks like</span></h2></div>
  <div class="note">
    <span class="tape" aria-hidden="true"></span>
    <ol>%(note)s</ol>
    <p class="note-sign">Andrew</p>
  </div>
</div></section>

<section class="section bg"><div class="wrap">
  <h2 class="bg-h">Background</h2>
  <div class="bento">
    <div class="b years"><p class="big">7+</p><p class="cap">years in disability and mental health</p></div>
    <div class="b roles">
      <p class="lbl">Roles</p>
      <ol class="road">
        <li class="now"><b>Support coordinator and social worker</b></li>
        <li><b>Disability clinician</b><span>Earlier</span></li>
      </ol>
    </div>
    <div class="b quals">
      <span class="bi">%(i_cap)s</span>
      <p class="lbl">Qualifications</p>
      <p class="q">Bachelor of Social Work</p><p class="q">Master of Social Work</p>
      <p class="uni">The University of Queensland</p>
    </div>
    <div class="b lang">
      <p class="lbl">Languages</p>
      <p class="tongues"><span>English</span><span lang="ta">தமிழ்</span></p>
      <p class="cap">English and Tamil. Trained to work with culturally and linguistically diverse communities, and interpreters are arranged when you need one.</p>
    </div>
    <div class="b checks">
      <p class="lbl">Checks</p>
      <ul class="stamps">%(stamps)s</ul>
      <p class="ins">%(i_umb)s Public liability insurance</p>
    </div>
  </div>
</div></section>

<section class="section close" style="padding-top:0"><div class="wrap"><div class="close-card">
  <h2>Want to talk it through?</h2>
  <div class="close-cta"><a class="btn btn-primary" href="#">Talk to Andrew %(arrow)s</a></div>
</div></div></section>
</main>'''%dict(ph_sig=ph("Andrew's handwritten signature"),photo=photo,note=note,stamps=stamps,i_cap=S(I['cap']),i_umb=S(I['umb']),arrow=arrow)
css='''
.nav a[aria-current="page"]{font-weight:600;text-decoration:underline;text-underline-offset:6px;text-decoration-thickness:2px;text-decoration-color:var(--accent)}
.ph-note{display:inline-block;font-size:13px;font-weight:600;color:#8a5a00;background:#fff3d6;border-radius:6px;padding:2px 8px}
.ab-hero{padding:var(--s7) 0 var(--section)}
.ab-grid{display:grid;grid-template-columns:7fr 5fr;gap:var(--s8);align-items:center}
.hello{font-size:clamp(28px,2vw + 16px,44px);letter-spacing:-.02em;color:var(--muted);margin:0}
.ab-text h1{font-size:clamp(64px,8vw + 20px,168px);letter-spacing:-.05em;line-height:.95}
.mk{position:relative;white-space:nowrap}
.uline{position:absolute;left:-1%;bottom:-.12em;width:102%;height:.16em;overflow:visible}
.uline path{fill:none;stroke:#6993fa;stroke-width:9;stroke-linecap:round}
.ab-text .lead{margin-top:var(--s6);max-width:36ch}
.sig{margin-top:var(--s6);min-height:40px;display:flex;align-items:center}
.ab-photo .pt{margin-left:auto;max-width:420px}
/* note */
.ab-note-sec{background:var(--n-100)}
.note-grid{display:grid;grid-template-columns:5fr 7fr;gap:var(--s8);align-items:center}
.note-intro h2{font-size:clamp(36px,2.6vw + 18px,60px);line-height:1.1;max-width:none;text-wrap:balance}
.nobr{white-space:nowrap}
.ni-eyebrow{font-size:15px;font-weight:600;color:var(--accent);margin:0 0 var(--s3)}
.note-intro .uline{height:.14em;bottom:-.1em}
.note{position:relative;background:#fffdf7;border-radius:6px;padding:var(--s8) var(--s7) var(--s6);box-shadow:0 30px 60px -36px rgba(35,31,25,.45);transform:rotate(-1deg)}
.tape{position:absolute;top:-14px;left:50%;width:120px;height:30px;margin-left:-60px;background:rgba(160,189,254,.55);transform:rotate(-3deg);border-radius:3px}
.note ol{list-style:none;margin:0;padding:0}
.note li{display:grid;grid-template-columns:44px 1fr;gap:var(--s4);align-items:center;min-height:96px}
.n-ic{width:44px;height:44px;border-radius:50%;background:var(--indigo-900);color:var(--n-0);display:grid;place-items:center}
.n-ic svg{width:22px;height:22px}
.note li p{margin:0;font-size:clamp(19px,.6vw + 16px,23px);line-height:1.45}
.note li b{font-weight:600;color:var(--indigo-900)}
.note-sign{margin:var(--s4) 0 0;text-align:right;font-size:26px;font-style:italic;color:var(--accent);letter-spacing:.01em}
/* bento */
.bg-h{margin-bottom:var(--s6)}
.bento{display:grid;grid-template-columns:repeat(12,1fr);gap:var(--s4)}
.b{border-radius:var(--r-lg);padding:var(--s6);background:var(--surface);box-shadow:0 1px 0 var(--line);display:flex;flex-direction:column}
.lbl{font-size:15px;font-weight:600;color:var(--muted);margin:0 0 var(--s3)}
.years{grid-column:span 4;background:var(--indigo-900);color:var(--n-0);justify-content:flex-end;min-height:280px}
.years .big{font-size:clamp(96px,9vw,150px);font-weight:300;letter-spacing:-.06em;line-height:.85;color:#a0bdfe;margin:0}
.years .cap{font-size:20px;margin:var(--s3) 0 0;max-width:16ch}
.roles{grid-column:span 4}
.road{list-style:none;margin:var(--s2) 0 0;padding:0 0 0 28px;position:relative;display:grid;gap:var(--s6)}
.road::before{content:"";position:absolute;left:8px;top:10px;bottom:10px;border-left:2px dashed var(--indigo-300)}
.road li{position:relative}
.road li::before{content:"";position:absolute;left:-26px;top:6px;width:16px;height:16px;border-radius:50%;background:var(--surface);box-shadow:inset 0 0 0 2px var(--indigo-300)}
.road li.now::before{background:var(--accent);box-shadow:0 0 0 5px var(--indigo-100)}
.road b{display:block;font-size:20px;font-weight:600;line-height:1.3}
.road span{font-size:15px;color:var(--muted)}
.quals{grid-column:span 4;position:relative;background:var(--indigo-50)}
.quals .bi{width:48px;height:48px;border-radius:14px;background:var(--surface);color:var(--accent);display:grid;place-items:center;margin-bottom:var(--s4)}
.quals .bi svg{width:26px;height:26px}
.quals .q{font-size:22px;letter-spacing:-.01em;line-height:1.25;margin:0 0 var(--s1)}
.quals .uni{margin:auto 0 0;padding-top:var(--s4);font-size:16px;color:var(--muted)}
.lang{grid-column:span 5}
.tongues{display:flex;gap:var(--s5);align-items:baseline;flex-wrap:wrap;margin:0 0 var(--s3)}
.tongues span{font-size:clamp(34px,2.4vw + 18px,54px);letter-spacing:-.02em;line-height:1.1}
.tongues span[lang="ta"]{color:var(--accent);font-family:"Noto Sans Tamil","Latha","Tamil Sangam MN",system-ui,sans-serif}
.lang .cap{font-size:16px;color:var(--muted);margin:auto 0 0}
.checks{grid-column:span 7}
.stamps{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:var(--s3)}
.stamp{display:inline-flex;align-items:center;gap:var(--s2);font-size:16px;font-weight:500;border-radius:var(--r-pill);padding:var(--s2) var(--s4) var(--s2) var(--s2);box-shadow:inset 0 0 0 1.5px var(--indigo-200);background:var(--surface)}
.stamp span{width:30px;height:30px;border-radius:50%;background:var(--indigo-50);color:var(--accent);display:grid;place-items:center}
.stamp svg{width:18px;height:18px}
.ins{display:flex;align-items:center;gap:var(--s2);margin:auto 0 0;padding-top:var(--s5);font-size:16px;color:var(--muted)}
.ins svg{width:20px;height:20px;color:var(--accent)}
@media (max-width:1080px){.years,.roles,.quals{grid-column:span 6}.quals{grid-column:span 12}.lang,.checks{grid-column:span 12}}
@media (max-width:820px){
  .ab-hero{padding:var(--s4) 0 var(--s7)}
  .ab-grid{grid-template-columns:1fr;gap:var(--s6)}
  .ab-photo{order:-1}.ab-photo .pt{max-width:260px;margin:0 auto}
  .note-grid{grid-template-columns:1fr;gap:var(--s5)}
  .note{padding:var(--s7) var(--s4) var(--s5);transform:none}
  .note li{min-height:84px;grid-template-columns:40px 1fr;gap:var(--s3)}
  .bento{grid-template-columns:1fr}
  .years,.roles,.quals,.lang,.checks{grid-column:auto}
  .years{min-height:200px}
  .close-cta .btn{width:100%}
}
'''
html=g['html']; head=html[:html.index('</style>')]
head=head.replace('<title>Support Coordination and Recovery Coaching in South East Queensland | Ensign</title>','<title>About Andrew Manoba, Support Coordinator | Ensign</title>').replace('content="Andrew Manoba provides NDIS support coordination and psychosocial recovery coaching across South East Queensland. Taking new participants now. Replies within 1 business day."','content="Andrew Manoba has 7+ years in disability and mental health and holds a Bachelor and Master of Social Work. He speaks English and Tamil."')
out=head+css+'</style></head><body>'+header+main+footer+'</body></html>'
open('ensign-about.html','w').write(out); print(len(out))
