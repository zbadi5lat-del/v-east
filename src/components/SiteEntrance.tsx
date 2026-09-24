import { ASSETS } from '../content';
import { useSiteExperience } from '../siteExperience';

export function SiteEntrance() {
  const { copy, language } = useSiteExperience();

  return (
    <div className="site-entry" aria-hidden="true">
      <div className="site-entry__scene">
        <span className="site-entry__glow site-entry__glow--one" />
        <span className="site-entry__glow site-entry__glow--two" />
        <span className="site-entry__horizon" />
        <span className="site-entry__sweep" />

        <div className="site-entry__markers">
          <span className="site-entry__marker site-entry__marker--1"><i /></span>
          <span className="site-entry__marker site-entry__marker--2"><i /></span>
          <span className="site-entry__marker site-entry__marker--3"><i /></span>
          <span className="site-entry__marker site-entry__marker--4"><i /></span>
        </div>

        <div className="site-entry__water" aria-hidden="true">
          <span className="site-entry__wave site-entry__wave--back" />
          <span className="site-entry__wave site-entry__wave--mid" />
          <span className="site-entry__wave site-entry__wave--front" />
        </div>
      </div>

      <div className="site-entry__content">
        <div className="site-entry__brand">
          <div className="site-entry__logo-stage">
            <span className="site-entry__orbit site-entry__orbit--outer" />
            <span className="site-entry__orbit site-entry__orbit--inner" />
            <span className="site-entry__logo"><img src={ASSETS.logo} width={1079} height={1077} alt="" /></span>
          </div>
          <span className="site-entry__wordmark">
            <strong dir="ltr">V.EAST</strong>
            <small>{copy.common.descriptor}</small>
          </span>
        </div>

        <div className="site-entry__scope" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          {copy.entrance.scope.map((item, index) => (
            <span key={item} className="site-entry__scope-item">
              {item}
              {index < copy.entrance.scope.length - 1 ? <i aria-hidden="true" /> : null}
            </span>
          ))}
        </div>
      </div>

      <span className="site-entry__track" aria-hidden="true" />
    </div>
  );
}
