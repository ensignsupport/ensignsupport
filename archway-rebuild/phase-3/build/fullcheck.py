import asyncio,json
from playwright.async_api import async_playwright
AXE=open("node_modules/axe-core/axe.min.js").read()
PAGES=["ensign-home","ensign-services","ensign-about","ensign-refer","ensign-contact","ensign-404","ensign-privacy"]
async def main():
    async with async_playwright() as pw:
        b=await pw.chromium.launch(executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome")
        for p in PAGES:
            for w,h,tag in [(1440,900,"d"),(390,844,"p")]:
                pg=await b.new_page(viewport={"width":w,"height":h}); errs=[]
                pg.on("pageerror",lambda e:errs.append(str(e)))
                await pg.goto(f"file:///tmp/claude-0/p3/comp/{p}.html"); await pg.wait_for_timeout(400)
                ov=await pg.evaluate("document.documentElement.scrollWidth>document.documentElement.clientWidth")
                await pg.add_script_tag(content=AXE)
                v=await pg.evaluate("axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}}).then(r=>r.violations.map(x=>x.id+':'+x.nodes.length))")
                print(f"{p:18s}{tag} overflow={ov} errs={len(errs)} axe={v or 'CLEAN'}")
                await pg.close()
        await b.close()
asyncio.run(main())
