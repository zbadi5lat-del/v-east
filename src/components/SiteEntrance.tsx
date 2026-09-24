import { ASSETS, BRAND } from '../content';
import { useSiteExperience } from '../siteExperience';

export function SiteEntrance() {
  const { copy, language } = useSiteExperience();
  return (
    <div className="site-entry" aria-hidden="true">
      <div className="site-entry__content">
        <div className="site-entry__brand">
          <span className="site-entry__logo"><img src={ASSETS.logo} width={1079} height={1077} alt="" /></span>
          <span className="site-entry__wordmark"><strong dir="ltr">V.EAST</strong><small>{copy.common.descriptor}</small></span>
        </div>
        <div className="site-entry__scope" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          {copy.entrance.scope.map((item, index) => <span key={item} className="site-entry__scope-item">{item}{index < copy.entrance.scope.length - 1 ? <i aria-hidden="true" /> : null}</span>)}
        </div>
      </div>
      <span className="site-entry__track" aria-hidden="true" />
    </div>
  );
}
