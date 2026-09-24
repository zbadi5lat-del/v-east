import type { ReactNode } from 'react';
import { useSiteExperience } from '../siteExperience';

interface SectionHeadingProps {
  index: string;
  label: string;
  title: ReactNode;
  description?: string;
  tone?: 'dark' | 'light';
  align?: 'start' | 'center';
}

export function SectionHeading({ index, label, title, description, tone = 'dark', align = 'start' }: SectionHeadingProps) {
  const { language } = useSiteExperience();
  const light = tone === 'light';
  return (
    <div data-reveal="up" className={`section-heading ${light ? 'section-heading--light-surface' : 'section-heading--dark-surface'} ${align === 'center' ? 'items-center text-center' : 'items-start text-start'}`}>
      <div className="section-kicker" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <span className="section-kicker__index" dir="ltr">{index}</span>
        <span className="section-kicker__line" aria-hidden="true" />
        <span>{label}</span>
      </div>
      <h2 className={`font-cairo section-heading__title ${light ? 'text-corp-dark-text' : 'text-white'}`}>{title}</h2>
      {description ? <p className={`section-heading__description ${light ? 'text-corp-muted' : 'text-slate-300'}`}>{description}</p> : null}
    </div>
  );
}
