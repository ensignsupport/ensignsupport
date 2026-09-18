import re,sys
M={'Services':'ensign-services.html','About Andrew':'ensign-about.html','Contact':'ensign-contact.html','Refer someone':'ensign-refer.html','Privacy policy':'ensign-privacy.html','Privacy Policy':'ensign-privacy.html','Meet Andrew':'ensign-about.html','Talk to Andrew':'ensign-contact.html','Home':'ensign-home.html','Use the referral form':'ensign-refer.html','Submit a referral':'ensign-refer.html','How support coordination works':'ensign-services.html#sc','How recovery coaching works':'ensign-services.html#rc','Ask about support coordination':'ensign-contact.html','Ask about recovery coaching':'ensign-contact.html','use the referral form':'ensign-refer.html','Refer someone else':None}
for f in sys.argv[1:]:
    h=open(f).read(); n=0
    def sub(m):
        global n
        attrs,inner=m.group(1),m.group(2)
        text=re.sub(r'<[^>]+>','',inner).strip()
        tgt=M.get(text)
        if not tgt: return m.group(0)
        n+=1
        return '<a%shref="%s"%s>%s</a>'%(attrs.split('href="#"')[0], tgt, attrs.split('href="#"')[1], inner)
    h=re.sub(r'<a([^>]*href="#"[^>]*)>(.*?)</a>',sub,h,flags=re.S)
    h=h.replace('<a class="logo" href="#"','<a class="logo" href="ensign-home.html"')
    open(f,'w').write(h); print(f,n,h.count('href="#"'))
