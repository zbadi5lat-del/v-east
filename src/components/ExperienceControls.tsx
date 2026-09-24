import { MoonStar, Sun } from 'lucide-react';
import { useSiteExperience } from '../siteExperience';

export function ThemeSceneToggle({ compact = false }: { compact?: boolean }) {
  const { theme, toggleTheme, copy } = useSiteExperience();
  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? copy.common.switchToLight : copy.common.switchToDark}
      title={isDark ? copy.common.switchToLight : copy.common.switchToDark}
      onClick={toggleTheme}
      className={`theme-scene-toggle ${isDark ? 'is-dark' : 'is-light'} ${compact ? 'theme-scene-toggle--compact' : ''}`}
    >
      <span className="theme-scene-toggle__stars" aria-hidden="true"><i /><i /><i /></span>
      <span className="theme-scene-toggle__clouds" aria-hidden="true"><i /><i /></span>
      <span className="theme-scene-toggle__water" aria-hidden="true" />
      <span className="theme-scene-toggle__orb" aria-hidden="true">
        <Sun className="theme-scene-toggle__sun" />
        <MoonStar className="theme-scene-toggle__moon" />
      </span>
      <span className="sr-only">{isDark ? copy.common.themeDark : copy.common.themeLight}</span>
    </button>
  );
}

export function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage, copy } = useSiteExperience();
  return (
    <div className={`language-toggle ${compact ? 'language-toggle--compact' : ''}`} role="group" aria-label={copy.common.language}>
      <button type="button" aria-label={copy.common.arabic} title={copy.common.arabic} aria-pressed={language === 'ar'} onClick={() => setLanguage('ar')} className={language === 'ar' ? 'is-active' : ''}>AR</button>
      <button type="button" aria-label={copy.common.english} title={copy.common.english} aria-pressed={language === 'en'} onClick={() => setLanguage('en')} className={language === 'en' ? 'is-active' : ''}>EN</button>
    </div>
  );
}

export function ExperienceControls({ compact = false }: { compact?: boolean }) {
  return <div className="experience-controls"><ThemeSceneToggle compact={compact} /><LanguageToggle compact={compact} /></div>;
}
