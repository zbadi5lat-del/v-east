import { CheckCircle2 } from 'lucide-react';
import { ASSETS } from '../content';
import { useSiteExperience } from '../siteExperience';
import { SectionHeading } from './SectionHeading';

export function About() {
  const { copy } = useSiteExperience();
  const c = copy.about;
  return (
    <section id="about" className="relative w-full overflow-hidden border-b border-corp-border-light bg-corp-light py-16 text-corp-dark-text sm:py-20 lg:py-28">
      <div className="section-waterline section-waterline--light" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="flex flex-col gap-7 lg:col-span-7">
            <SectionHeading index="03" label={c.label} tone="light" title={<>{c.titleA}<br /><span className="text-corp-blue">{c.titleB}</span></>} description={c.description} />
            <div data-reveal="up" data-delay="90" className="grid gap-3 sm:grid-cols-3">
              {c.principles.map((item) => <div key={item} className="light-proof-card flex items-start gap-3"><CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-corp-blue" /><span className="text-sm font-bold leading-6 text-corp-dark-text">{item}</span></div>)}
            </div>
            <div data-reveal="up" data-delay="150" className="brand-statement relative overflow-hidden rounded-2xl border border-corp-border-light bg-white p-5 shadow-[0_18px_45px_rgba(7,31,62,0.08)] sm:p-6">
              <span className="brand-statement__edge absolute inset-block-0 inset-inline-start-0 w-1 bg-corp-blue" aria-hidden="true" />
              <span className="font-cairo text-base font-black leading-7 text-corp-navy sm:text-lg">{c.statement}</span>
              <span className="font-inter mt-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-corp-muted">{c.statementLabel}</span>
            </div>
          </div>
          <div data-reveal="image" className="relative lg:col-span-5">
            <div className="relative overflow-hidden rounded-[28px] border border-corp-border-light bg-white p-2.5 shadow-[0_30px_70px_rgba(7,31,62,0.14)]">
              <div className="relative overflow-hidden rounded-[20px] bg-corp-light">
                <img src={ASSETS.portfolio} width={1306} height={1204} alt={c.portfolioAlt} className="h-auto w-full object-cover" loading="lazy" decoding="async" />
                <div className="media-overlay absolute inset-x-0 bottom-0 bg-gradient-to-t from-corp-navy-dark/85 to-transparent px-5 pb-5 pt-16 text-white">
                  <span className="font-inter block text-[9px] font-bold uppercase tracking-[0.17em] text-corp-sand">{c.frameworkLabel}</span>
                  <span className="font-cairo mt-1 block text-sm font-bold">{c.frameworkText}</span>
                </div>
              </div>
              <div className="font-inter flex items-center justify-between gap-3 px-2 pb-1 pt-3 text-[10px] text-corp-muted sm:text-xs"><span>{c.systemLabel}</span><span className="font-bold text-corp-navy">V.EAST • {copy.common.descriptor}</span></div>
            </div>
            <div className="about-accent-card absolute -bottom-5 hidden rounded-2xl border border-corp-border-light bg-white px-4 py-3 shadow-xl sm:block [inset-inline-start:-0.5rem]">
              <span className="font-inter block text-[9px] font-bold uppercase tracking-[0.16em] text-corp-blue">{c.planLabel}</span>
              <span className="font-cairo mt-1 block text-xs font-bold text-corp-navy">{c.planText}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
