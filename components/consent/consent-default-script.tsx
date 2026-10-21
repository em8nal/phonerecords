import { CONSENT_COOKIE } from "./consent-cookie";

// Google Consent Mode v2 defaults. Must run before GTM / gtag.js start, so it
// is rendered as a plain inline <script> inside <head> (parser-blocking, so it
// runs before <body> is parsed and long before hydration). GTM and GA4 are
// next/script afterInteractive: they only start after hydration. Only
// <link rel="preload"> hints for them can precede it in the HTML.
//
// - Everything starts "denied"; GA4/GTM then send cookieless pings only.
// - Returning visitors with phone_consent=granted get analytics_storage
//   upgraded right away (ad_* stays denied: the site does not use ads).
// - wait_for_update gives the banner/cookie logic 500 ms to push an update
//   before tags fire.
const SNIPPET = `window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
window.gtag=gtag;
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});
try{if(document.cookie.split('; ').indexOf('${CONSENT_COOKIE}=granted')!==-1){gtag('consent','update',{analytics_storage:'granted'});}}catch(e){}`;

export function ConsentDefaultScript() {
  return <script id="consent-default" dangerouslySetInnerHTML={{ __html: SNIPPET }} />;
}
