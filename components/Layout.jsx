import Head from "next/head";
import Link from "next/link";
import Script from "next/script";

export default function Layout({ children, title = "Mon Portefeuille" }) {
  return (
    <>
      <Head>
        <title>{title} | monportefeuille.ca</title>
        <meta name="description" content="Outils financiers interactifs pour Canadiens — crédit, épargne, investissement." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>

      {/* Google Analytics */}
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-7ZLYDVL8BM" strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-7ZLYDVL8BM');
      `}</Script>

      <div className="min-h-screen bg-[#0D1117] text-[#E6EDF3]">
        {/* Nav */}
        <nav className="border-b border-[#21262D] sticky top-0 bg-[#0D1117]/90 backdrop-blur-md z-50">
          <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-[60px]">
            <Link href="/" className="flex items-center no-underline">
              <img src="/logo.svg" alt="monportefeuille.ca" className="h-16 w-auto" />
            </Link>
            <span className="text-xs text-[#8B949E] bg-[#161B22] border border-[#21262D] rounded-full px-3 py-1">
              🇨🇦 100% canadien
            </span>
          </div>
        </nav>

        {/* Page content */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="border-t border-[#21262D] py-6 text-center">
          <p className="text-xs text-[#484F58]">
            monportefeuille.ca · Outils éducatifs uniquement · Les liens peuvent être des liens affiliés ·{" "}
            <a href="/confidentialite" className="underline hover:text-[#8B949E]">Confidentialité</a>
          </p>
        </footer>
      </div>
    </>
  );
}