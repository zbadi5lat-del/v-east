export const BRAND = {
  name: 'V.EAST',
  descriptor: 'SPORTS & TOURISM OPERATIONS',
  phonePrimary: '01280033504',
  phoneSecondary: '01061950609',
  whatsappInternational: '201280033504',
  email: 'v.east000@gmail.com',
  facebook: 'https://www.facebook.com/share/19ug4WksNo/',
  instagram: 'https://www.instagram.com/v_east_?stkn=aXJmODB3OGUzNmJh',
  tiktok: 'https://www.tiktok.com/@v_east.company?_r=1&_t=ZS-99ltjg8knFS',
} as const;

export const ASSETS = {
  logo: '/assets/veast-logo.webp',
  hero: '/assets/office-wall-brand.webp',
  heroField: '/assets/hero-field.webp',
  portfolio: '/assets/operations-portfolio.webp',
  fieldReadiness: '/assets/field-team-01.webp',
  fieldTeam: '/assets/field-team-02.webp',
  fieldIdentity: '/assets/uniform-brand.webp',
} as const;


export const PLACE_ASSETS = {
  eliteBeach: '/assets/elite-beach-logo.webp',
  halfMoon: '/assets/half-moon-profile.webp',
} as const;


export const PDF_RESOURCES = [
  { id: 'company-profile', href: '/downloads/V-EAST-Company-Profile.pdf' },
  { id: 'services-operations', href: '/downloads/V-EAST-Services-Operations.pdf' },
  { id: 'portfolio-featured-venues', href: '/downloads/V-EAST-Portfolio-Featured-Venues.pdf' },
] as const;

export const SERVICES = [
  'sports-facility-operations',
  'aquatic-operations',
  'rescue-teams',
  'first-aid-safety',
  'emergency-planning',
  'field-supervision',
] as const;

export const FACILITIES = [
  'resort',
  'sports-club',
  'hotel',
  'swimming-pool',
  'aqua-park',
  'private-beach',
  'other',
] as const;

export type FacilityType = (typeof FACILITIES)[number];
