import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import './webflow.css';

const SITE_TITLE = 'Madurai Veeran';
const SITE_DESCRIPTION =
  'Tamil Financial Literacy Advocate, Investor & Wealth Discipline Mentor';

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Webflow shared stylesheet */}
        <link
          href="https://cdn.prod.website-files.com/65aa9744cb3474ba90a7bc54/css/sophia-amoruso-2024.shared.ca736bed4.css"
          rel="stylesheet"
          type="text/css"
          integrity="sha384-ynNr7UWEnH5R1z8C3Q3yDIMg9qqwC20tQMWIXsV7iY2xLQeKNRGprvXs1SHu6ehf"
          crossOrigin="anonymous"
        />

        {/* Swiper CSS */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"
        />
      </head>

      <body data-w-id="65aa9744cb3474ba90a7bc66" suppressHydrationWarning>
        {children}

        {/* Webflow modernizr-style class injection */}
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(o,c){var n=c.documentElement,t=" w-mod-";n.className+=t+"js","ontouchstart"in o||o.DocumentTouch&&c instanceof DocumentTouch?n.className+=t+"touch":""}(window,document);`,
          }}
        />

        {/* Global Swiper variable */}
        <script dangerouslySetInnerHTML={{ __html: `let swipers = {};` }} />

        {/* jQuery */}
        <Script
          src="https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=65aa9744cb3474ba90a7bc54"
          strategy="beforeInteractive"
        />

        {/* GSAP + plugins */}
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/TextPlugin.min.js"
          strategy="beforeInteractive"
        />

        {/* Swiper */}
        <Script
          src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"
          strategy="beforeInteractive"
        />

        {/* Luxon */}
        <Script
          src="https://cdn.jsdelivr.net/npm/luxon@3.3.0/build/global/luxon.min.js"
          strategy="beforeInteractive"
        />

        {/* Webflow runtime */}
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
        />
        <Script src="/webflow.js" strategy="afterInteractive" />
        <Script src="/webflow-interactions.js" strategy="afterInteractive" />

        {/* Course-Studio animation scripts */}
        <Script
          id="deploy-code"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var repository = "https://cdn.jsdelivr.net/gh/Course-Studio/sophia-amoruso@";
                var version = "0.20";
                var basePath = repository + version + '/dist/';

                function loadScript(src, callback) {
                  var script = document.createElement('script');
                  script.src = src;
                  script.defer = true;
                  if (callback) script.onload = callback;
                  document.body.appendChild(script);
                }

                window.loadPageScript = function(pageScriptName) {
                  loadScript(basePath + pageScriptName);
                };

                loadScript(basePath + 'index.js', function() {
                  loadScript(basePath + 'pageload.js', function() {
                    window.loadPageScript('homepage.js');
                  });
                });
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
