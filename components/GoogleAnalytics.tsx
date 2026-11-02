import Script from "next/script";
import { Suspense } from "react";
import { AnalyticsPageViews } from "./AnalyticsPageViews";
import { ContactClicks } from "./ContactClicks";
import { gaHost, gaId } from "@/lib/analytics";

// Only the live domain loads gtag, so local builds and workers.dev previews
// don't count as visits.
const init = `if(location.hostname===${JSON.stringify(gaHost)}){window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments);};gtag('js',new Date());gtag('config',${JSON.stringify(gaId)});var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=${gaId}';document.head.appendChild(s);}`;

export function GoogleAnalytics() {
  return (
    <>
      <Script id="gtag-init" strategy="afterInteractive">
        {init}
      </Script>
      <Suspense fallback={null}>
        <AnalyticsPageViews />
      </Suspense>
      <ContactClicks />
    </>
  );
}
