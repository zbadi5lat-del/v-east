import { ClipboardCheck, Gauge, Radar, ShieldCheck } from 'lucide-react';
import { useSiteExperience } from '../siteExperience';
import { SectionHeading } from './SectionHeading';

const icons = [ShieldCheck, Gauge, Radar, ClipboardCheck] as const;
export function OperatingPillars() {
  const { copy } = useSiteExperience(); const c = copy.pillars;
  return <section id="pillars" className="relative w-full overflow-hidden border-b border-corp-border/40 bg-corp-navy py-16 sm:py-20 lg:py-28"><div className="section-waterline" aria-hidden="true" /><div className="relative mx-auto flex max-w-7xl flex-col gap-12 px-5 sm:px-8"><SectionHeading index="04" label={c.label} title={<>{c.titleA}<br /><span className="text-corp-sand">{c.titleB}</span></>} description={c.description} /><div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">{c.items.map(([title, detail], index) => { const Icon=icons[index]; return <article key={`pillar-${index}`} data-reveal="up" data-delay={String(index*70)} className="dark-feature-card group relative flex min-h-[220px] flex-col justify-between overflow-hidden p-6 sm:p-7"><div className="flex items-start justify-between gap-4"><span className="feature-icon" aria-hidden="true"><Icon className="h-5 w-5" /></span><span dir="ltr" className="font-inter text-sm font-black tracking-widest text-corp-sand/80">{String(index+1).padStart(2,'0')}</span></div><div className="relative z-10 mt-10"><h3 className="font-cairo text-xl font-black text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-300">{detail}</p></div><span className="feature-card-line" aria-hidden="true" /></article>})}</div></div></section>;
}
