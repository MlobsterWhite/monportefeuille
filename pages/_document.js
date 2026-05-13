import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="fr-CA">
      <Head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        {/* Google Analytics GA4 — G-9MMLY6FHFR */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-9MMLY6FHFR" />
        <script dangerouslySetInnerHTML={{__html:`
          window.dataLayer=window.dataLayer||[];
          function gtag(){dataLayer.push(arguments);}
          gtag('js',new Date());
          gtag('config','G-9MMLY6FHFR');
        `}} />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}