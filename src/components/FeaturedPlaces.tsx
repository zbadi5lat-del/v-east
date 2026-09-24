import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowUpRight, Clock3, Globe, Mail, MapPin, Phone, X } from 'lucide-react';
import { PLACE_ASSETS } from '../content';
import { useSiteExperience } from '../siteExperience';
import { SectionHeading } from './SectionHeading';

interface PlaceCardCopy {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  city: string;
  location: string;
  hours: string;
  highlight: string;
  summary: string;
  imageAlt: string;
  tags: readonly string[];
  contacts: readonly (readonly [string, string, string, boolean?])[];
  links: readonly (readonly [string, string, string, boolean?])[];
  note: string;
}

const imageMap = {
  'elite-beach': PLACE_ASSETS.eliteBeach,
  'half-moon': PLACE_ASSETS.halfMoon,
} as const;

function buildMapLink(location: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
}


function linkIcon(href: string) {
  if (href.startsWith('tel:')) return Phone;
  if (href.startsWith('mailto:')) return Mail;
  return Globe;
}

export function FeaturedPlaces() {
  const { copy } = useSiteExperience();
  const c = copy.places;
  const cards = c.cards as readonly PlaceCardCopy[];
  const [activeId, setActiveId] = useState<string | null>(null);
  const activePlace = useMemo(() => cards.find((card) => card.id === activeId) ?? null, [activeId, cards]);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    if (!activePlace) return;
    const previousOverflow = document.body.style.overflow;
    const shell = document.querySelector<HTMLElement>('.site-shell');
    const shellWasInert = shell?.hasAttribute('inert') ?? false;
    document.body.style.overflow = 'hidden';
    if (shell && !shellWasInert) shell.setAttribute('inert', '');
    const frame = requestAnimationFrame(() => {
      dialogRef.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus();
    });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveId(null);
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]:not([disabled])');
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      if (shell && !shellWasInert) shell.removeAttribute('inert');
      window.removeEventListener('keydown', onKeyDown);
      if (activePlace.id) requestAnimationFrame(() => triggerRefs.current[activePlace.id]?.focus());
    };
  }, [activePlace]);

  return (
    <>
      <section id="places" className="relative w-full overflow-hidden border-b border-corp-border-light bg-white py-16 text-corp-dark-text sm:py-20 lg:py-24">
        <div className="section-waterline section-waterline--light" aria-hidden="true" />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-12 px-5 sm:px-8">
          <div className="grid items-end gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-8">
              <SectionHeading
                index="02"
                label={c.label}
                tone="light"
                title={<>{c.titleA}<br /><span className="text-corp-blue">{c.titleB}</span></>}
                description={c.description}
              />
            </div>
            <div data-reveal="up" data-delay="90" className="places-intro-card lg:col-span-4">
              <span className="font-inter block text-[10px] font-bold uppercase tracking-[0.18em] text-corp-blue">{c.countLabel}</span>
              <p className="mt-3 text-sm leading-7 text-corp-muted">{c.helper}</p>
              <div className="mt-4 flex items-center gap-3 text-sm font-semibold text-corp-dark-text">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-corp-blue/10 text-corp-blue" aria-hidden="true"><ArrowUpRight className="h-5 w-5" /></span>
                <span>{c.interactionHint}</span>
              </div>
            </div>
          </div>

          <div className="place-logo-grid mx-auto grid w-full max-w-3xl grid-cols-2 gap-4 sm:gap-6">
            {cards.map((card, index) => (
              <button
                key={card.id}
                ref={(node: HTMLButtonElement | null) => { triggerRefs.current[card.id] = node; }}
                type="button"
                data-reveal="up"
                data-delay={String(index * 80)}
                data-venue-id={card.id}
                aria-haspopup="dialog"
                aria-controls="place-profile-dialog"
                aria-label={`${c.openProfile} ${card.name}`}
                onClick={() => setActiveId(card.id)}
                className="place-card place-logo-card group relative flex min-h-[210px] w-full flex-col items-center justify-center overflow-hidden rounded-[28px] border border-corp-border-light bg-white px-4 py-7 text-center shadow-[0_18px_50px_rgba(7,31,62,0.07)] transition-[transform,border-color,box-shadow,background-color] duration-300 hover:-translate-y-1.5 hover:border-corp-blue/30 hover:shadow-[0_28px_74px_rgba(7,31,62,0.13)] focus-visible:outline-none sm:min-h-[260px] sm:px-7 sm:py-9"
              >
                <span className="place-logo-card__halo" aria-hidden="true" />
                <span className="place-logo-card__ring" aria-hidden="true" />
                <span className="place-logo-card__mark relative z-10 flex h-[104px] w-[104px] items-center justify-center overflow-hidden rounded-[28px] border border-corp-border-light bg-white p-3 shadow-[0_16px_38px_rgba(7,31,62,0.09)] transition-[transform,box-shadow,border-color] duration-300 group-hover:scale-[1.045] group-hover:border-corp-blue/25 group-hover:shadow-[0_22px_48px_rgba(7,31,62,0.13)] sm:h-[148px] sm:w-[148px] sm:rounded-[36px] sm:p-4">
                  <img
                    src={imageMap[card.id as keyof typeof imageMap]}
                    width={180}
                    height={180}
                    alt={card.imageAlt}
                    className="h-full w-full object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                <span className="place-logo-card__name font-cairo relative z-10 mt-5 block text-lg font-black leading-tight text-corp-dark-text sm:mt-6 sm:text-2xl">
                  {card.name}
                </span>
                <span className="place-logo-card__hint font-inter relative z-10 mt-2 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-corp-blue">
                  <span>{c.openProfile}</span>
                  <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {typeof document !== 'undefined' ? createPortal(
      <div
        className={`fixed inset-0 z-[70] transition-opacity duration-300 ${activePlace ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
        aria-hidden={activePlace ? 'false' : 'true'}
      >
        <div className="absolute inset-0 bg-corp-navy-dark/75 backdrop-blur-sm" onClick={() => setActiveId(null)} />
        <div className="relative flex min-h-full items-center justify-center p-4 sm:p-6">
          <div
            id="place-profile-dialog"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={activePlace ? `place-title-${activePlace.id}` : undefined}
            className={`place-dialog-panel relative max-h-[calc(100vh-2rem)] w-full max-w-4xl overflow-y-auto rounded-[28px] border border-corp-border-light bg-white text-corp-dark-text shadow-[0_34px_90px_rgba(0,0,0,0.22)] transition-[transform,opacity] duration-300 ${activePlace ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
          >
            {activePlace ? (
              <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr]">
                <div className="relative overflow-hidden border-b border-corp-border-light bg-corp-light p-6 sm:p-8 lg:border-b-0 lg:border-e">
                  <div className="place-dialog-orb" aria-hidden="true" />
                  <div className="relative z-10 flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="flex h-[76px] w-[76px] items-center justify-center overflow-hidden rounded-[24px] border border-corp-border-light bg-white p-2.5 shadow-[0_18px_38px_rgba(7,31,62,0.10)] sm:h-[108px] sm:w-[108px] sm:rounded-[30px] sm:p-3">
                        <img src={imageMap[activePlace.id as keyof typeof imageMap]} width={180} height={180} alt={activePlace.imageAlt} className="h-full w-full object-contain" decoding="async" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-inter text-[10px] font-bold uppercase tracking-[0.16em] text-corp-blue">{activePlace.category}</span>
                        <h3 id={`place-title-${activePlace.id}`} className="font-cairo mt-2 text-2xl font-black leading-tight text-corp-dark-text sm:text-3xl">{activePlace.name}</h3>
                        <p className="mt-2 text-sm leading-7 text-corp-muted">{activePlace.subtitle}</p>
                      </div>
                    </div>
                    <button type="button" data-autofocus onClick={() => setActiveId(null)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-corp-border-light bg-white text-corp-muted transition-colors duration-200 hover:border-corp-blue/40 hover:text-corp-blue" aria-label={c.closeProfile}><X className="h-5 w-5" /></button>
                  </div>
                  <div className="mt-6 grid gap-3">
                    <div className="place-detail-row"><MapPin aria-hidden="true" className="h-5 w-5 text-corp-blue" /><div><span className="place-detail-row__label">{c.locationLabel}</span><span className="place-detail-row__value">{activePlace.location}</span></div></div>
                    <div className="place-detail-row"><Clock3 aria-hidden="true" className="h-5 w-5 text-corp-blue" /><div><span className="place-detail-row__label">{c.hoursLabel}</span><span className="place-detail-row__value">{activePlace.hours}</span></div></div>
                    <div className="place-detail-row"><Globe aria-hidden="true" className="h-5 w-5 text-corp-blue" /><div><span className="place-detail-row__label">{c.quickFactsLabel}</span><span className="place-detail-row__value">{activePlace.highlight}</span></div></div>
                  </div>
                  <p className="mt-6 rounded-2xl border border-corp-border-light bg-white p-4 text-sm leading-7 text-corp-muted shadow-[0_10px_24px_rgba(7,31,62,0.04)]">{activePlace.note}</p>
                  <div className="mt-6 flex flex-wrap gap-2.5">
                    {activePlace.tags.map((tag) => <span key={tag} className="place-chip">{tag}</span>)}
                  </div>
                </div>
                <div className="flex flex-col gap-6 p-6 sm:p-8">
                  <div>
                    <span className="font-inter text-[10px] font-bold uppercase tracking-[0.16em] text-corp-blue">{c.contactPointsLabel}</span>
                    <div className="mt-4 grid gap-3">
                      {activePlace.contacts.map(([label, value, href, mono]) => { const Icon = linkIcon(href); return (
                        <a key={`${activePlace.id}-${label}-${value}`} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined} className="place-contact-link">
                          <span className="place-contact-link__icon"><Icon aria-hidden="true" className="h-4 w-4" /></span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-xs text-corp-muted">{label}</span>
                            <span dir={mono ? 'ltr' : undefined} className="mt-1 block text-sm font-bold text-corp-dark-text">{value}</span>
                          </span>
                          <ArrowUpRight aria-hidden="true" className="h-4 w-4 text-corp-blue" />
                        </a>
                      )})}
                    </div>
                  </div>
                  <div>
                    <span className="font-inter text-[10px] font-bold uppercase tracking-[0.16em] text-corp-blue">{c.directLinksLabel}</span>
                    <div className="mt-4 grid gap-3">
                      <a href={buildMapLink(activePlace.location)} target="_blank" rel="noopener noreferrer" className="place-contact-link">
                        <span className="place-contact-link__icon"><MapPin aria-hidden="true" className="h-4 w-4" /></span>
                        <span className="min-w-0 flex-1"><span className="block text-xs text-corp-muted">{c.mapsLabel}</span><span className="mt-1 block text-sm font-bold text-corp-dark-text">{activePlace.city}</span></span>
                        <ArrowUpRight aria-hidden="true" className="h-4 w-4 text-corp-blue" />
                      </a>
                      {activePlace.links.map(([label, value, href, mono]) => (
                        <a key={`${activePlace.id}-${label}-${value}`} href={href} target="_blank" rel="noopener noreferrer" className="place-contact-link">
                          <span className="place-contact-link__icon"><Globe aria-hidden="true" className="h-4 w-4" /></span>
                          <span className="min-w-0 flex-1"><span className="block text-xs text-corp-muted">{label}</span><span dir={mono ? 'ltr' : undefined} className="mt-1 block break-all text-sm font-bold text-corp-dark-text">{value}</span></span>
                          <ArrowUpRight aria-hidden="true" className="h-4 w-4 text-corp-blue" />
                        </a>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-[24px] border border-corp-border-light bg-corp-light p-5">
                    <span className="font-inter text-[10px] font-bold uppercase tracking-[0.16em] text-corp-blue">{c.profileSummaryLabel}</span>
                    <p className="mt-3 text-sm leading-7 text-corp-muted">{activePlace.summary}</p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>,
        document.body,
      ) : null}
    </>
  );
}
