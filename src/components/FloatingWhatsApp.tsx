import { useEffect, useMemo, useState } from 'react';
import { Download, FileText, MessageCircle, X } from 'lucide-react';
import { BRAND, FACILITIES, PDF_RESOURCES, type FacilityType } from '../content';
import { useSiteExperience } from '../siteExperience';

interface FloatingWhatsAppProps { selectedFacility: FacilityType | null; }

export function FloatingWhatsApp({selectedFacility}:FloatingWhatsAppProps){
  const [visible,setVisible]=useState(false);
  const [resourcesOpen,setResourcesOpen]=useState(false);
  const resourcesVisible=visible&&resourcesOpen;
  const {copy}=useSiteExperience();
  const facilityIndex=selectedFacility?FACILITIES.indexOf(selectedFacility):-1;
  const label=facilityIndex>=0?copy.facilities[facilityIndex]:null;
  const whatsappUrl=useMemo(()=>{
    const c=copy.contact;
    const message=label?`${c.facilityMessagePrefix} ${label} ${c.facilityMessageSuffix}`:c.defaultMessage;
    return `https://wa.me/${BRAND.whatsappInternational}?text=${encodeURIComponent(message)}`;
  },[copy,label]);

  useEffect(()=>{
    const heroCta=document.getElementById('hero-primary-cta');
    const contact=document.getElementById('contact-section');
    if(!heroCta)return;
    let heroPassed=false,contactVisible=false;
    const update=()=>setVisible(heroPassed&&!contactVisible);
    const heroObserver=new IntersectionObserver(([entry])=>{if(entry){heroPassed=!entry.isIntersecting&&entry.boundingClientRect.top<0;update()}},{threshold:0.1});
    const contactObserver=contact?new IntersectionObserver(([entry])=>{contactVisible=Boolean(entry?.isIntersecting);update()},{threshold:0.15}):null;
    heroObserver.observe(heroCta); if(contact&&contactObserver)contactObserver.observe(contact);
    return()=>{heroObserver.disconnect();contactObserver?.disconnect()};
  },[]);

  useEffect(()=>{ if(!visible) setResourcesOpen(false); },[visible]);
  useEffect(()=>{
    if(!resourcesOpen)return;
    const onKeyDown=(event:KeyboardEvent)=>{if(event.key==='Escape')setResourcesOpen(false)};
    window.addEventListener('keydown',onKeyDown);
    return()=>window.removeEventListener('keydown',onKeyDown);
  },[resourcesOpen]);

  return <>
    <div className={`floating-resources pointer-events-none fixed bottom-[max(18px,env(safe-area-inset-bottom))] [inset-inline-start:18px] z-40 flex flex-col items-start gap-3 transition-[opacity,transform] duration-300 ${visible?'translate-y-0 opacity-100':'translate-y-4 opacity-0'}`}>
      <section id="floating-pdf-panel" className={`floating-resources__panel ${resourcesVisible?'is-open pointer-events-auto':'is-closed pointer-events-none'}`} aria-label={copy.resources.panelLabel} aria-hidden={!resourcesVisible} inert={!resourcesVisible}>
        <div className="floating-resources__panel-head">
          <div><span className="floating-resources__eyebrow">PDF LIBRARY</span><strong className="floating-resources__title">{copy.resources.title}</strong></div>
          <button type="button" onClick={()=>setResourcesOpen(false)} className="floating-resources__close" aria-label={copy.resources.close}><X aria-hidden="true" className="h-4 w-4"/></button>
        </div>
        <p className="floating-resources__description">{copy.resources.description}</p>
        <div className="floating-resources__list">
          {PDF_RESOURCES.map((resource,index)=>{
            const [name,description]=copy.resources.items[index];
            return <a key={resource.id} href={resource.href} download className="floating-resources__action">
              <span className="floating-resources__icon"><FileText aria-hidden="true" className="h-4 w-4"/></span>
              <span className="floating-resources__content"><strong>{name}</strong><small>{description}</small></span>
              <Download aria-hidden="true" className="floating-resources__download h-4 w-4"/>
              <span className="sr-only">{copy.resources.download}</span>
            </a>;
          })}
        </div>
      </section>
      <button type="button" aria-expanded={resourcesOpen} aria-controls="floating-pdf-panel" aria-label={copy.resources.cta} onClick={()=>setResourcesOpen(value=>!value)} className={`floating-contact floating-contact--resources flex h-14 min-w-14 items-center justify-center gap-2 rounded-2xl px-4 text-white ${visible?'pointer-events-auto':'pointer-events-none'}`}>
        <FileText aria-hidden="true" className="h-6 w-6"/>
        <span className="floating-contact__label text-sm font-bold">{copy.resources.cta}</span>
      </button>
    </div>
    <a aria-label={copy.contact.whatsappDefault} className={`floating-contact fixed bottom-[max(18px,env(safe-area-inset-bottom))] [inset-inline-end:18px] z-40 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-corp-blue text-white shadow-[0_16px_40px_rgba(0,0,0,0.28)] transition-[opacity,transform] duration-300 hover:-translate-y-1 focus-visible:outline-none ${visible?'pointer-events-auto translate-y-0 opacity-100':'pointer-events-none translate-y-4 opacity-0'}`} href={whatsappUrl} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden="true" className="h-7 w-7"/></a>
  </>;
}
