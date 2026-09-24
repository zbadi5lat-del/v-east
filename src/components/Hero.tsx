import { ArrowDown, ArrowLeft, ClipboardCheck, ShieldCheck, UsersRound, Waves } from 'lucide-react';
import { ASSETS } from '../content';
import { useSiteExperience } from '../siteExperience';

interface HeroProps { onPrimaryCtaClick: () => void; }
const icons=[UsersRound,ClipboardCheck,ShieldCheck,Waves] as const;

export function Hero({ onPrimaryCtaClick }: HeroProps) {
  const { copy, language } = useSiteExperience();
  const c = copy.hero;
  return (
    <section id="hero" className="hero-section relative w-full overflow-hidden border-b border-corp-border/40 bg-corp-navy">
      <div className="hero-operations-grid" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-12 sm:px-8 sm:pt-16 lg:pb-24 lg:pt-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-12">
          <div className="relative z-10 flex flex-col gap-6 lg:col-span-7">
            <div className="hero-enter hero-enter--1 inline-flex w-fit items-center gap-2.5 rounded-full border border-corp-border bg-corp-navy-dark/70 px-3.5 py-2 backdrop-blur-sm">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-corp-blue" aria-hidden="true" />
              <span className="font-cairo text-xs font-bold tracking-wide text-white">{c.eyebrow}</span>
              <span className="font-inter text-[10px] font-bold uppercase tracking-[0.16em] text-corp-sand" dir="ltr">V.EAST</span>
            </div>
            <div className="hero-enter hero-enter--2 flex flex-col gap-5">
              <h1 className="font-cairo max-w-[760px] text-[clamp(2.55rem,7vw,4.25rem)] font-black leading-[1.16] tracking-[-0.025em] text-white">
                {c.title[0]}<br />{c.title[1]}<br /><span className="hero-highlight">{c.title[2]}</span>
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-300 sm:text-xl sm:leading-9">{c.description}</p>
            </div>
            <div className="hero-enter hero-enter--3 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <button id="hero-primary-cta" type="button" onClick={onPrimaryCtaClick} className="btn-primary group font-cairo flex h-[52px] min-h-[52px] items-center justify-center gap-2.5 px-7 text-base font-bold sm:px-8">
                <span>{copy.common.contactCta}</span><ArrowLeft aria-hidden="true" className={`directional-icon h-5 w-5 transition-transform duration-200 ${language==='en'?'rotate-180':''}`} />
              </button>
              <a href="#operating-system" className="btn-secondary group flex min-h-[52px] items-center justify-center gap-2 px-5 text-sm font-bold text-white sm:text-base"><span>{c.secondaryCta}</span><ArrowDown aria-hidden="true" className="h-5 w-5 text-corp-sea transition-transform duration-200 group-hover:translate-y-1" /></a>
            </div>
            <div className="hero-enter hero-enter--4 grid grid-cols-2 gap-2.5 pt-1 sm:grid-cols-4">
              {c.scope.map(([label,value],index)=>{const Icon=icons[index]; return <div className="hero-scope-card" key={label}><div className="flex items-center gap-2 text-corp-sand"><Icon aria-hidden="true" className="h-4 w-4 shrink-0"/><span className="font-inter truncate text-[9px] font-bold uppercase tracking-[0.13em]">{label}</span></div><span className="mt-2 block text-[13px] font-bold leading-5 text-white sm:text-sm">{value}</span></div>})}
            </div>
          </div>
          <div className="hero-enter hero-enter--visual relative lg:col-span-5">
            <div className="hero-media-frame relative mx-auto w-full max-w-[560px] lg:ms-auto">
              <div className="hero-media-main relative overflow-hidden rounded-[28px] border border-white/10 bg-corp-navy-dark shadow-[0_34px_90px_rgba(0,0,0,0.28)]">
                <img src={ASSETS.hero} width={925} height={525} alt={c.heroAlt} className="h-[320px] w-full object-cover sm:h-[410px] lg:h-[455px]" fetchPriority="high" decoding="async" />
                <div className="media-shade absolute inset-0 bg-gradient-to-t from-corp-navy-dark via-corp-navy-dark/5 to-transparent" aria-hidden="true" />
                <div className="media-overlay absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 sm:p-6"><div><span className="font-inter block text-[10px] font-bold uppercase tracking-[0.18em] text-corp-sand">{c.identityLabel}</span><span className="font-cairo mt-1 block text-base font-bold text-white sm:text-lg">{c.identityText}</span></div><span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-corp-navy-dark/70 sm:flex" aria-hidden="true"><ShieldCheck className="h-5 w-5 text-corp-sea"/></span></div>
              </div>
              <div className="hero-field-card absolute -bottom-7 flex w-[78%] max-w-[330px] items-center gap-3 rounded-2xl border border-corp-border bg-corp-navy-light/95 p-3.5 shadow-2xl backdrop-blur-lg [inset-inline-end:0.75rem] sm:[inset-inline-end:1.5rem]">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-corp-navy sm:h-[72px] sm:w-[72px]"><img src={ASSETS.heroField} width={760} height={1024} alt={c.fieldAlt} className="h-full w-full object-cover" decoding="async"/></div>
                <div className="flex min-w-0 flex-col"><span className="font-inter text-[9px] font-bold uppercase tracking-[0.16em] text-corp-sand">{c.fieldLabel}</span><span className="font-cairo mt-0.5 text-sm font-bold text-white sm:text-base">{c.fieldTitle}</span><span className="mt-1 text-xs leading-5 text-slate-300">{c.fieldText}</span></div>
              </div>
              <div className="hero-status-card absolute top-6 hidden items-center gap-2 rounded-xl border border-white/10 bg-corp-navy-dark/90 px-3.5 py-2.5 shadow-xl backdrop-blur-lg sm:flex [inset-inline-start:-0.5rem] lg:[inset-inline-start:-1.25rem]"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-corp-blue/15" aria-hidden="true"><Waves className="h-4 w-4 text-corp-sea"/></span><div><span className="font-inter block text-[9px] font-bold uppercase tracking-[0.14em] text-corp-sand">{c.sectorLabel}</span><span className="block text-xs font-bold text-white">{c.statusText}</span></div></div>
            </div>
          </div>
        </div>
        <div className="hero-enter hero-enter--5 mt-16 flex items-center gap-4 border-t border-corp-border/60 pt-5 lg:mt-20"><span className="font-inter shrink-0 text-[9px] font-bold uppercase tracking-[0.18em] text-corp-sand">{copy.common.descriptor}</span><span className="h-px flex-1 bg-corp-border/70" aria-hidden="true"/><span className="font-cairo text-xs font-bold text-slate-300 sm:text-sm">{c.footerLine}</span></div>
      </div>
    </section>
  );
}
