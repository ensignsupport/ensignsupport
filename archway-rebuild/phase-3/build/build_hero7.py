# Home hero, rebuilt to the reference Allen supplied (Sevora), measured not eyeballed.
# Reference at 1199px viewport: panel 988x474 (aspect 2.08), uniform padding 82px
# (8.3% of panel width), text column ~35% of panel width, photo zone ~44% bleeding
# off the panel top and right edge, stat row last, above the panel floor.
import base64, sys
ARR = (sys.argv[1] if len(sys.argv)>1 else 'A').upper()   # A = card over photo, B = card beside photo

src=open('ensign-home.html').read()
a=src.index('<section class="home-hero">')
b=src.index('</div></section>',a)+len('</div></section>')
hero=src[a:b]
fs=hero.index('<form id="enq"'); fe=hero.index('</form>')+7; form=hero[fs:fe]
i=hero.index('<p class="status">'); status=hero[i:hero.index('</p>',i)+4]

# the four credentials move out of their own section and into the panel floor
ts=src.index('<section class="trust"'); te=src.index('</section>',ts)+len('</section>')
trust_sec=src[ts:te]
creds=trust_sec[trust_sec.index('<ul>'):trust_sec.index('</ul>')+5]

photo="data:image/webp;base64,"+base64.b64encode(open("andrew-hero.webp","rb").read()).decode()
brush=open("brush_bg_soft.svg").read()
mask=open("brush_mask_soft.txt").read().strip()

markup='''<section class="home-hero v7"><div class="wrap"><div class="panel">
  <div class="top">
    <figure class="pt shot">%s<div class="photo"><img src="%s" alt="Andrew Manoba, smiling, in a suit"></div>
      <figcaption class="card"><strong>Hi, I&#8217;m Andrew <span class="wave" aria-hidden="true">&#128075;</span></strong><span>Support coordinator</span></figcaption></figure>
    <div class="pcol">
%s
      <h1>One coordinator<br><span class="soft">you know <span class="mark-wrap">by name.<svg class="ink" viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M2 8 C 22 4, 48 3, 70 5 S 94 9, 98 5"/></svg></span></span></h1>
      <p class="lead">Andrew reads your NDIS plan with you and comes to you in person.</p>
      <div class="cta">
        <a class="btn btn-primary call" href="tel:[PLACEHOLDER]">Call Andrew</a>
        <a class="btn btn-ghost" href="#">Submit a referral</a>
      </div>
      <div class="formcard">%s</div>
    </div>
  </div>
  <div class="hcreds">%s</div>
</div></div></section>'''%(brush,photo,status,form,creds)

