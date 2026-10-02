g={}; exec(open('build_home.py').read(),g)
body_home=g['body']; S=g['S']; arrow=g['arrow']; form=g['form']; P=g['P']
header=body_home[:body_home.index('<main id="main">')].replace('<a href="#">Contact</a>','<a href="#" aria-current="page">Contact</a>')
footer=body_home[body_home.index('</main>')+7:]
form2=form.replace('<p class="meta">','<p class="notice-s">We use these details to reply to you. Please don\'t include health information here. <a href="#">Use the referral form</a> instead. See our <a href="#">Privacy Policy</a>.</p><p class="meta">')
I=dict(phone='<path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2"/>',mail='<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',clock='<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',lang='<path d="M4 5h10v8H8l-4 3z"/><path d="M14 9h6v8l-3-2h-6v-2"/>',heart='<path d="M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z"/>')
underline='<svg class="uline" viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true"><path d="M3 13 C 70 6, 160 4, 230 8 S 292 14, 297 7"/></svg>'
import base64,io
from PIL import Image
_im=Image.open('andrew-meet.jpg'); _im=_im.crop((0,0,_im.width,_im.width)).resize((160,160)); _b=io.BytesIO(); _im.save(_b,'JPEG',quality=80)
thumb='data:image/jpeg;base64,'+base64.b64encode(_b.getvalue()).decode()
main='''<main id="main">
<section class="ct"><div class="wrap">
  <h1>Talk to <span class="mk">Andrew%(ul)s</span></h1>
  <div class="ct-grid">
  <div class="ct-left">
    <p class="send-h">Call or email</p>
    <div class="bcard">
      <div class="bc-top">
        <img class="avatar" src="%(p2)s" alt="">
        <div><p class="bc-name">Andrew Manoba</p><p class="bc-role">Support coordinator · Ensign</p></div>
      </div>
      <ul class="bc-rows">
        <li><a href="tel:[PLACEHOLDER]"><span class="bi">%(i_phone)s</span><span><small>Phone</small><b>[PLACEHOLDER: phone]</b></span>%(arrow)s</a></li>
        <li><a href="mailto:[PLACEHOLDER]"><span class="bi">%(i_mail)s</span><span><small>Email</small><b>[PLACEHOLDER: email]</b></span>%(arrow)s</a></li>
        <li><div><span class="bi">%(i_clock)s</span><span><small>Hours</small><b>7am to 7pm, seven days</b></span></div></li>
      </ul>
      <p class="bc-foot">Replies within 1 business day</p>
    </div>
  </div>
  <div class="ct-right">
    <p class="or"><span>or</span></p>
    <p class="send-h">Send a message</p>
    
    %(form)s
  </div>
  </div>
</div></section>

<section class="help"><div class="wrap help-grid">
  <div class="h-card interp">
    <span class="h-ic">%(i_lang)s</span>
    <h2>Need an interpreter?</h2>
    <p>Call the Translating and Interpreting Service and ask them to call Andrew.</p>
    <a class="bignum" href="tel:131450"><small>TIS</small>131 450</a>
  </div>
  <div class="h-card crisis">
    <span class="h-ic">%(i_heart)s</span>
    <h2>Ensign is not a crisis service</h2>
    <p class="sub">If someone is in danger, call 000. For 24 hour crisis support, call <span class="nowrap">Lifeline on 13 11 14</span>.</p>
    <div class="nums">
      <a class="bignum" href="tel:000"><small>Emergency</small>000</a>
      <a class="bignum" href="tel:131114"><small>Lifeline</small><span class="nowrap">13 11 14</span></a>
    </div>
  </div>
</div></section>
</main>'''%dict(ul=underline,p2=thumb,form=form2,arrow=arrow,**{('i_'+k):S(v) for k,v in I.items()})
css='''
.nav a[aria-current="page"]{font-weight:600;text-decoration:underline;text-underline-offset:6px;text-decoration-thickness:2px;text-decoration-color:var(--accent)}
.ct{padding:var(--s7) 0 var(--s8)}
.ct-grid{display:grid;grid-template-columns:1fr 1fr;gap:var(--s5);align-items:stretch;margin-top:var(--s7)}
.ct-left,.ct-right{display:flex;flex-direction:column}
.ct-left .bcard,.ct-right .enq{flex:1}
.ct h1{font-size:clamp(44px,3.6vw + 18px,72px);white-space:nowrap;letter-spacing:var(--track-display);line-height:var(--lh-head)}
.mk{position:relative;white-space:nowrap}
.uline{position:absolute;left:-1%;bottom:-.14em;width:102%;height:.2em;overflow:visible}
.uline path{fill:none;stroke:#6993fa;stroke-width:9;stroke-linecap:round}
.bcard{background:var(--surface);border-radius:var(--r-lg);padding:var(--s6);box-shadow:0 1px 0 var(--line),0 24px 48px -32px rgba(35,31,25,.25);display:flex;flex-direction:column}
.bc-foot{margin-top:auto!important}

.bc-top{display:flex;align-items:center;gap:var(--s4);padding-bottom:var(--s5);border-bottom:2px dashed var(--line)}
.avatar{width:72px;height:72px;border-radius:50%;object-fit:cover;object-position:50% 20%;box-shadow:0 0 0 4px var(--indigo-100)}
.bc-name{font-size:24px;font-weight:600;margin:0;line-height:1.2}
.bc-role{font-size:15px;color:var(--muted);margin:2px 0 0}
.bc-rows{list-style:none;margin:var(--s3) 0 0;padding:0}
.bc-rows li>a,.bc-rows li>div{display:grid;grid-template-columns:44px 1fr 20px;gap:var(--s4);align-items:center;padding:var(--s3) var(--s2);margin:0 calc(var(--s2) * -1);border-radius:var(--r-sm);color:var(--text);text-decoration:none;transition:background-color 180ms ease}
.bc-rows li>div{grid-template-columns:44px 1fr}
@media (hover:hover) and (pointer:fine){.bc-rows li>a:hover{background:var(--indigo-50)}.bc-rows li>a:hover>svg{transform:translateX(3px)}}
.bc-rows li>a>svg{width:20px;height:20px;color:var(--accent);transition:transform 180ms var(--ease-out)}
.bi{width:44px;height:44px;border-radius:12px;background:var(--indigo-50);color:var(--accent);display:grid;place-items:center}
.bi svg{width:22px;height:22px}
.bc-rows small{display:block;font-size:14px;color:var(--muted)}
.bc-rows b{display:block;font-size:18px;font-weight:600;overflow-wrap:anywhere}
.bc-foot{margin:var(--s4) 0 0;padding-top:var(--s4);border-top:1px solid var(--line);font-size:15px;font-weight:600;color:var(--accent-strong)}
.ct-right .enq{max-width:none}
/* One fixed stage for the whole flow. Allen's rule: the box never changes size
   between questions, so nothing below it jumps. Sized to the tallest step and
   measured, not guessed. The steps sit at the bottom of the stage so the
   question line stays in the same place on every screen. */
.ct-right .enq{min-height:var(--ct-stage,700px);height:var(--ct-stage,700px);display:flex;flex-direction:column}
.ct-right .enq .enq-step{flex:1;display:flex;flex-direction:column;justify-content:flex-start}
@media (max-width:820px){
  /* Same compact controls as the home page flow, so the widget is one thing
     across the site and the fixed stage does not have to be taller than the
     phone screen. 48px keeps every control at the tap target. */
  .ct-right .enq .rows .row label,.ct-right .enq .other-btn{min-height:48px}
  .ct-right .enq .field input,.ct-right .enq .field textarea{min-height:48px}
  .ct-right .enq .actions .btn{min-height:48px}
  /* the four areas stay two across on the phone, same as the home flow.
     One column made this step 725px tall, taller than the phone screen. */
  .ct-right .enq .rows.two{grid-template-columns:1fr 1fr;column-gap:var(--s3)}
  .ct-right .enq{--ct-stage:670px}
}
.or{display:none}
.send-h{font-size:var(--t-h3);font-weight:500;margin:0 0 var(--s4)}
.enq{margin-top:0}
.notice-s{font-size:14px;color:var(--muted);margin:var(--s4) 0 0}
.help{padding:0 0 var(--section)}
.help-grid{display:grid;grid-template-columns:1fr 1fr;gap:var(--s5);align-items:stretch}
.h-card{border-radius:var(--r-lg);padding:var(--s6);display:flex;flex-direction:column;gap:var(--s3)}
.h-card h2{font-size:clamp(24px,1vw + 18px,32px);letter-spacing:-.015em}
.h-card p{margin:0}
.h-ic{width:52px;height:52px;border-radius:50%;display:grid;place-items:center;margin-bottom:var(--s2)}
.h-ic svg{width:26px;height:26px}
.interp{background:var(--indigo-50)}
.interp .h-ic{background:var(--surface);color:var(--accent)}
.crisis{background:var(--indigo-900);color:var(--n-0)}
.crisis h2{color:var(--n-0)}
.crisis .h-ic{background:rgba(160,189,254,.16);color:#a0bdfe}
.bignum{display:flex;flex-direction:column;gap:2px;text-decoration:none;font-size:clamp(34px,2.4vw + 18px,56px);font-weight:400;letter-spacing:-.03em;line-height:1.05;border-radius:var(--r-md);padding:var(--s4) var(--s5);transition:transform 180ms var(--ease-out),box-shadow 180ms ease}
.bignum small{font-size:15px;font-weight:600;letter-spacing:0}
.interp .bignum{background:var(--surface);color:var(--indigo-900)}
.interp .bignum small{color:var(--muted)}
.crisis .bignum{min-height:0;background:rgba(255,255,255,.08);color:var(--n-0);box-shadow:inset 0 0 0 1.5px rgba(160,189,254,.3)}
.crisis .bignum small{color:var(--indigo-200)}
.nums{display:grid;grid-template-columns:1fr 1fr;gap:var(--s3);margin-top:auto}
.interp .bignum{margin-top:auto}
.crisis .sub{color:var(--indigo-100)}
.nowrap{white-space:nowrap}
@media (hover:hover) and (pointer:fine){.bignum:hover{transform:translateY(-2px)}.crisis .bignum:hover{box-shadow:inset 0 0 0 2px #a0bdfe}}
.bignum:active{transform:scale(.98)}
@media (max-width:1080px){.help-grid{grid-template-columns:1fr}}
@media (max-width:820px){
  .ct{padding-top:var(--s4)}
  .ct-grid{grid-template-columns:1fr;gap:var(--s6)}
  .bcard{padding:var(--s5)}
  /* At 320 the name and role block refuses to shrink beside the avatar and
     pushes the whole card past the screen. */
  .ct-left,.ct-right,.bcard,.bc-top,.bc-top>*{min-width:0}
  .bc-top{flex-wrap:wrap}
  .or{display:flex;align-items:center;gap:var(--s3);color:var(--muted);margin:0 0 var(--s4)}
  .or::before,.or::after{content:"";flex:1;border-top:1px solid var(--line)}
  .h-card{padding:var(--s5)}
  .nums{grid-template-columns:1fr}
}
@media (prefers-reduced-motion:reduce){.bignum,.bc-rows li>a>svg{transition:none}}
'''
html=g['html']
head=html[:html.index('</style>')].replace('<title>Support Coordination and Recovery Coaching in South East Queensland | Ensign</title>','<title>Contact Andrew | Ensign Support Coordination</title>').replace('content="Andrew Manoba provides NDIS support coordination and psychosocial recovery coaching across South East Queensland. Taking new participants now. Replies within 1 business day."','content="Call or message Andrew Manoba at Ensign. Available 7am to 7pm, seven days. Replies within 1 business day."')
out=head+css+'</style></head><body>'+header+main+footer+'<script>'+open('enq.js').read()+'</script></body></html>'
open('ensign-contact.html','w').write(out); print(len(out))
