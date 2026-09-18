import base64
src=open('ensign-home.html').read()
a=src.index('<section class="home-hero">')
b=src.index('</div></section>',a)+len('</div></section>')
hero=src[a:b]
fs=hero.index('<form id="enq"'); fe=hero.index('</form>')+7; form=hero[fs:fe]
# the trust strip moves from below the panel to inside it, as the panel floor
ts=src.index('<section class="trust"'); te=src.index('</section>',ts)+len('</section>')
trust_sec=src[ts:te]
trust_ul=trust_sec[trust_sec.index('<ul>'):trust_sec.index('</ul>')+5]
head=hero[hero.index('<p class="status">'):fs].rstrip()
photo="data:image/webp;base64,"+base64.b64encode(open("andrew-hero.webp","rb").read()).decode()

def S(p,sw="1.8"):
    return ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="%s" '
            'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">%s</svg>')%(sw,p)

ic_plan=S('<path d="M7 3.5h7l4 4V20a.5.5 0 0 1-.5.5H7.5a.5.5 0 0 1-.5-.5V4a.5.5 0 0 1 .5-.5z"/><path d="M14 3.5V8h4M9.5 12.5l2 2 3.5-4"/>')
ic_find=S('<circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/>')
ic_book=S('<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M8 3v4M16 3v4M3.5 10h17M8.5 14.5l2 2 4-4"/>')
ic_home=S('<path d="M12 21s-6.5-5.4-6.5-10a6.5 6.5 0 1 1 13 0c0 4.6-6.5 10-6.5 10z"/><circle cx="12" cy="10.5" r="2.4"/>')

chips=[("plan",ic_plan,"Reads your plan"),
       ("find",ic_find,"Finds who has room"),
       ("book",ic_book,"Sets up bookings"),
       ("home",ic_home,"Comes to you")]
chiphtml="".join('<span class="chip c-%s"><i>%s</i>%s</span>'%(k,i,t) for k,i,t in chips)
bubbles="".join('<span class="bub b%d"></span>'%n for n in range(1,8))

arrow_ico=S('<path d="M7 17 17 7M8.5 7H17v8.5"/>',"2")
markup='''<section class="home-hero v6"><div class="wrap"><div class="panel">
  <div class="pcol">
%s
%s
  </div>
  <div class="orbit">
    <span class="bubbles" aria-hidden="true">%s</span>
    <span class="dash" aria-hidden="true"></span>
    <figure class="ring">
      <img src="%s" alt="Andrew Manoba, smiling, in a suit">
    </figure>
    <span class="chips" aria-hidden="true">%s</span>
    <p class="orbit-sr">What Andrew does: reads your plan, finds who has room, sets up bookings, and comes to you.</p>
    <a class="slab" href="#enq">
      <span class="slab-label">Getting started</span>
      <strong>Replies within 1 business day</strong>
      <span class="slab-body">Available 7am to 7pm, seven days.</span>
      <span class="slab-go" aria-hidden="true">%s</span>
    </a>
  </div>
  <div class="floor">%s</div>
</div></div></section>'''%(head,form,bubbles,photo,chiphtml,arrow_ico,trust_ul)

