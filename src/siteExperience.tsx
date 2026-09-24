import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { COPY, type Language, type ThemeMode } from './i18n';

interface SiteExperienceValue {
  language: Language;
  setLanguage: (language: Language) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  copy: (typeof COPY)[Language];
}

const SiteExperienceContext = createContext<SiteExperienceValue | null>(null);

function readLanguage(): Language {
  if (typeof window === 'undefined') return 'ar';
  const saved = window.localStorage.getItem('veast-language');
  if (saved === 'ar' || saved === 'en') return saved;
  return document.documentElement.lang === 'en' ? 'en' : 'ar';
}

function readTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'dark';
  const saved = window.localStorage.getItem('veast-theme');
  if (saved === 'dark' || saved === 'light') return saved;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function setMeta(selector: string, value: string) {
  document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', value);
}

export function SiteExperienceProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(readLanguage);
  const [theme, setThemeState] = useState<ThemeMode>(readTheme);
  const copy = COPY[language];

  useEffect(() => {
    const root = document.documentElement;
    root.lang = language;
    root.dir = language === 'ar' ? 'rtl' : 'ltr';
    root.dataset.language = language;
    window.localStorage.setItem('veast-language', language);
    document.title = copy.meta.title;
    setMeta('meta[name="description"]', copy.meta.description);
    setMeta('meta[property="og:title"]', copy.meta.title);
    setMeta('meta[property="og:description"]', copy.meta.description);
    setMeta('meta[property="og:locale"]', copy.meta.locale);
    setMeta('meta[property="og:image:alt"]', copy.meta.imageAlt);
    setMeta('meta[name="twitter:title"]', copy.meta.title);
    setMeta('meta[name="twitter:description"]', copy.meta.description);
    setMeta('meta[name="twitter:image:alt"]', copy.meta.imageAlt);
    const schema = document.getElementById('veast-organization-schema');
    if (schema?.textContent) {
      try {
        const data = JSON.parse(schema.textContent) as Record<string, unknown>;
        data.description = copy.meta.schemaDescription;
        data.inLanguage = language;
        schema.textContent = JSON.stringify(data);
      } catch {
        // Keep the valid server-delivered schema if a browser extension mutates it unexpectedly.
      }
    }
  }, [copy, language]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    window.localStorage.setItem('veast-theme', theme);
    setMeta('meta[name="theme-color"]', theme === 'dark' ? '#0B2936' : '#F4F1EA');
  }, [theme]);

  const setLanguage = (next: Language) => setLanguageState(next);
  const setTheme = (next: ThemeMode) => setThemeState(next);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const documentWithTransition = document as Document & { startViewTransition?: (callback: () => void) => unknown };
    if (!reduced && documentWithTransition.startViewTransition) {
      documentWithTransition.startViewTransition(() => setThemeState(next));
    } else {
      setThemeState(next);
    }
  };

  const value = useMemo(() => ({ language, setLanguage, theme, setTheme, toggleTheme, copy }), [language, theme, copy]);
  return <SiteExperienceContext.Provider value={value}>{children}</SiteExperienceContext.Provider>;
}

export function useSiteExperience() {
  const value = useContext(SiteExperienceContext);
  if (!value) throw new Error('useSiteExperience must be used inside SiteExperienceProvider');
  return value;
}
