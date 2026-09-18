import math,random,urllib.parse
W,H=600,800
def outline(seed,inset=0,rough=1.0):
    r=random.Random(seed); pts=[]
    # rounded rectangle perimeter, sampled
    R=70; x0,y0,x1,y1=inset,inset,W-inset,H-inset
    def rr_point(t):
        # t in [0,1) around the rect clockwise from top-left straight
        L=[(x1-x0-2*R),(math.pi*R/2),(y1-y0-2*R),(math.pi*R/2),(x1-x0-2*R),(math.pi*R/2),(y1-y0-2*R),(math.pi*R/2)]
        tot=sum(L); d=t*tot
        segs=[('h',x0+R,y0,1),('a',x1-R,y0+R,-math.pi/2),('v',x1,y0+R,1),('a',x1-R,y1-R,0),('h',x1-R,y1,-1),('a',x0+R,y1-R,math.pi/2),('v',x0,y1-R,-1),('a',x0+R,y0+R,math.pi)]
        for (kind,a,b,c),l in zip(segs,L):
            if d<=l:
                if kind=='h': return (a+c*d,b,'h')
                if kind=='v': return (a,b+c*d,'v')
                ang=c+d/R; return (a+R*math.cos(ang),b+R*math.sin(ang),'a')
            d-=l
        return (x0+R,y0,'h')
    n=420
    # low-frequency wobble phases
    ph=[r.uniform(0,6.28) for _ in range(4)]
    cx,cy=W/2,H/2
    for k in range(n):
        t=k/n; x,y,kind=rr_point(t)
        low=10*math.sin(2*math.pi*t*3+ph[0])+6*math.sin(2*math.pi*t*7+ph[1])
        # brush bristle nicks: stronger on top and bottom edges (horizontal drag)
        hi=r.uniform(-1,1)*(5 if kind=='h' else 2.2)
        if kind=='h' and r.random()<0.05: hi-=r.uniform(6,14)
        off=(low*0.6+hi)*rough
        dx,dy=x-cx,y-cy; l=math.hypot(dx,dy) or 1
        pts.append((x+dx/l*off, y+dy/l*off))
    return 'M'+' L'.join('%.1f %.1f'%p for p in pts)+' Z'
photo=outline(11,inset=18)
bg=outline(23,inset=0,rough=1.2)
open('brush_bg_soft.svg','w').write('<svg class="brush-bg" viewBox="0 0 600 800" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="%s"/></svg>'%bg)
mask='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" preserveAspectRatio="none"><path d="%s" fill="#000"/></svg>'%photo
open('brush_mask_soft.txt','w').write('data:image/svg+xml,'+urllib.parse.quote(mask))
