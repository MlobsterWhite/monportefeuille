import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="fr-CA">
      <Head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        {/* GA4 géré exclusivement dans components/Layout.jsx (consent mode + afterInteractive) */}
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
