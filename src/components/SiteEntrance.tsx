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

        <div className="site-entry__shore">
          <span className="site-entry__shore-grain" />
          <span className="site-entry__shore-wet" />
          <span className="site-entry__backwash" />
        </div>

        <div className="site-entry__markers">
          <span className="site-entry__marker site-entry__marker--1"><i /></span>
          <span className="site-entry__marker site-entry__marker--2"><i /></span>
          <span className="site-entry__marker site-entry__marker--3"><i /></span>
          <span className="site-entry__marker site-entry__marker--4"><i /></span>
        </div>

        <div className="site-entry__ocean">
          <svg className="site-entry__ocean-svg" viewBox="0 0 1440 560" preserveAspectRatio="none" focusable="false">
            <defs>
              <linearGradient id="veast-ocean-back" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(70,165,196,0.75)" />
                <stop offset="100%" stopColor="rgba(21,97,126,0.48)" />
              </linearGradient>
              <linearGradient id="veast-ocean-mid" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(38,133,167,0.88)" />
                <stop offset="100%" stopColor="rgba(10,67,93,0.72)" />
              </linearGradient>
              <linearGradient id="veast-ocean-front" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(31,121,153,0.98)" />
                <stop offset="55%" stopColor="rgba(8,66,94,0.94)" />
                <stop offset="100%" stopColor="rgba(5,29,43,0.98)" />
              </linearGradient>
              <linearGradient id="veast-ocean-shine" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                <stop offset="50%" stopColor="rgba(238,248,245,0.74)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>
            <path className="site-entry__ocean-back" fill="url(#veast-ocean-back)" d="M0 232C86 203 161 174 251 179C370 185 454 267 561 267C661 267 756 183 864 186C976 189 1060 270 1164 269C1264 268 1355 214 1440 197V560H0Z" />
            <path className="site-entry__ocean-mid" fill="url(#veast-ocean-mid)" d="M0 304C71 258 146 229 240 235C362 243 452 337 577 334C694 332 783 238 904 241C1015 244 1104 326 1214 326C1307 326 1374 282 1440 263V560H0Z" />
            <path className="site-entry__ocean-front" fill="url(#veast-ocean-front)" d="M0 360C86 310 175 279 285 287C429 297 520 407 667 406C807 404 904 295 1050 294C1187 294 1286 376 1390 368C1407 367 1424 364 1440 360V560H0Z" />
            <path className="site-entry__ocean-crest" fill="url(#veast-ocean-shine)" d="M0 312C75 275 164 255 260 264C391 276 479 351 603 349C722 347 814 273 932 275C1047 277 1134 340 1247 341C1324 342 1387 322 1440 303V336C1387 354 1323 369 1245 367C1131 363 1041 300 926 300C805 300 714 376 595 378C470 379 380 303 249 295C157 290 72 311 0 347Z" />
            <path className="site-entry__ocean-foam site-entry__ocean-foam--one" d="M0 302C68 258 147 230 240 236C362 244 452 338 577 334C694 332 783 238 904 241C1015 244 1104 326 1214 326C1307 326 1374 282 1440 263" />
            <path className="site-entry__ocean-foam site-entry__ocean-foam--two" d="M0 359C86 309 175 278 285 286C429 296 520 406 667 405C807 403 904 294 1050 293C1187 293 1286 375 1390 367C1407 366 1424 363 1440 359" />
            <path className="site-entry__ocean-foam site-entry__ocean-foam--three" d="M18 425C112 392 205 389 298 414C399 442 483 449 579 424C687 396 789 387 894 416C1001 445 1096 450 1200 420C1286 395 1364 397 1424 415" />
            <g className="site-entry__foam-pockets">
              <ellipse cx="170" cy="408" rx="35" ry="7" />
              <ellipse cx="420" cy="443" rx="24" ry="5" />
              <ellipse cx="718" cy="405" rx="46" ry="8" />
              <ellipse cx="1048" cy="438" rx="31" ry="6" />
              <ellipse cx="1298" cy="410" rx="39" ry="7" />
            </g>
            <path className="site-entry__ocean-ripple site-entry__ocean-ripple--one" d="M118 414C227 401 322 424 425 423C533 423 620 394 723 394C833 393 925 420 1031 420C1124 421 1216 407 1311 400" />
            <path className="site-entry__ocean-ripple site-entry__ocean-ripple--two" d="M64 455C183 442 294 468 406 468C521 467 633 437 749 437C858 437 960 466 1071 466C1182 466 1288 450 1377 442" />
          </svg>
          <span className="site-entry__spray site-entry__spray--1" />
          <span className="site-entry__spray site-entry__spray--2" />
          <span className="site-entry__spray site-entry__spray--3" />
          <span className="site-entry__spray site-entry__spray--4" />
          <span className="site-entry__spray site-entry__spray--5" />
          <span className="site-entry__spray site-entry__spray--6" />
          <span className="site-entry__spray site-entry__spray--7" />
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
