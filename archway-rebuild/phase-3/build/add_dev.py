import sys,os,time
SNIP = """<script>/* dev only: auto reload while served from localhost. Stripped in Phase 4. */
(function(){var h=location.hostname;if(h!=='localhost'&&h!=='127.0.0.1')return;var last=null;
setInterval(function(){fetch('dev-version.txt?'+Date.now(),{cache:'no-store'}).then(function(r){return r.text()})
.then(function(t){t=t.trim();if(last===null){last=t;return}if(t!==last){location.reload()}}).catch(function(){});},1500);})();
</script>"""
for f in sys.argv[1:]:
    s=open(f).read()
    if 'dev-version.txt' in s:
        continue
    i=s.rfind('</body>')
    if i<0: print("no body:",f); continue
    open(f,'w').write(s[:i]+SNIP+s[i:])
    print("dev reload added:",f)
open('dev-version.txt','w').write(str(int(time.time()))+"\n")
# landing page so http://localhost:8080 opens Home
open('index.html','w').write(
 '<!doctype html><html lang="en-AU"><head><meta charset="utf-8">'
 '<title>Ensign</title><meta http-equiv="refresh" content="0; url=ensign-home.html">'
 '<link rel="canonical" href="ensign-home.html"></head>'
 '<body style="font:16px/1.5 system-ui;padding:40px">Opening the Ensign home page. '
 '<a href="ensign-home.html">Click here if it does not open.</a></body></html>')
print("index.html + dev-version.txt written")
