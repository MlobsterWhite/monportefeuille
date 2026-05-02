import Head from "next/head";
import Link from "next/link";
import Script from "next/script";
import { useState } from "react";

const OUTILS = [
  {
    categorie: "Crédit",
    color: "#3DDC97",
    items: [
      { href: "/estimateur-credit", label: "Estimateur de crédit" },
    ],
  },
  {
    categorie: "Investissement",
    color: "#F0A500",
    items: [
      { href: "/calculateur-celi", label: "Calculateur CELI" },
      { href: "/calculateur-reer", label: "Calculateur REER" },
    ],
  },
  {
    categorie: "Épargne",
    color: "#60A5FA",
    items: [
      { href: "/valeur-nette", label: "Calculateur valeur nette" },
    ],
  },
  {
    categorie: "Immobilier",
    color: "#FB923C",
    items: [
      { href: "/calculateur-hypotheque", label: "Calculateur hypothécaire" },
    ],
  },
  {
    categorie: "Assurance",
    color: "#60A5FA",
    items: [
      { href: "/estimateur-assurance", label: "Estimateur d'assurance" },
    ],
  },
  {
    categorie: "Fiscal",
    color: "#C084FC",
    items: [
      { href: "/estimateur-impot", label: "Estimateur d'impôt" },
    ],
  },
];

export default function Layout({ children, title = "Mon Portefeuille" }) {
  const [outilsOpen, setOutilsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
        <nav className="border-b border-[#21262D] sticky top-0 bg-[#0D1117]/95 backdrop-blur-md z-50">
          <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-[60px]">

            {/* Logo */}
            <Link href="/" className="flex items-center no-underline">
              <img src="/logo.svg" alt="monportefeuille.ca" className="h-16 w-auto" />
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">

              {/* Accueil */}
              <Link href="/"
                className="text-xs text-[#8B949E] hover:text-[#E6EDF3] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#161B22] no-underline">
                Accueil
              </Link>

              {/* Outils dropdown */}
              <div className="relative">
                <button
                  onClick={() => setOutilsOpen(!outilsOpen)}
                  onBlur={() => setTimeout(() => setOutilsOpen(false), 150)}
                  className="flex items-center gap-1.5 text-xs text-[#8B949E] hover:text-[#E6EDF3] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#161B22]"
                >
                  Outils
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
                    style={{ transform: outilsOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                    <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>

                {outilsOpen && (
                  <div className="absolute top-10 left-0 bg-[#161B22] border border-[#21262D] rounded-xl py-3 w-64 z-50 shadow-2xl">
                    {OUTILS.map(({ categorie, color, items }) => (
                      <div key={categorie} className="mb-2 last:mb-0">
                        <div className="px-4 pb-1">
                          <span className="text-[9px] uppercase tracking-widest font-medium" style={{ color }}>
                            {categorie}
                          </span>
                        </div>
                        {items.map(({ href, label }) => (
                          <Link key={href} href={href} onClick={() => setOutilsOpen(false)}
                            className="block px-4 py-2 text-xs text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#21262D] transition-colors no-underline">
                            {label}
                          </Link>
                        ))}
                        <div className="mx-4 mt-2 mb-1 border-t border-[#21262D] last:hidden" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* À propos */}
              <Link href="/a-propos"
                className="text-xs text-[#8B949E] hover:text-[#E6EDF3] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#161B22] no-underline">
                À propos
              </Link>

              {/* Nous joindre */}
              <Link href="/nous-joindre"
                className="text-xs text-[#E6EDF3] bg-[#21262D] hover:bg-[#30363D] transition-colors px-3 py-1.5 rounded-lg no-underline border border-[#30363D]">
                Nous joindre
              </Link>
            </div>

            {/* Right side — 🇨🇦 + burger mobile */}
            <div className="flex items-center gap-3">
              <span className="hidden sm:flex items-center gap-1.5 text-xs text-[#8B949E] bg-[#161B22] border border-[#21262D] rounded-full px-3 py-1">
                🇨🇦 100% canadien
              </span>

              {/* Burger mobile */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden text-[#8B949E] hover:text-[#E6EDF3] transition-colors p-1"
                aria-label="Menu">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  {mobileOpen ? (
                    <path d="M4 4L16 16M4 16L16 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  ) : (
                    <>
                      <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileOpen && (
            <div className="md:hidden border-t border-[#21262D] bg-[#0D1117] px-6 pb-4">
              <Link href="/" onClick={() => setMobileOpen(false)}
                className="block py-3 text-sm text-[#8B949E] hover:text-[#E6EDF3] border-b border-[#21262D] no-underline">
                Accueil
              </Link>

              {OUTILS.map(({ categorie, color, items }) => (
                <div key={categorie}>
                  <div className="pt-3 pb-1">
                    <span className="text-[9px] uppercase tracking-widest font-medium" style={{ color }}>{categorie}</span>
                  </div>
                  {items.map(({ href, label }) => (
                    <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                      className="block py-2 text-sm text-[#8B949E] hover:text-[#E6EDF3] pl-2 no-underline">
                      {label}
                    </Link>
                  ))}
                </div>
              ))}

              <div className="border-t border-[#21262D] mt-3 pt-3 space-y-2">
                <Link href="/a-propos" onClick={() => setMobileOpen(false)}
                  className="block py-2 text-sm text-[#8B949E] hover:text-[#E6EDF3] no-underline">
                  À propos
                </Link>
                <Link href="/nous-joindre" onClick={() => setMobileOpen(false)}
                  className="block py-2 text-sm text-[#8B949E] hover:text-[#E6EDF3] no-underline">
                  Nous joindre
                </Link>
              </div>
            </div>
          )}
        </nav>

        {/* Page content */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="border-t border-[#21262D] py-6 text-center">
          <p className="text-xs text-[#484F58]">
            monportefeuille.ca · Outils éducatifs uniquement · Les liens peuvent être des liens affiliés ·{" "}
            <Link href="/a-propos" className="underline hover:text-[#8B949E]">À propos</Link>
            {" "}·{" "}
            <Link href="/nous-joindre" className="underline hover:text-[#8B949E]">Nous joindre</Link>
            {" "}·{" "}
            <Link href="/mentions-legales" className="underline hover:text-[#8B949E]">Mentions légales</Link>
            {" "}·{" "}
            <Link href="/confidentialite" className="underline hover:text-[#8B949E]">Confidentialité</Link>
          </p>
        </footer>
      </div>
    </>
  );
}
