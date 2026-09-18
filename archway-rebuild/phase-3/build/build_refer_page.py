g={}; exec(open('build_home.py').read(),g)
body_home=g['body']
header=body_home[:body_home.index('<main id="main">')].replace('<a class="btn btn-ghost" href="#">Refer someone</a>','<a class="btn btn-ghost" href="#" aria-current="page">Refer someone</a>')
footer=body_home[body_home.index('</main>')+7:]
r=open('ensign-referral-form.html').read()
rcss=r[r.index('<style>')+7:r.index('</style>')]
rbody=r[r.index('<body>')+6:r.index('<script>')]
rjs=r[r.index('<script>')+8:r.rindex('</script>')]
# strip demo bar and its own header
rbody=rbody[rbody.index('<main>'):]
rbody=rbody.replace('<main>','<main id="main">',1)
rbody=rbody.replace('<pre id="log" class="log" aria-label="Prototype log"></pre>','')
rjs=rjs.replace("logEl.textContent=","void ")
html=g['html']; head=html[:html.index('<style>')+7]
head=head.replace('<title>Support Coordination and Recovery Coaching in South East Queensland | Ensign</title>','<title>Refer a Participant | Ensign Support Coordination</title>').replace('content="Andrew Manoba provides NDIS support coordination and psychosocial recovery coaching across South East Queensland. Taking new participants now. Replies within 1 business day."','content="Refer a self managed or plan managed NDIS participant to Ensign for support coordination or psychosocial recovery coaching. Reply within 1 business day."')
homecss=html[html.index('<style>')+7:html.index('</style>')]
extra='.btn.btn-ghost[aria-current="page"]{box-shadow:inset 0 0 0 2px var(--accent);color:var(--indigo-900)}'
out=head+rcss+homecss+extra+'</style></head><body>'+header+rbody+footer+'<script>'+rjs+'</script></body></html>'
open('ensign-refer.html','w').write(out); print(len(out))
