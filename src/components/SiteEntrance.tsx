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

        <div className="site-entry__coastline">
          <div className="site-entry__shore">
            <span className="site-entry__shore-grain" />
            <span className="site-entry__shore-wet" />
            <span className="site-entry__backwash" />
          </div>

          <div className="site-entry__ocean">
            <svg className="site-entry__ocean-svg" viewBox="0 0 1440 560" preserveAspectRatio="none" focusable="false">
              <defs>
                <linearGradient id="veast-ocean-back" x1="0%" y1="0%" x2="18%" y2="100%">
                  <stop offset="0%" stopColor="rgba(83,173,195,0.60)" />
                  <stop offset="48%" stopColor="rgba(34,126,151,0.54)" />
                  <stop offset="100%" stopColor="rgba(14,82,104,0.50)" />
                </linearGradient>
                <linearGradient id="veast-ocean-mid" x1="8%" y1="0%" x2="34%" y2="100%">
                  <stop offset="0%" stopColor="rgba(69,165,185,0.76)" />
                  <stop offset="44%" stopColor="rgba(27,119,145,0.82)" />
                  <stop offset="100%" stopColor="rgba(8,70,94,0.84)" />
                </linearGradient>
                <linearGradient id="veast-ocean-front" x1="16%" y1="0%" x2="40%" y2="100%">
                  <stop offset="0%" stopColor="rgba(55,149,170,0.90)" />
                  <stop offset="42%" stopColor="rgba(15,101,128,0.96)" />
                  <stop offset="100%" stopColor="rgba(5,43,61,0.99)" />
                </linearGradient>
                <linearGradient id="veast-ocean-shine" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.02)" />
                  <stop offset="21%" stopColor="rgba(222,241,238,0.28)" />
                  <stop offset="46%" stopColor="rgba(255,255,255,0.08)" />
                  <stop offset="72%" stopColor="rgba(215,238,237,0.30)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
                </linearGradient>
                <radialGradient id="veast-water-glint" cx="52%" cy="12%" r="82%">
                  <stop offset="0%" stopColor="rgba(219,242,241,0.22)" />
                  <stop offset="44%" stopColor="rgba(83,174,190,0.08)" />
                  <stop offset="100%" stopColor="rgba(4,37,54,0)" />
                </radialGradient>
              </defs>

              <g className="site-entry__water-surface">
                <path className="site-entry__ocean-back" fill="url(#veast-ocean-back)" d="M0 224C73 207 129 202 187 213C254 226 316 252 382 254C451 257 515 239 582 221C651 202 718 206 783 226C846 245 901 257 965 251C1027 245 1080 222 1141 208C1208 193 1277 201 1339 219C1380 231 1411 232 1440 226V560H0Z" />
                <path className="site-entry__ocean-mid" fill="url(#veast-ocean-mid)" d="M0 302C55 284 105 277 154 286C215 297 258 328 322 337C390 347 457 328 516 303C579 277 646 270 709 289C773 308 819 338 885 342C951 346 1009 323 1068 299C1133 273 1200 271 1264 291C1325 310 1382 318 1440 303V560H0Z" />
                <path className="site-entry__ocean-front" fill="url(#veast-ocean-front)" d="M0 386C51 372 96 369 142 379C197 391 238 418 294 430C354 443 413 435 468 410C527 384 584 371 647 381C709 391 756 421 816 434C877 447 936 439 990 414C1046 388 1105 375 1165 385C1225 395 1269 423 1325 432C1365 439 1403 433 1440 421V560H0Z" />
                <path className="site-entry__ocean-glaze" fill="url(#veast-water-glint)" d="M0 250C164 199 281 300 439 266C603 231 728 207 891 268C1039 323 1185 210 1440 259V560H0Z" />
              </g>

              <path className="site-entry__ocean-crest" fill="url(#veast-ocean-shine)" d="M0 288C61 270 111 267 161 278C219 291 265 318 325 327C391 337 451 320 511 296C577 270 643 264 706 281C770 299 820 329 884 333C949 337 1008 316 1068 292C1132 267 1198 265 1261 283C1324 301 1384 308 1440 293L1440 312C1381 326 1324 320 1257 301C1198 285 1135 287 1074 311C1010 336 949 356 880 351C813 346 765 317 702 300C642 284 581 290 519 315C456 340 392 357 320 346C256 336 213 309 156 297C108 287 58 293 0 310Z" />

              <g className="site-entry__foam-organic">
                <path className="site-entry__ocean-foam site-entry__ocean-foam--one" d="M0 302C49 285 97 280 147 289C202 299 246 325 300 335 M337 340C391 345 449 329 504 306C566 280 626 275 687 289 M725 301C774 315 819 337 874 341C933 345 986 328 1042 306 M1082 291C1138 271 1192 273 1246 289C1309 308 1377 316 1440 299" />
                <path className="site-entry__ocean-foam site-entry__ocean-foam--two" d="M0 385C49 371 91 371 134 380C181 390 218 410 260 423 M302 432C351 442 401 436 450 416C504 393 549 378 600 380 M642 386C694 393 735 414 785 428C835 442 884 445 934 430 M976 414C1026 392 1073 379 1122 383C1173 386 1215 407 1260 421 M1298 430C1348 441 1395 434 1440 420" />
                <path className="site-entry__ocean-foam site-entry__ocean-foam--three" d="M64 446C111 438 150 442 188 454 M238 466C278 476 320 477 358 466 M421 449C469 431 516 429 559 443 M621 463C663 476 704 476 745 462 M812 441C859 427 903 432 943 448 M1004 466C1047 477 1089 474 1128 459 M1191 439C1234 430 1275 436 1314 449 M1362 459C1390 464 1417 462 1438 456" />
              </g>

              <g className="site-entry__foam-pockets">
                <path d="M126 416c18-9 39-8 57 0c13 6 18 14 8 20c-15 9-48 7-65-3c-10-6-10-12 0-17Z" />
                <path d="M385 454c15-8 33-7 48 0c11 5 14 12 5 17c-13 7-37 6-50-2c-8-5-9-10-3-15Z" />
                <path d="M678 418c22-10 49-9 69 1c14 7 18 15 5 22c-20 10-55 8-75-4c-11-7-11-13 1-19Z" />
                <path d="M1011 449c17-9 39-8 55 0c12 6 15 13 5 19c-15 8-43 7-58-2c-9-5-10-11-2-17Z" />
                <path d="M1261 421c20-9 42-8 60 1c12 6 16 13 5 19c-17 9-47 7-64-3c-10-6-10-12-1-17Z" />
              </g>

              <g className="site-entry__caustics">
                <path d="M118 473C167 462 211 465 252 478" />
                <path d="M342 495C389 483 436 485 480 497" />
                <path d="M569 468C618 455 665 459 705 473" />
                <path d="M812 494C859 481 906 484 947 497" />
                <path d="M1056 467C1102 456 1149 459 1190 474" />
                <path d="M1263 493C1306 482 1348 485 1387 495" />
              </g>

              <path className="site-entry__ocean-ripple site-entry__ocean-ripple--one" d="M86 488C180 473 267 492 354 490C448 487 535 463 625 465C718 467 803 493 895 491C987 490 1070 467 1161 467C1247 467 1327 482 1399 478" />
              <path className="site-entry__ocean-ripple site-entry__ocean-ripple--two" d="M41 520C134 510 218 523 306 521C398 519 486 502 576 503C666 504 752 524 844 522C934 520 1019 505 1108 506C1193 507 1273 520 1402 515" />
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

        <div className="site-entry__markers">
          <span className="site-entry__marker site-entry__marker--1"><i /></span>
          <span className="site-entry__marker site-entry__marker--2"><i /></span>
          <span className="site-entry__marker site-entry__marker--3"><i /></span>
          <span className="site-entry__marker site-entry__marker--4"><i /></span>
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
