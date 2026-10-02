import re,html as H
g={}; exec(open('build_home.py').read(),g)
body_home=g['body']; S=g['S']
header=body_home[:body_home.index('<main id="main">')]
footer=body_home[body_home.index('</main>')+7:].replace('<li><a href="#">Privacy policy</a></li>','<li><a href="#" aria-current="page">Privacy policy</a></li>')
md=open('/mnt/user-data/outputs/ensign-privacy-policy.md').read()
md=md[:md.index('\n---\n')]  # policy only; form notices live on the forms
lines=md.split('\n')
def inline(t):
    t=H.escape(t,quote=False)
    t=re.sub(r'\*\*(.+?)\*\*',r'<b>\1</b>',t); t=re.sub(r'\*(.+?)\*',r'<i>\1</i>',t)
    t=re.sub(r'\[PLACEHOLDER:? ?([^\]]*)\]',lambda m:'<span class="ph-note">PLACEHOLDER%s</span>'%((': '+m.group(1)) if m.group(1) else ''),t)
    t=re.sub(r'(?<![./])(accesshub\.gov\.au)',r'@@AH@@',t)
    t=re.sub(r'(www\.[a-z.]+)',r'<a href="https://\1">\1</a>',t)
    t=re.sub(r'Phone (1[38]00 [0-9 ]+\d)',lambda m:'Phone <a href="tel:%s">%s</a>'%(m.group(1).replace(' ',''),m.group(1)),t)
    t=re.sub(r'\b(131 450|13 11 14|1300 363 992|1800 035 544)\b',r'<span class="nowrap">\1</span>',t) if '<a href="tel' not in t else t
    t=t.replace('@@AH@@','<a href="https://www.accesshub.gov.au">accesshub.gov.au</a>')
    return t
out=[];toc=[];para=[];meta=[]
def flush():
    global para
    if para:
        first=para[0]
        m=re.match(r'^(\d+\.\d+) (.*)',first)
        items=[p for p in para[1:] if re.match(r'^\([a-h]\)',p)]
        rest=[p for p in para[1:] if not re.match(r'^\([a-h]\)',p)]
        if m:
            s='<div class="cl"><span class="cl-n">%s</span><div><p>%s</p>'%(m.group(1),inline(m.group(2)))
            if items: s+='<ol class="alpha">'+''.join('<li><span>%s</span><div>%s</div></li>'%(re.match(r'^\((.)\)',i).group(0),inline(i[4:])) for i in items)+'</ol>'
            s+=''.join('<p>%s</p>'%inline(r) for r in rest)+'</div></div>'
            out.append(s)
        else:
            out.append('<p class="plain">'+'<br>'.join(inline(p) for p in para)+'</p>')
    para=[]
started=False
in_short=False
short_txt=[]
for ln in lines:
    if ln.startswith('# '): continue
    if ln.startswith('> '): continue
    if not started and not ln.startswith('## '):
        if ln.strip(): meta.append(ln.strip())
        continue
    if ln.startswith('## The short version'):
        flush(); started=True; in_short=True; continue
    if ln.startswith('## '):
        flush(); started=True; in_short=False
        title=ln[3:]; n,t=title.split('. ',1); sid='s'+n
        if out: out.append('</section>')
        out.append('<section class="ps" id="%s"><h2><span class="sn">%s</span>%s</h2>'%(sid,n.zfill(2),inline(t)))
        toc.append((sid,n,t))
    elif ln.strip()=='': flush()
    elif in_short: short_txt.append(ln.strip())
    else: para.append(ln.strip())
