import sys
# Post-process: adds the shadow/hairline toggle for the sticky site header.
# Fail safe. If this script never ran, or the JS is blocked, the header is
# still stuck to the top with a solid background. Only the hairline is lost.
SNIP = """<script>/* sticky header: show a hairline once the page has moved */
(function(){var h=document.querySelector('.site-head');if(!h)return;var on=false;
function f(){var s=(window.scrollY||document.documentElement.scrollTop)>4;
if(s!==on){on=s;h.classList.toggle('stuck',s)}}
f();addEventListener('scroll',f,{passive:true});addEventListener('resize',f,{passive:true});})();
</script>"""
for f in sys.argv[1:]:
    s = open(f).read()
    if "sticky header: show a hairline" in s:
        continue
    i = s.rfind('</body>')
    if i < 0:
        print("no body:", f); continue
    open(f,'w').write(s[:i]+SNIP+s[i:])
    print("stuck header added:", f)
