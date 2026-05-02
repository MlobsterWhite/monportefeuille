import Head from "next/head";
import Link from "next/link";
import Script from "next/script";
import { useState } from "react";

export default function Layout({ children, title = "Mon Portefeuille" }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Head>
        <title>{title} | monportefeuille.ca</title>
        <meta name="description" content="Outils financiers interactifs pour Canadiens — crédit, épargne, investissement." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>

      {/* Google Analytics */}
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-9MMLY6FHFR" strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-9MMLY6FHFR');
      `}</Script>

      <div className="min-h-screen bg-[#0D1117] text-[#E6EDF3]">
        {/* Nav */}
        <nav className="border-b border-[#21262D] sticky top-0 bg-[#0D1117]/90 backdrop-blur-md z-50">
          <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-[60px]">
            <Link href="/" className="flex items-center no-underline">
              <img src="/logo.svg" alt="monportefeuille.ca" className="h-16 w-auto" />
            </Link>

            {/* Dropdown Outils */}
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-1.5 text-xs text-[#8B949E] hover:text-[#E6EDF3] transition-colors border border-[#21262D] rounded-lg px-3 py-1.5"
              >
                Outils
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
              {open && (
                <div
                  className="absolute top-9 right-0 bg-[#161B22] border border-[#21262D] rounded-xl py-1 w-52 z-50 shadow-xl"
                  onMouseLeave={() => setOpen(false)}
                >
                  <Link href="/estimateur-credit" onClick={() => setOpen(false)}
                    className="block px-4 py-2.5 text-xs text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#21262D] transition-colors no-underline">
                    📊 Estimateur de crédit
                  </Link>
                  <Link href="/calculateur-celi" onClick={() => setOpen(false)}
                    className="block px-4 py-2.5 text-xs text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#21262D] transition-colors no-underline">
                    📈 Calculateur CELI
                  </Link>
                  <Link href="/valeur-nette" onClick={() => setOpen(false)}
                    className="block px-4 py-2.5 text-xs text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#21262D] transition-colors no-underline">
                    💼 Valeur nette
                  </Link>
                </div>
              )}
            </div>

            <span className="flex items-center gap-1.5 text-xs text-[#8B949E] bg-[#161B22] border border-[#21262D] rounded-full px-3 py-1">
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