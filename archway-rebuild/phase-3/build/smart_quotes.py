import re,sys
# curly apostrophes in visible text only; never inside script or style
SPLIT=re.compile(r'(<(script|style)\b[^>]*>.*?</\2>)',re.S|re.I)
APOS=re.compile(r"(?<=[A-Za-z])'(?=[A-Za-z])")
for f in sys.argv[1:]:
    s=open(f).read(); parts=SPLIT.split(s); out=[];i=0
    while i<len(parts):
        seg=parts[i]
        if i+2<len(parts) and parts[i+1] and parts[i+1].lower() in ('script','style') and seg is not None and i%3==0:
            pass
        i+=1
    # simpler: rebuild with finditer
    out=[];last=0;n=0
    for m in SPLIT.finditer(s):
        chunk=s[last:m.start()]
        new,c=APOS.subn("’",chunk); n+=c
        out.append(new); out.append(m.group(0)); last=m.end()
    tail=s[last:]; new,c=APOS.subn("’",tail); n+=c; out.append(new)
    open(f,'w').write(''.join(out)); print(f,n)
