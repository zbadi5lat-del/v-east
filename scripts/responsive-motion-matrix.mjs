import{chromium}from'/tmp/live-e2e/node_modules/playwright-core/index.mjs';import fs from'node:fs/promises';
const U=process.env.LIVE_URL,C=process.env.CHROME_PATH||'/usr/bin/google-chrome',B=await chromium.launch({headless:true,executablePath:C,args:['--no-sandbox','--disable-dev-shm-usage']}),E=[],R=[];
const A=(ok,name,d={})=>{R.push({ok:!!ok,name,...d});if(!ok){console.error('FAIL',name,JSON.stringify(d));E.push({name,...d})}else console.log('PASS',name,JSON.stringify(d))},S=ms=>new Promise(r=>setTimeout(r,ms));
const cases=[['ar','dark'],['ar','light'],['en','dark'],['en','light']],widths=[[390,844],[768,1024],[1024,768],[1366,768]];
async function ctx(l,t,w,h,reduce=false){const c=await B.newContext({viewport:{width:w,height:h},reducedMotion:reduce?'reduce':'no-preference',colorScheme:t});await c.addInitScript(x=>{localStorage.setItem('veast-language',x.l);localStorage.setItem('veast-theme',x.t)},{l,t});return c}
try{
for(const[l,t]of cases)for(const[w,h]of widths){
 const c=await ctx(l,t,w,h),p=await c.newPage(),errs=[];p.on('console',m=>m.type()==='error'&&errs.push(m.text()));p.on('pageerror',e=>errs.push(e.message));
 const resp=await p.goto(U,{waitUntil:'domcontentloaded',timeout:30000});A(resp?.ok(),'motion document HTTP',{l,t,w,status:resp?.status()});await S(520);
 const intro=await p.evaluate(()=>{const e=document.querySelector('.site-entry'),o=document.querySelector('.site-entry__ocean-svg'),lg=document.querySelector('.site-entry__logo');return{display:e?getComputedStyle(e).display:'',entry:e?getComputedStyle(e).animationName:'',ocean:o?getComputedStyle(o).animationName:'',logo:lg?getComputedStyle(lg).animationName:''}});
 A(intro.display!=='none'&&intro.entry==='siteEntryExit'&&intro.ocean==='siteEntryOceanSurge'&&intro.logo==='siteEntryLogoOcean','intro animation active',{l,t,w,...intro});
 await p.evaluate(()=>document.querySelector('.site-entry')?.remove());
 let sw;if(w<1280){await p.locator('#mobile-navigation-toggle').click();await S(100);sw=p.locator('#mobile-navigation [role="switch"]');}else{sw=p.locator('.site-header [role="switch"]:visible').first();}
 A(await sw.count()===1,'theme switch reachable',{l,t,w});
 const beforeTheme=await p.evaluate(()=>document.documentElement.dataset.theme||'');
 const before=await sw.locator('.theme-scene-toggle__orb').evaluate(el=>({tr:getComputedStyle(el).transform,d:getComputedStyle(el).transitionDuration}));
 await sw.click();
 await p.waitForFunction(prev=>document.documentElement.dataset.theme!==prev,beforeTheme,{timeout:2500});
 await S(650);
 const afterTheme=await p.evaluate(()=>document.documentElement.dataset.theme||'');
 const afterState=await sw.evaluate(el=>({cls:el.className,checked:el.getAttribute('aria-checked'),tr:getComputedStyle(el.querySelector('.theme-scene-toggle__orb')).transform}));
 const stateOk=afterState.checked===(afterTheme==='dark'?'true':'false')&&afterState.cls.includes(afterTheme==='dark'?'is-dark':'is-light');
 A(before.d!=='0s'&&beforeTheme!==afterTheme&&stateOk,'theme transition state active on viewport',{l,t,w,beforeTheme,afterTheme,before,afterState});
 await S(120);
 await sw.click();
 await p.waitForFunction(prev=>document.documentElement.dataset.theme===prev,beforeTheme,{timeout:2500});
 await S(650);
 if(w<1280){await p.keyboard.press('Escape');await S(80)}
 await p.evaluate(()=>scrollTo(0,Math.min(420,document.querySelector('#hero')?.scrollHeight||420)));await S(150);
 const hero=await p.evaluate(()=>{const h=document.querySelector('#hero'),q=document.querySelector('.hero-copy-scroll'),v=document.querySelector('.hero-visual-scroll .hero-media-frame'),g=document.querySelector('.hero-operations-grid');return{progress:parseFloat(h?.style.getPropertyValue('--hero-scroll')||'0'),copy:q?getComputedStyle(q).transform:'none',visual:v?getComputedStyle(v).transform:'none',grid:g?getComputedStyle(g).transform:'none'}});
 A(hero.progress>0.02&&hero.copy!=='none'&&hero.visual!=='none'&&hero.grid!=='none','hero scroll motion active',{l,t,w,...hero});
 const places=p.locator('#places');await places.scrollIntoViewIfNeeded();await S(260);
 const venue=await places.evaluate(el=>{const cards=[...el.querySelectorAll('.place-card')];return{count:cards.length,minimal:cards.every(c=>c.classList.contains('place-logo-card')&&!!c.querySelector('.place-logo-card__mark img')&&!!c.querySelector('.place-logo-card__name')&&!c.querySelector('.place-mini-stat')&&!c.querySelector('.place-chip')),names:cards.map(c=>c.querySelector('.place-logo-card__name')?.textContent?.trim()||''),inside:cards.every(c=>{const r=c.getBoundingClientRect();return r.left>=-2&&r.right<=innerWidth+2&&r.width>=120&&r.height>=170&&r.height<=310})}});
 A(venue.count===2&&venue.minimal&&venue.names.every(Boolean)&&venue.inside,'compact venue logo tiles render',{l,t,w,...venue});
 const pdf=p.locator('button[aria-controls="floating-pdf-panel"]');await S(160);
 const pdfState=await pdf.evaluate(el=>{const s=getComputedStyle(el),svg=el.querySelector('svg'),r=el.getBoundingClientRect();return{opacity:+s.opacity,pointer:s.pointerEvents,color:s.color,bg:s.backgroundColor,svg:svg?getComputedStyle(svg).color:'',visible:r.width>=44&&r.height>=44&&r.bottom>0&&r.top<innerHeight}});
 A(pdfState.opacity>.95&&pdfState.pointer!=='none'&&pdfState.visible,'PDF launcher visible after hero',{l,t,w,...pdfState});
 if(t==='light')A(pdfState.color==='rgb(16, 42, 51)'&&pdfState.svg==='rgb(23, 103, 130)','light PDF launcher readable',{l,w,...pdfState});
 await pdf.click();await S(340);
 const panel=await p.locator('#floating-pdf-panel').evaluate(el=>{const s=getComputedStyle(el),links=[...el.querySelectorAll('a[href$=".pdf"]')],title=el.querySelector('.floating-resources__title'),eye=el.querySelector('.floating-resources__eyebrow');return{opacity:+s.opacity,pointer:s.pointerEvents,links:links.length,title:title?getComputedStyle(title).color:'',eyebrow:eye?getComputedStyle(eye).color:''}});
 A(panel.opacity>.9&&panel.pointer!=='none'&&panel.links===3,'PDF panel opens with three downloads',{l,t,w,...panel});
 if(t==='light')A(panel.title==='rgb(16, 42, 51)'&&panel.eyebrow==='rgb(118, 85, 34)','light PDF panel readable',{l,w,...panel});
 await p.keyboard.press('Escape');await S(100);
 if(l==='en'&&t==='light'&&[390,768].includes(w))await p.screenshot({path:`/tmp/responsive-motion/places-pdf-${w}.png`,fullPage:false});
 const pillars=p.locator('#pillars');await pillars.scrollIntoViewIfNeeded();await S(180);
 if(t==='light'){const pc=await pillars.locator('.dark-feature-card').first().evaluate(el=>{const h=el.querySelector('h3'),q=el.querySelector('p'),s=getComputedStyle(el);return{bg:s.backgroundImage,title:h?getComputedStyle(h).color:'',body:q?getComputedStyle(q).color:''}});A(pc.bg.includes('linear-gradient')&&pc.title==='rgb(16, 42, 51)'&&pc.body==='rgb(82, 103, 107)','light pillars readable',{l,w,...pc});}
 if(l==='en'&&t==='light'&&[390,768].includes(w))await p.screenshot({path:`/tmp/responsive-motion/pillars-${w}.png`,fullPage:false});
 const faq=p.locator('#faq');await faq.scrollIntoViewIfNeeded();await S(220);
 const fm=await faq.evaluate(el=>{const a=[...el.querySelectorAll('.faq-item')].map(x=>{const r=x.getBoundingClientRect(),s=getComputedStyle(x);return{top:r.top,bottom:r.bottom,h:r.height,o:+s.opacity,v:s.visibility,d:s.display}});let maxGap=0;for(let i=1;i<a.length;i++)maxGap=Math.max(maxGap,a[i].top-a[i-1].bottom);return{n:a.length,all:a.every(x=>x.o>.98&&x.v!=='hidden'&&x.d!=='none'&&x.h>60),maxGap}});
 A(fm.n===4&&fm.all&&fm.maxGap<=20,'FAQ has no invisible reveal gaps',{l,t,w,...fm});
 if(l==='en'&&t==='light'&&[390,768].includes(w))await p.screenshot({path:`/tmp/responsive-motion/faq-${w}.png`,fullPage:false});
 A(errs.length===0,'no responsive motion browser errors',{l,t,w,errs});await c.close();
}
for(const[w,h]of[[390,844],[768,1024]]){
 const c=await ctx('en','light',w,h,true),p=await c.newPage();await p.goto(U,{waitUntil:'domcontentloaded',timeout:30000});await S(180);await p.evaluate(()=>scrollTo(0,420));await S(80);
 const m=await p.evaluate(()=>({entry:getComputedStyle(document.querySelector('.site-entry')).display,copy:getComputedStyle(document.querySelector('.hero-copy-scroll')).transform,visual:getComputedStyle(document.querySelector('.hero-visual-scroll .hero-media-frame')).transform}));
 A(m.entry==='none'&&(m.copy==='none'||m.copy==='matrix(1, 0, 0, 1, 0, 0)')&&(m.visual==='none'||m.visual==='matrix(1, 0, 0, 1, 0, 0)'),'reduced motion disables spatial motion',{w,...m});await c.close();
}
await fs.mkdir('/tmp/responsive-motion',{recursive:true});await fs.writeFile('/tmp/responsive-motion/results.json',JSON.stringify({url:U,total:R.length,passed:R.filter(x=>x.ok).length,failed:E.length,checks:R},null,2));if(E.length)process.exitCode=1
}finally{await B.close()}