css='''
.v6{padding:var(--s5) 0 var(--s7);position:relative;overflow:hidden;
  background-image:repeating-linear-gradient(135deg,rgba(35,31,25,.028) 0 1px,transparent 1px 9px)}
.v6 .panel{position:relative;border-radius:44px;overflow:hidden;
  background:linear-gradient(135deg,var(--indigo-50) 0%,#f4f2ee 46%,var(--n-100) 100%);
  box-shadow:0 1px 0 rgba(255,255,255,.7) inset,0 30px 70px -50px rgba(35,31,25,.45);
  padding:clamp(32px,4vw,64px);
  display:grid;grid-template-columns:minmax(0,6.6fr) minmax(0,6fr);
  grid-template-rows:auto auto;
  column-gap:var(--s7);row-gap:var(--s6);align-items:center}
/* the four credentials give the panel a floor, so the space question 1 cannot
   fill is bounded instead of trailing off into the panel edge */
.v6 .floor{grid-column:1/-1;align-self:end}
.v6 .floor ul{list-style:none;margin:0;padding:var(--s5) 0 0;display:grid;
  grid-template-columns:repeat(4,1fr);gap:var(--s5);
  border-top:1px solid var(--line);border-bottom:0}
.v6 .floor li{display:grid;grid-template-columns:28px 1fr;gap:var(--s3);align-items:start;
  font-size:16px;line-height:1.4}
.v6 .floor svg{width:24px;height:24px;color:var(--accent)}
.v6 .floor b{font-weight:600}

/* dark card over the photo, the signature piece of the reference */
.v6 .slab{position:absolute;right:0;bottom:-3%;width:min(324px,80%);z-index:5;
  display:grid;grid-template-columns:1fr auto;gap:var(--s2) var(--s4);align-items:center;
  padding:var(--s4) var(--s5);border-radius:22px;text-decoration:none;
  background:linear-gradient(150deg,rgba(15,34,94,.94),rgba(35,31,25,.90));
  box-shadow:0 30px 60px -30px rgba(35,31,25,.7);
  -webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);
  transition:transform 220ms var(--ease-out),box-shadow 220ms ease}
.v6 .slab-label{grid-column:1;font-size:13px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:rgba(255,255,255,.62)}
.v6 .slab strong{grid-column:1;font-size:17px;font-weight:600;line-height:1.3;color:#fff;text-wrap:balance}
.v6 .slab-body{grid-column:1;font-size:14px;line-height:1.45;color:rgba(255,255,255,.76);text-wrap:balance}
.v6 .slab-go{grid-column:2;grid-row:1/4;width:48px;height:48px;border-radius:50%;flex:none;
  display:grid;place-items:center;background:var(--n-0);color:var(--indigo-900);
  transition:transform 220ms var(--ease-out)}
.v6 .slab-go svg{width:20px;height:20px}
@media (hover:hover) and (pointer:fine){
  .v6 .slab:hover{transform:translateY(-3px);box-shadow:0 38px 70px -30px rgba(35,31,25,.75)}
  .v6 .slab:hover .slab-go{transform:translateX(3px) rotate(45deg)}
}
.v6 .slab:focus-visible{outline:3px solid var(--accent);outline-offset:3px}
/* the fine print now lives in the dark card */
.v6 .enq .meta{display:none}
.v6 h1{font-size:clamp(38px,3.1vw + 16px,62px);max-width:15ch}
.v6 .lead{margin-top:var(--s4);max-width:34ch}
.v6 .enq{margin-top:var(--s6);max-width:470px}
/* the fixed ROW, not the form, keeps the panel the same size on every stage */
.v6 .enq .enq-step[data-step="1"] .rows{gap:8px}
.v6 .enq .enq-step[data-step="1"] .rows.two{grid-template-columns:1fr 1fr;column-gap:8px}
.v6 .enq .enq-step[data-step="1"] .row label{min-height:50px;padding:0 var(--s3) 0 var(--s4)}
.v6 .enq .enq-step[data-step="1"] .row .txt{font-size:16px}
.v6 .enq .enq-step[data-step="1"] .row .arrow{width:22px;height:22px}
.v6 .enq .enq-step[data-step="1"] .row .arrow svg{width:15px;height:15px}
.v6 .enq-step[data-step="2"] .fields{grid-template-columns:1fr 1fr;gap:var(--s4) var(--s5)}
.v6 .enq-step[data-step="2"] .fields .field:nth-child(3){grid-column:1/-1}
.v6 .enq-step[data-step="2"] .field input{min-height:44px}
.v6 .enq-step[data-step="2"] .field textarea{min-height:60px}
.v6 .enq-step[data-step="2"] .recap{margin-top:var(--s3)}
.v6 .enq-step[data-step="2"] .actions{margin-top:var(--s4)}
.v6 .enq-step[data-step="2"] .hint{display:none}
.v6 .enq:has(.enq-step[data-step="2"]:not([hidden])){padding:var(--s5)}
@media (max-width:900px){
  .v6 .enq-step[data-step="2"] .fields{grid-template-columns:1fr}
}

.v6 .orbit{position:relative;width:100%;max-width:540px;aspect-ratio:1;margin-left:auto}
.v6 .orbit-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}

.v6 .ring{margin:0;position:absolute;left:50%;top:50%;width:64%;aspect-ratio:1;
  transform:translate(-50%,-50%);border-radius:50%;background:var(--n-0);padding:8px;
  box-shadow:0 0 0 2px var(--indigo-300),0 30px 60px -32px rgba(35,31,25,.45)}
.v6 .ring img{width:100%;height:100%;object-fit:cover;object-position:56% 20%;border-radius:50%;display:block}

.v6 .dash{position:absolute;left:50%;top:50%;width:86%;aspect-ratio:1;transform:translate(-50%,-50%);
  border-radius:50%;border:1.5px dashed var(--indigo-200);animation:v6spin 70s linear infinite}
@keyframes v6spin{to{transform:translate(-50%,-50%) rotate(360deg)}}

.v6 .bubbles{position:absolute;inset:-18%;pointer-events:none}
.v6 .bub{position:absolute;border-radius:50%;background:var(--indigo-100);opacity:.75;
  animation:v6float 12s ease-in-out infinite alternate}
.v6 .b1{width:64px;height:64px;left:2%;top:6%;animation-duration:11s}
.v6 .b2{width:28px;height:28px;left:16%;top:36%;animation-duration:9s;animation-delay:-3s;background:var(--indigo-200)}
.v6 .b3{width:44px;height:44px;right:6%;top:2%;animation-duration:13s;animation-delay:-5s}
.v6 .b4{width:20px;height:20px;right:20%;top:26%;animation-duration:8s;animation-delay:-2s;background:var(--indigo-200)}
.v6 .b5{width:76px;height:76px;right:0%;bottom:10%;animation-duration:15s;animation-delay:-7s}
.v6 .b6{width:34px;height:34px;left:8%;bottom:14%;animation-duration:10s;animation-delay:-4s}
.v6 .b7{width:16px;height:16px;left:44%;bottom:1%;animation-duration:7s;animation-delay:-1s;background:var(--indigo-200)}
@keyframes v6float{from{transform:translateY(-9px)}to{transform:translateY(9px)}}

.v6 .chips{position:absolute;inset:0;pointer-events:none;--cr:38.83%}
.v6 .chip{position:absolute;left:calc(50% + var(--cr) * var(--cx));top:calc(50% + var(--cr) * var(--cy));
  right:auto;bottom:auto;transform:translate(-50%,-50%);
  display:inline-flex;align-items:center;gap:8px;white-space:nowrap;
  background:var(--n-0);border-radius:var(--r-pill,999px);padding:9px 16px 9px 11px;
  font-size:15px;font-weight:600;color:var(--text);
  box-shadow:0 14px 30px -16px rgba(35,31,25,.45),0 0 0 1px rgba(35,31,25,.05);
  animation:v6bob 6s ease-in-out infinite alternate}
.v6 .chip i{display:grid;place-items:center;width:26px;height:26px;border-radius:9px;
  background:var(--indigo-50);color:var(--accent);flex:none}
.v6 .chip svg{width:16px;height:16px}
/* one radius for all four, so no chip crowds the photo while another drifts.
   --cx/--cy are cos/sin of each chip's angle, kept at the approved arrangement. */
.v6 .c-plan{--cx:-.7337;--cy:-.6795;animation-delay:-1s}
.v6 .c-find{--cx:.8241;--cy:-.5664;animation-duration:7s;animation-delay:-3s}
.v6 .c-book{--cx:1;--cy:.0052;animation-duration:6.5s;animation-delay:-2s}
.v6 .c-home{--cx:-.9397;--cy:.3420;animation-duration:7.5s;animation-delay:-4s}
/* bob on the translate property, so it composes with the centring transform */
@keyframes v6bob{from{translate:0 -6px}to{translate:0 6px}}

@media (prefers-reduced-motion:reduce){
  .v6 .dash,.v6 .bub,.v6 .chip{animation:none}
}
/* --- first two steps read as buttons, not a form (C48) --- */
.v6 .enq{transition:background-color 220ms ease,box-shadow 220ms ease,padding 220ms ease}
.v6 .enq:has(.enq-step[data-step="0"]:not([hidden])),
.v6 .enq:has(.enq-step[data-step="1"]:not([hidden])){
  background:transparent;box-shadow:none;padding:0;border-radius:0}
.v6 .enq:has(.enq-step[data-step="0"]:not([hidden])) .enq-progress,
.v6 .enq:has(.enq-step[data-step="1"]:not([hidden])) .enq-progress{display:none}
.v6 .enq:has(.enq-step[data-step="0"]:not([hidden])) .enq-top,
.v6 .enq:has(.enq-step[data-step="1"]:not([hidden])) .enq-top{display:block;margin-bottom:var(--s3)}
.v6 .enq:has(.enq-step[data-step="0"]:not([hidden])) .enq-count,
.v6 .enq:has(.enq-step[data-step="1"]:not([hidden])) .enq-count{
  font-size:var(--t-small);font-weight:600;color:var(--muted);letter-spacing:.02em}
.v6 .enq:has(.enq-step[data-step="0"]:not([hidden])) .enq-q,
.v6 .enq:has(.enq-step[data-step="1"]:not([hidden])) .enq-q{
  font-size:clamp(22px,0.8vw + 17px,28px);padding-bottom:var(--s4)}

.v6 .enq-step[data-step="0"] .rows,
.v6 .enq-step[data-step="1"] .rows{display:grid;gap:10px}
.v6 .enq-step[data-step="1"] .rows.two{column-gap:10px}
.v6 .enq-step[data-step="0"] .row,
.v6 .enq-step[data-step="1"] .row{border-bottom:0}
.v6 .enq-step[data-step="0"] .row label,
.v6 .enq-step[data-step="1"] .row label{
  min-height:58px;padding:0 var(--s4) 0 var(--s5);background:var(--n-0);
  box-shadow:0 1px 2px rgba(35,31,25,.07),0 14px 28px -20px rgba(35,31,25,.55);
  justify-content:space-between;
  transition:transform 200ms var(--ease-out),box-shadow 200ms ease}
.v6 .enq-step[data-step="0"] .row .txt,
.v6 .enq-step[data-step="1"] .row .txt{font-size:17px;font-weight:600}
.v6 .enq-step[data-step="0"] .row .arrow,
.v6 .enq-step[data-step="1"] .row .arrow{display:grid;width:26px;height:26px;border-radius:50%;
  background:transparent;box-shadow:none;color:var(--muted);transform:none}
.v6 .enq-step[data-step="0"] .row .arrow svg,
.v6 .enq-step[data-step="1"] .row .arrow svg{width:17px;height:17px}
@media (hover:hover) and (pointer:fine){
  .v6 .enq-step[data-step="0"] .row label:hover,
  .v6 .enq-step[data-step="1"] .row label:hover{
    transform:translateY(-2px);
    box-shadow:0 0 0 2px var(--accent),0 18px 34px -20px rgba(35,31,25,.55)}
  .v6 .enq-step[data-step="0"] .row label:hover .arrow,
  .v6 .enq-step[data-step="1"] .row label:hover .arrow{background:transparent;color:var(--accent);transform:translateX(3px)}
}
.v6 .enq-step[data-step="0"] .row input:checked+label,
.v6 .enq-step[data-step="1"] .row input:checked+label{
  box-shadow:0 0 0 2.5px var(--accent),0 18px 34px -20px rgba(35,31,25,.55);background:var(--n-0)}
@media (prefers-reduced-motion:reduce){
  .v6 .enq,.v6 .enq-step[data-step="0"] .row label,.v6 .enq-step[data-step="1"] .row label{transition:none}
}
@media (max-width:900px){
  .v6 .enq{max-width:none}
  .v6 .enq-step[data-step="0"] .row label,
  .v6 .enq-step[data-step="1"] .row label{min-height:56px;padding:0 var(--s4) 0 var(--s5)}
  .v6 .enq-step[data-step="0"] .row .txt,
  .v6 .enq-step[data-step="1"] .row .txt{font-size:17px}
}


@media (max-width:1100px){
  .v6 .chip{font-size:14px;padding:7px 13px 7px 9px}
  .v6 .chips{--cr:41%}
}
@media (max-width:900px){
  .v6{padding-top:var(--s4)}
  .v6 .panel{grid-template-columns:1fr;grid-template-rows:none;gap:var(--s5);
    border-radius:30px;padding:var(--s6) var(--s5) var(--s7)}
  .v6 .floor{order:6}
  .v6 .floor ul{grid-template-columns:1fr 1fr;gap:var(--s4)}
  .v6 .pcol{display:contents}
  .v6 .status{order:1;justify-self:start}
  .v6 h1{order:2;font-size:clamp(34px,8.5vw,44px);max-width:none}
  .v6 .lead{order:3;max-width:none}
  .v6 .orbit{order:4;max-width:300px;margin:var(--s4) auto 170px}
  .v6 .slab{top:calc(100% + 18px);bottom:auto;left:-14%;right:-14%;width:auto;
    padding:var(--s4) var(--s5);border-radius:20px}
  .v6 .slab strong{font-size:16px}
  .v6 .slab-go{width:42px;height:42px}
  .v6 .enq{order:5;margin-top:var(--s4)}
  .v6 .chip{font-size:13px;padding:6px 11px 6px 7px;gap:6px;
    left:auto;right:auto;top:auto;bottom:auto;transform:none}
  .v6 .chip i{width:22px;height:22px;border-radius:7px}
  .v6 .chip svg{width:14px;height:14px}
  .v6 .c-plan{left:-8%;top:1%}
  .v6 .c-find{right:-10%;top:22%}
  .v6 .c-book{right:-8%;top:47%}
  .v6 .c-home{left:-8%;bottom:6%}
  .v6 .bubbles{inset:-10%}
  .v6 .b1{width:42px;height:42px}.v6 .b5{width:48px;height:48px}.v6 .b3{width:30px;height:30px}
}
'''
out=src[:a]+markup+src[b:]
out=out.replace(trust_sec,'')
out=out.replace('</style>','%s</style>'%css,1)
open('hero-6.html','w').write(out)
open('ensign-home.html','w').write(out)
print('home hero v6',len(out))
