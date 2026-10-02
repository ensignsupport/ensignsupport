import re,sys
# Post-process: builds the phone and tablet menu from the header nav that is
# already on the page, so the panel can never drift from the real navigation.
# Runs AFTER link_pages.py, which turns href="#" into real page links.
# Also fixes the skip link target and adds the no-JavaScript notice.

PANEL_JS = """<script>/* header menu for phone and tablet */
(function(){var btn=document.querySelector('.menu-btn'),p=document.getElementById('site-menu');
if(!btn||!p)return;btn.setAttribute('aria-expanded','false');btn.setAttribute('aria-controls','site-menu');
function shut(back){p.hidden=true;btn.setAttribute('aria-expanded','false');if(back)btn.focus()}
function show(){p.hidden=false;btn.setAttribute('aria-expanded','true')}
btn.addEventListener('click',function(e){e.stopPropagation();p.hidden?show():shut(false)});
document.addEventListener('click',function(e){if(p.hidden)return;if(!p.contains(e.target)&&!btn.contains(e.target))shut(false)});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!p.hidden)shut(true)});
p.addEventListener('click',function(e){if(e.target.closest('a'))shut(false)});
addEventListener('resize',function(){if(innerWidth>820&&!p.hidden)shut(false)},{passive:true});})();
</script>"""

LINKS = [("ensign-services.html","Services"),
         ("ensign-about.html","About Andrew"),
         ("ensign-refer.html","Refer someone"),
         ("ensign-contact.html","Contact"),
         ("ensign-privacy.html","Privacy policy")]

NOSCRIPT_FLOW = ('<noscript><p class="nojs">The enquiry form on this page needs JavaScript. '
                 'Without it, use the links at the bottom of the page, the referral form, '
                 'or call Andrew on the number in the footer.</p></noscript>')
NOSCRIPT_NAV = ('<noscript><p class="nojs">The Menu button needs JavaScript. '
                'Every page is linked at the bottom of this one.</p></noscript>')

for f in sys.argv[1:]:
    s = open(f).read()
    if 'id="site-menu"' in s:
        continue
    here = f.split('/')[-1]
    rows = "".join(
        '<a href="%s"%s>%s</a>' % (href, ' aria-current="page"' if href == here else '', text)
        for href, text in LINKS)
    panel = '<div class="mnav" id="site-menu" hidden><div class="wrap">%s</div></div>' % rows
    if '</header>' in s:
        s = s.replace('</header>', panel + '</header>', 1)
    else:
        print("no header:", f); continue
    # keyboard focus has to be able to land on main for the skip link to work
    s = s.replace('<main id="main">', '<main id="main" tabindex="-1">', 1)
    # tell someone with scripts off what they lose, on every page. The Menu
    # button is inert without JavaScript, so the footer is the way around.
    if 'class="nojs"' not in s:
        note = NOSCRIPT_FLOW if 'class="enq"' in s else NOSCRIPT_NAV
        s = s.replace('<main id="main" tabindex="-1">',
                      '<main id="main" tabindex="-1">' + note, 1)
    i = s.rfind('</body>')
    s = s[:i] + PANEL_JS + s[i:]
    open(f,'w').write(s)
    print("menu added:", f)