css='''
.v7{padding:var(--s3) 0 var(--s4);position:relative;overflow:hidden}
.v7 .panel{--pad:clamp(26px,4.4vw,72px);
  position:relative;border-radius:0;padding:0;
  background:none;box-shadow:none}
.v7 .top{position:relative;padding:0;
  display:grid;align-items:center;column-gap:clamp(18px,2vw,34px)}

/* Andrew's portrait in its brush-stroke frame (the Component 2 treatment) */
.v7 .pt{grid-column:2;grid-row:1;position:relative;margin:0;justify-self:center;align-self:center;
  width:100%;max-width:400px;aspect-ratio:4/5;--tilt:-2deg;z-index:1}
.v7 .pt .brush-bg{position:absolute;inset:-3% -4% -3% -3%;width:107%;height:106%;
  fill:var(--indigo-200);transform:rotate(3deg);transition:transform 420ms var(--ease-out)}
.v7 .pt .photo{position:absolute;inset:0;transform:rotate(var(--tilt));
  transition:transform 420ms var(--ease-out)}
.v7 .pt img{width:100%;height:100%;object-fit:cover;object-position:54% 16%;display:block;
  -webkit-mask:var(--mask) center/100% 100% no-repeat;mask:var(--mask) center/100% 100% no-repeat}
/* a warm hello, sized in % of the photo so it scales with it (C45) */
.v7 .pt .card{position:absolute;right:-7%;left:auto;bottom:7%;z-index:5;
  background:var(--n-0);border-radius:16px;padding:10px 18px 12px;
  box-shadow:0 16px 34px -18px rgba(35,31,25,.45),0 0 0 1px rgba(35,31,25,.04);
  transform:rotate(-2deg);transition:transform 420ms var(--ease-out)}
.v7 .pt .card strong{display:block;font-weight:600;font-size:17px;line-height:1.25;color:var(--text)}
.v7 .pt .card .wave{display:inline;font-size:18px;line-height:1}
.v7 .pt .card > span{display:block;font-size:14px;line-height:1.3;color:var(--muted);margin-top:1px}
@media (hover:hover) and (pointer:fine){
  .v7 .pt:hover .photo{transform:rotate(0deg)}
  .v7 .pt:hover .brush-bg{transform:rotate(1deg) scale(1.01)}
  .v7 .pt:hover .card{transform:rotate(0deg) translateY(-3px)}
}
@media (max-width:1000px){ .v7 .pt .card{right:-5%;left:auto;padding:8px 14px 10px}
  .v7 .pt .card strong{font-size:15px} .v7 .pt .card > span{font-size:13px} }
@media (prefers-reduced-motion:reduce){.v7 .pt .photo,.v7 .pt .brush-bg,.v7 .pt .card{transition:none}}

.v7 .pcol{grid-column:1;grid-row:1;position:relative;z-index:3;display:grid;align-content:start;justify-items:start;
  gap:16px;padding:0}
/* Every child gets an explicit order. The superseded hero 6 sheet still
   carries .home-hero order rules that were deciding three of these five,
   which put the buttons above the headline on a phone. */
.v7 .pcol>.status{order:1}
.v7 .pcol>h1{order:2}
.v7 .pcol>.lead{order:3}
.v7 .pcol>.cta{order:4}
.v7 .pcol>.formcard{order:5}
.v7 .pcol .lead{margin-top:0}
.v7 .cta{margin-top:var(--s2)}
.v7 .formcard{margin-top:18px}
.v7 h1{font-size:clamp(34px,2.5vw + 14px,50px);line-height:1.06;margin:0;letter-spacing:-.015em}
.v7 h1 .soft{color:inherit}
/* the hand-drawn underline, kept clear of the y descender in "by" (C46) */
.v7 h1 .mark-wrap{position:relative;display:inline-block}
.v7 h1 .ink{position:absolute;left:-1%;bottom:-14px;width:102%;height:12px;overflow:visible;pointer-events:none}
.v7 h1 .ink path{fill:none;stroke:var(--accent);stroke-width:3.2;stroke-linecap:round}
.v7 .lead{margin:0;max-width:34ch;color:var(--muted);font-size:19px;line-height:1.55}
.v7 .status{margin:0;justify-self:start;padding:6px 14px;font-size:14px}
.v7 .cta{display:flex;flex-wrap:wrap;gap:var(--s3);margin-top:18px}
.v7 .cta .btn{min-height:48px;padding:0 var(--s5);font-size:16px}

/* credentials, four across, as the panel floor */
.v7 .hcreds{position:relative;z-index:3;padding:0}
.v7 .hcreds ul{list-style:none;margin:0;padding:var(--s3) 0 0;display:grid;
  grid-template-columns:repeat(4,1fr);gap:var(--s5);border-top:1px solid var(--line)}
.v7 .hcreds li{display:grid;grid-template-columns:22px 1fr;gap:10px;align-items:start;
  font-size:14px;line-height:1.35}
.v7 .hcreds svg{width:21px;height:21px;color:var(--accent)}
.v7 .hcreds b{font-weight:600}

/* the enquiry card, the reference's overlapping card made useful */
/* no card: the questions and buttons sit straight on the page background (C48) */
/* fixed box so nothing jumps, but the form hugs the BOTTOM of it:
   the slack now sits above the progress bar, not under the buttons */
.v7 .formcard{position:relative;z-index:4;width:100%;background:none;
  border-radius:0;padding:0;box-shadow:none;
  min-height:var(--stage-h,280px);padding-bottom:16px;box-sizing:border-box;
  display:flex;flex-direction:column}
/* The form fills the fixed stage, so the progress bar and the question line
   sit in exactly the same place on every step. Bottom aligning the form made
   the box constant but slid the question up and down inside it by 100px. */
.v7 .formcard .enq{flex:1;display:flex;flex-direction:column}
.v7 .formcard .enq .enq-step{flex:1;display:flex;flex-direction:column;justify-content:flex-end}
.v7 .formcard .enq{background:transparent;box-shadow:none;padding:0;max-width:none;margin:0;
  display:flex;flex-direction:column;min-height:0}
.v7 .formcard .enq-top{flex:none}
.v7 .formcard .enq-step:not([hidden]){margin-top:0;margin-bottom:0}
.v7 .enq .meta{display:none}
.v7 .enq-q{font-size:16px;padding-bottom:8px}
.v7 .enq-top{margin-bottom:12px;display:flex;align-items:center;justify-content:space-between;gap:12px}
.v7 .enq-progress{display:block;width:170px;height:5px;border-radius:999px;
  background:var(--n-200,#e3e0da);overflow:hidden;flex:none}
.v7 .enq-progress .bar{display:block;height:100%;width:8%;border-radius:999px;
  max-width:none;min-width:0;flex:none;position:static;
  background:var(--accent);transition:width 420ms var(--ease-out)}
.v7 .enq-progress .bar::after{display:none}
@media (prefers-reduced-motion:reduce){.v7 .enq-progress .bar{transition:none}}
/* the visible counter is gone, screen readers still get it from #enq-live */
.v7 .enq-count{display:none}
.v7 .rows{display:grid;gap:5px}
.v7 .rows.two{grid-template-columns:1fr 1fr;column-gap:5px}
.v7 .row{border-bottom:0}
.v7 .row label,.v7 .other-btn{min-height:44px;padding:0 9px 0 12px;background:var(--n-0);
  border-radius:10px;box-shadow:0 1px 2px rgba(35,31,25,.07),0 8px 18px -16px rgba(35,31,25,.55);
  justify-content:space-between}
.v7 .other-slot{margin-top:5px}
/* the two-column area rows carry a 56px rule from the component sheet: match the rest */
.v7 .rows.two .row label{min-height:44px;padding:0 9px 0 12px}
.v7 .other-field input{min-height:44px;height:44px;border-radius:10px;box-sizing:border-box;padding:0 12px;max-width:340px}
.v7 .row .txt,.v7 .other-btn{font-size:14px;font-weight:600}
.v7 .row .arrow,.v7 .other-btn .arrow{display:grid;width:22px;height:22px;border-radius:50%;
  background:transparent;box-shadow:none;color:var(--muted);transform:none}
.v7 .row .arrow svg,.v7 .other-btn .arrow svg{width:15px;height:15px}
.v7 .where-pick{gap:5px}
/* plain boxed fields, same shape as the choice rows, no big underline gap */
.v7 .fields{gap:8px;margin-top:0;max-width:340px}
.v7 .fields.two{max-width:500px}
.v7 .field label{font-size:13px;margin-bottom:3px}
.v7 .field input,.v7 .field textarea{min-height:44px;font-size:15px;padding:0 12px;
  background:var(--n-0);border:0;border-bottom:0;border-radius:10px;
  box-shadow:0 1px 2px rgba(35,31,25,.07),inset 0 0 0 1.5px var(--field-line)}
.v7 .field textarea{min-height:56px;padding:9px 12px;line-height:1.45}
.v7 .field input:focus,.v7 .field textarea:focus{outline:none;
  box-shadow:inset 0 0 0 2px var(--accent)}
.v7 .field[data-invalid] input,.v7 .field[data-invalid] textarea{
  box-shadow:inset 0 0 0 2px #a3261b}
.v7 .field .help,.v7 .field .err{font-size:12px;margin-top:3px}
.v7 .actions{margin-top:8px;align-items:center}
/* a smaller Next / Send button, in proportion with the rows */
.v7 .actions .btn{min-height:44px;min-width:44px;padding:0 18px;font-size:15px;border-radius:999px}
.v7 .actions .btn svg{width:15px;height:15px}
.v7 .actions .back{font-size:14px}
/* the placeholder tag rides in the actions row, so it adds no height and hits nothing */
.v7 .enq .actions .ph{margin:0 0 0 auto;font-size:11px;padding:1px 6px;line-height:1.5}
/* the recap chips stay compact so the last step matches the others */
/* the answers-so-far chips sit above the question */
.v7 .enq-step[data-step="4"] .enq-q{margin:0}
.v7 .enq .recap{margin:0 0 8px;gap:6px}
.v7 .enq .recap button{font-size:13px;padding:3px 10px;gap:5px;min-height:44px}
.v7 .enq .recap button svg{width:12px;height:12px}
.v7 .enq .help{font-size:12px;margin-top:4px}
.v7 .enq .done .tick{width:36px;height:36px}
.v7 .enq .done h2{font-size:17px;margin:8px 0 4px}
.v7 .enq .done p{font-size:14px}
.v7 .enq .done .again{margin-top:10px}
.v7 .enq .done .actions{margin-top:8px}
@media (hover:hover) and (pointer:fine){
  .v7 .row label:hover,.v7 .other-btn:hover{transform:translateY(-2px);
    box-shadow:0 0 0 2px var(--accent),0 14px 26px -18px rgba(35,31,25,.55)}
}
.v7 .row input:checked+label{box-shadow:0 0 0 2.5px var(--accent),0 14px 26px -18px rgba(35,31,25,.55)}

/*__ARRANGEMENT__*/

@media (max-width:1180px){
  .v7 .hcreds li{font-size:14px}
  .v7 .hcreds ul{gap:var(--s4)}
}
/* the card is narrower here, so text wraps more: one taller fixed size, still one size */
@media (max-width:1100px){ .v7 .formcard{--stage-h:280px} }
@media (max-width:1000px){
  .v7 .pt{max-width:270px}
  .v7 .top{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}
  .v7 .formcard{width:auto;justify-self:stretch;grid-column:auto}
  .v7 .hcreds ul{grid-template-columns:1fr 1fr}
}
/* On a phone the visitor is using a thumb, and there is no fold to protect,
   so every control in the flow goes up to the 48px tap target. */
@media (max-width:820px){
  /* one fixed stage on the phone too, sized to the tallest step */
  .v7 .formcard{--stage-h:340px}
  .v7 .row label,.v7 .other-btn,.v7 .rows.two .row label{min-height:48px}
  .v7 .other-field input,.v7 .field input,.v7 .field textarea{min-height:48px}
  .v7 .other-field input{height:48px}
  .v7 .actions .btn{min-height:48px}
}
@media (max-width:900px){
  .v7{padding-top:var(--s4)}
  .v7 .panel{border-radius:0}
  .v7 .top{grid-template-columns:1fr;row-gap:var(--s5);padding:var(--s5) 0 0}
  /* On a phone the headline comes first. The old order put the photo and
     both buttons above it, so the visitor was asked to ring a stranger
     before being told what he does. */
  .v7 .pcol{grid-column:1;grid-row:auto;order:1;padding:0}
  .v7 .pt{grid-column:1;grid-row:auto;order:2;justify-self:center;max-width:250px;margin:var(--s4) 0}
  .v7 h1{font-size:clamp(36px,8vw,42px)}
  .v7 .hcreds{padding:0 0 var(--s5)}
  .v7 .hcreds ul{grid-template-columns:1fr 1fr;gap:var(--s4)}
  /* the stage stays fixed on the phone too, so nothing below the card jumps
     between questions. Bottom aligned, so the question line does not move. */
  .v7 .formcard{min-height:var(--stage-h);display:flex;flex-direction:column;justify-content:flex-end}
  .v7 .fields.two{grid-template-columns:1fr}
}
'''

ARR_A='''/* A: the enquiry card overlaps the photo, exactly where the reference card sits */
.v7 .top{grid-template-columns:minmax(0,41%) minmax(0,59%);--shot-w:47%}
.v7 .formcard{justify-self:start;width:82%}
'''
ARR_B='''/* B: the enquiry card and the photo sit side by side, sharing the right half */
.v7 .top{grid-template-columns:minmax(0,54%) minmax(0,46%)}
'''
css=css.replace('/*__ARRANGEMENT__*/', ARR_A if ARR=='A' else ARR_B)

out=src[:a]+markup+src[b:]
out=out.replace(trust_sec,'')
out=out.replace('</style>','%s.v7 .pt img{--mask:url("%s")}</style>'%(css,mask),1)
open('ensign-home.html','w').write(out)
print('home hero v7 arrangement',ARR,len(out))
