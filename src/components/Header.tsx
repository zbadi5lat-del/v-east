import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Menu, X } from 'lucide-react';
import { ASSETS } from '../content';
import { useSiteExperience } from '../siteExperience';
import { ExperienceControls, ThemeSceneToggle } from './ExperienceControls';

interface HeaderProps { onNavigateToContact: () => void; }

function focusMobileNavigationToggle(){requestAnimationFrame(()=>document.getElementById('mobile-navigation-toggle')?.focus());}

export function Header({onNavigateToContact}:HeaderProps){
  const {copy,language}=useSiteExperience();
  const [open,setOpen]=useState(false); const [scrolled,setScrolled]=useState(false); const [activeSection,setActiveSection]=useState('#hero');
  const desktopNavRef=useRef<HTMLElement | null>(null);
  const [navPill,setNavPill]=useState({x:0,width:0,visible:false});
  const desktopNavItems=useMemo(()=>[["#hero",copy.nav.home],["#about",copy.nav.about],["#services",copy.nav.services],["#sectors",copy.nav.sectors],["#operating-system",copy.nav.system],["#field-operations",copy.nav.field],["#leadership",copy.nav.leadership]] as const,[copy]);
  const desktopActiveSection=activeSection==='#pillars'?'#about':activeSection==='#why-veast'||activeSection==='#faq'?'#leadership':activeSection;
  const mobileNavItems=useMemo(()=>[["#hero",copy.nav.home],["#about",copy.nav.about],["#pillars",copy.nav.pillars],["#services",copy.nav.services],["#sectors",copy.nav.sectors],["#operating-system",copy.nav.system],["#field-operations",copy.nav.field],["#why-veast",copy.nav.why],["#leadership",copy.nav.leadership],["#faq",copy.nav.faq]] as const,[copy]);
  useEffect(()=>{const onScroll=()=>setScrolled(window.scrollY>18); onScroll(); window.addEventListener('scroll',onScroll,{passive:true}); return()=>window.removeEventListener('scroll',onScroll)},[]);
  useEffect(()=>{const sections=mobileNavItems.map(([href])=>document.getElementById(href.slice(1))).filter((section):section is HTMLElement=>Boolean(section)); if(!sections.length||!('IntersectionObserver'in window))return; const observer=new IntersectionObserver(entries=>{const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0]; if(visible?.target.id)setActiveSection(`#${visible.target.id}`)},{rootMargin:'-18% 0px -64% 0px',threshold:[0.05,0.2,0.5]}); sections.forEach(s=>observer.observe(s)); return()=>observer.disconnect()},[mobileNavItems]);
  useLayoutEffect(()=>{
    let cancelled=false; let frame=0;
    const measure=()=>{
      const nav=desktopNavRef.current;
      const active=nav?.querySelector<HTMLElement>(`[data-nav-target="${desktopActiveSection}"]`);
      if(!nav||!active){setNavPill(value=>value.visible?{...value,visible:false}:value);return}
      setNavPill({x:active.offsetLeft,width:active.offsetWidth,visible:true});
    };
    const schedule=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(measure)};
    schedule(); window.addEventListener('resize',schedule,{passive:true});
    document.fonts?.ready.then(()=>{if(!cancelled)schedule()});
    return()=>{cancelled=true;cancelAnimationFrame(frame);window.removeEventListener('resize',schedule)};
  },[desktopActiveSection,language,desktopNavItems]);
  useEffect(()=>{const previous=document.body.style.overflow; document.body.style.overflow=open?'hidden':previous; return()=>{document.body.style.overflow=previous}},[open]);
  useEffect(()=>{if(!open)return; document.getElementById('mobile-navigation-close')?.focus(); const onKeyDown=(event:KeyboardEvent)=>{if(event.key==='Escape'){setOpen(false);focusMobileNavigationToggle();return} if(event.key!=='Tab')return; const drawer=document.getElementById('mobile-navigation'); const focusable=drawer?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'); if(!focusable?.length)return; const first=focusable[0],last=focusable[focusable.length-1]; if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}}; window.addEventListener('keydown',onKeyDown); return()=>window.removeEventListener('keydown',onKeyDown)},[open]);
  useEffect(()=>{setOpen(false)},[language]);
  const closeDrawer=(returnFocus=false)=>{setOpen(false);if(returnFocus)focusMobileNavigationToggle()};
  return <>
    <header className={`site-header sticky top-0 z-40 w-full border-b transition-[background-color,border-color,box-shadow] duration-300 ${scrolled?'is-scrolled border-corp-border/80 bg-corp-navy-dark/95 shadow-[0_12px_34px_rgba(0,0,0,0.18)] backdrop-blur-xl':'border-corp-border/40 bg-corp-navy/90 backdrop-blur-lg'}`}>
      <div className={`mx-auto flex max-w-[90rem] items-center justify-between gap-3 px-5 transition-[height] duration-300 sm:px-8 ${scrolled?'h-[72px]':'h-20'}`}>
        <div className="flex min-w-0 items-center gap-3">
          <button type="button" id="mobile-navigation-toggle" className="header-icon-button -ms-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-transparent text-white transition-[background-color,border-color,color,transform] duration-200 active:scale-95 xl:hidden" aria-label={copy.common.openMenu} aria-expanded={open} aria-controls="mobile-navigation" onClick={()=>setOpen(true)}><Menu aria-hidden="true" className="h-6 w-6"/></button>
          <a href="#hero" aria-label={copy.common.homeLabel} className="group flex min-w-0 items-center gap-3"><div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white p-0.5 shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5"><img src={ASSETS.logo} width={1079} height={1077} alt={copy.common.logoAlt} className="h-full w-full object-contain"/></div><div className="flex min-w-0 flex-col"><span className="font-cairo text-[22px] font-black leading-none tracking-wide text-white sm:text-2xl" dir="ltr">V.EAST</span><span className="font-inter mt-1 hidden text-[9px] font-semibold uppercase tracking-[0.15em] text-corp-sand sm:block xl:hidden 2xl:block">{copy.common.descriptor}</span></div></a>
        </div>
        <nav ref={desktopNavRef} className="desktop-nav-track relative isolate hidden items-center gap-0.5 rounded-2xl p-1 xl:flex" aria-label={copy.common.mainNav}>
          <span className="desktop-nav-pill" aria-hidden="true" style={{transform:`translateX(${navPill.x}px) scaleX(${Math.max(navPill.width,1)})`,opacity:navPill.visible?1:0}}/>
          {desktopNavItems.map(([href,label])=>{const active=desktopActiveSection===href; return <a key={href} data-nav-target={href} href={href} aria-current={active?'location':undefined} className={`nav-link relative z-10 flex min-h-11 items-center whitespace-nowrap rounded-xl px-3 text-[13px] font-semibold transition-colors 2xl:text-sm ${active?'text-white':'text-slate-300 hover:text-white'}`}>{label}</a>})}
        </nav>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="hidden md:block xl:hidden"><ThemeSceneToggle compact/></div>
          <div className="hidden xl:block"><ExperienceControls compact/></div>
          <div className="md:hidden"><ThemeSceneToggle compact/></div>
        </div>
      </div>
    </header>
    <div className={`mobile-drawer-overlay fixed inset-0 z-50 bg-corp-navy-dark/80 backdrop-blur-sm transition-opacity duration-300 xl:hidden ${open?'pointer-events-auto opacity-100':'pointer-events-none opacity-0'}`} aria-hidden="true" onClick={()=>closeDrawer(true)}/>
    <aside id="mobile-navigation" className={`mobile-navigation-drawer fixed top-0 z-[60] flex h-dvh w-[340px] max-w-[90vw] flex-col border-s border-corp-border bg-corp-navy-dark shadow-2xl transition-transform duration-300 xl:hidden ${open?'is-open':'is-closed'}`} aria-hidden={!open} inert={!open} role="dialog" aria-modal="true" aria-label={copy.common.navDialog}>
      <div className="flex h-20 items-center justify-between border-b border-corp-border px-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white p-0.5"><img src={ASSETS.logo} width={1079} height={1077} alt="" className="h-full w-full object-contain"/></div><div><span className="font-cairo block text-xl font-black tracking-wider text-white" dir="ltr">V.EAST</span><span className="font-inter text-[9px] font-bold uppercase tracking-[0.15em] text-corp-sand">{copy.common.operations}</span></div></div><button id="mobile-navigation-close" type="button" onClick={()=>{setOpen(false);focusMobileNavigationToggle()}} aria-label={copy.common.closeMenu} className="header-icon-button flex h-11 w-11 items-center justify-center rounded-xl border border-corp-border text-slate-300 transition-colors"><X aria-hidden="true" className="h-6 w-6"/></button></div>
      <div className="border-b border-corp-border px-5 py-4"><p className="text-sm leading-relaxed text-slate-300">{copy.nav.drawerIntro}</p><div className="mt-4"><span className="font-inter mb-2 block text-[9px] font-bold uppercase tracking-[0.15em] text-corp-sand">{copy.common.displaySettings}</span><ExperienceControls/></div></div>
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-4 text-sm font-medium" aria-label={copy.common.mobileNav}>{mobileNavItems.map(([href,label])=>{const active=activeSection===href; return <a key={href} href={href} onClick={()=>closeDrawer(true)} aria-current={active?'location':undefined} className={`flex min-h-12 items-center justify-between rounded-xl px-4 py-3 transition-colors ${active?'bg-corp-navy-light text-white':'text-slate-200 hover:bg-corp-navy-light/70'}`}><span>{label}</span><ArrowLeft aria-hidden="true" className={`h-4 w-4 ${language==='en'?'rotate-180':''} ${active?'text-corp-sea':'text-corp-muted'}`}/></a>})}</nav>
      <div className="border-t border-corp-border p-5"><button type="button" onClick={()=>{setOpen(false);onNavigateToContact()}} className="btn-primary font-cairo flex h-12 w-full items-center justify-center gap-2 text-sm font-bold"><span>{copy.common.contactCta}</span><ArrowLeft aria-hidden="true" className={`h-[18px] w-[18px] ${language==='en'?'rotate-180':''}`}/></button></div>
    </aside>
  </>;
}