flush(); out.append('</section>')
ver=next((m for m in meta if m.startswith('Version')),'')
tl='<ol class="toc">'+''.join('<li><a href="#%s"><span>%s</span>%s</a></li>'%(sid,n.zfill(2),H.escape(t)) for sid,n,t in toc)+'</ol>'
main='''<main id="main">
<section class="pv-head"><div class="wrap">
  <p class="draft"><span class="ph-note">PLACEHOLDER: stop gap draft, lawyer to review before go live</span></p>
  <h1>Privacy policy</h1>
  <p class="lead">What personal information Ensign collects, why, how it is kept safe, and how you can see it, correct it or complain.</p>
  <p class="ver">Ensign Support Coordination · ABN 19 518 036 825 · %(ver)s</p>
  <div class="short"><p class="sh-t">The short version</p><p>%(short)s</p></div>
</div></section>
<div class="wrap pv-body">
  <nav class="pv-nav" aria-label="Sections"><details open><summary class="lbl">On this page</summary>%(toc)s</details></nav>
  <article class="pv-text">%(body)s</article>
</div>
</main>'''%dict(short=inline(' '.join(short_txt)),ver=inline(ver),toc=tl,body=''.join(out))
css='''
.foot a[aria-current="page"]{font-weight:600}
.ph-note{display:inline;-webkit-box-decoration-break:clone;box-decoration-break:clone;font-size:13px;font-weight:600;color:#8a5a00;background:#fff3d6;border-radius:6px;padding:1px 8px;line-height:1.5}
.pv-head{padding:var(--s7) 0 var(--s7)}
.pv-head h1{font-size:clamp(44px,4.6vw + 18px,84px);letter-spacing:var(--track-display);line-height:var(--lh-head);margin-top:var(--s3)}
.pv-head .lead{margin-top:var(--s5);max-width:52ch}
.ver{font-size:15px;color:var(--muted);margin-top:var(--s3)}
.short{margin-top:var(--s7);background:var(--indigo-900);color:var(--n-0);border-radius:var(--r-lg);padding:var(--s6);max-width:880px}.short p{margin:0;font-size:var(--t-lead);line-height:1.55;max-width:none}.short .sh-t{font-size:15px;font-weight:600;color:#a0bdfe;margin-bottom:var(--s3)}.short .ph-note{font-size:13px}
.short div{background:var(--indigo-50);border-radius:var(--r-md);padding:var(--s5);display:flex;flex-direction:column;gap:4px}
.short b{font-size:18px;font-weight:600;color:var(--indigo-900)}
.short span{font-size:16px;color:var(--muted)}
.pv-body{display:grid;grid-template-columns:3fr 8fr;gap:var(--s8);align-items:start;padding-bottom:var(--section)}
.pv-body>*{min-width:0}
.pv-nav{position:sticky;top:104px} /* 88px sticky header + 16px */
.pv-nav summary{list-style:none;cursor:default}.pv-nav summary::-webkit-details-marker{display:none}
.lbl{font-size:15px;font-weight:600;color:var(--muted);margin:0 0 var(--s3)}
.toc{list-style:none;margin:0;padding:0;border-left:2px solid var(--line)}
.toc a{display:grid;grid-template-columns:32px 1fr;padding:6px var(--s3);margin-left:-2px;border-left:2px solid transparent;color:var(--muted);text-decoration:none;font-size:15px;line-height:1.35}
.toc a span{font-variant-numeric:tabular-nums;color:var(--accent)}
.toc a.on{color:var(--text);font-weight:600;border-left-color:var(--accent)}
@media (hover:hover){.toc a:hover{color:var(--text)}}
.pv-text{max-width:70ch}
.ps{padding:var(--s6) 0;border-top:1px solid var(--line);scroll-margin-top:var(--s5)}
.ps:first-child{border-top:0;padding-top:0}
.ps h2{font-size:clamp(24px,1vw + 18px,32px);letter-spacing:-.015em;display:flex;gap:var(--s4);align-items:baseline;margin-bottom:var(--s4)}
.sn{font-size:15px;font-weight:600;color:var(--accent);letter-spacing:.06em;min-width:28px}
.cl{display:grid;grid-template-columns:44px 1fr;gap:var(--s3);margin:0 0 var(--s4)}
.cl-n{font-size:14px;color:var(--muted);padding-top:3px;font-variant-numeric:tabular-nums}
.cl p{margin:0 0 var(--s2);max-width:none}
.alpha{list-style:none;margin:var(--s2) 0 0;padding:0;display:grid;gap:var(--s2)}
.alpha li{display:grid;grid-template-columns:32px 1fr;background:var(--surface);border-radius:var(--r-sm);padding:var(--s3) var(--s4);font-size:17px;line-height:1.5}
.alpha li>span{color:var(--accent);font-weight:600}
.plain{margin:0 0 var(--s4);padding:var(--s5);background:var(--surface);border-radius:var(--r-md);line-height:1.8}
@media (max-width:820px){.short{padding:var(--s5)}.pv-body{grid-template-columns:1fr;gap:var(--s5)}.pv-nav{position:static;background:var(--surface);border-radius:var(--r-md);padding:var(--s4)}.pv-nav summary{cursor:pointer;display:flex;justify-content:space-between;margin:0}.pv-nav summary::after{content:'Show';color:var(--accent);text-decoration:underline}.pv-nav details[open] summary::after{content:'Hide'}.pv-nav details[open] summary{margin-bottom:var(--s3)}.cl{grid-template-columns:36px 1fr}.alpha li{grid-template-columns:28px 1fr;padding:var(--s3)}}
'''
js='''(function(){var L=[].slice.call(document.querySelectorAll('.toc a')),S=[].slice.call(document.querySelectorAll('.ps'));function spy(){var cur=S[0];S.forEach(function(x){if(x.getBoundingClientRect().top<innerHeight*0.3)cur=x;});L.forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+cur.id);});}addEventListener('scroll',spy,{passive:true});spy();})();
(function(){if(matchMedia('(max-width:820px)').matches){var d=document.querySelector('.pv-nav details');if(d)d.open=false;}})();'''.replace('%%','%')
h=g['html']; head=h[:h.index('</style>')].replace('<title>Support Coordination and Recovery Coaching in South East Queensland | Ensign</title>','<title>Privacy Policy | Ensign Support Coordination</title>').replace('content="Andrew Manoba provides NDIS support coordination and psychosocial recovery coaching across South East Queensland. Taking new participants now. Replies within 1 business day."','content="How Ensign Support Coordination collects, uses, stores and protects personal and health information."')
open('ensign-privacy.html','w').write(head+css+'</style></head><body>'+header+main+footer+'<script>'+js+'</script></body></html>')
print(len(toc))
