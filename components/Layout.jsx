import Head from "next/head";
import Link from "next/link";
import Script from "next/script";
import { useState } from "react";
import CookieConsent from "./CookieConsent";

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
      { href: "/celi-vs-reer", label: "CELI vs REER" },
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

export default function Layout({ children, title = "Mon Portefeuille", description, canonical }) {
  const [outilsOpen, setOutilsOpen] = useState(false);
  const [guidesOpen, setGuidesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <Head>
        <title>{`${title} | monportefeuille.ca`}</title>
        <meta name="description" content={description || "Outils financiers interactifs pour Canadiens — crédit, épargne, investissement."} />
        {canonical && <link rel="canonical" href={canonical} />}
        {canonical && <meta property="og:url" content={canonical} />}
        <meta property="og:title" content={`${title} | monportefeuille.ca`} />
        <meta property="og:description" content={description || "Outils financiers interactifs pour Canadiens — crédit, épargne, investissement."} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="fr_CA" />
        <meta property="og:site_name" content="monportefeuille.ca" />
        <meta property="og:image" content="https://monportefeuille.ca/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${title} | monportefeuille.ca`} />
        <meta name="twitter:description" content={description || "Outils financiers interactifs pour Canadiens — crédit, épargne, investissement."} />
        <meta name="twitter:image" content="https://monportefeuille.ca/og-image.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Schema.org Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "monportefeuille.ca",
              "url": "https://monportefeuille.ca",
              "logo": "https://monportefeuille.ca/logo.svg",
              "description": "Outils financiers gratuits pour Canadiens — calculateurs CELI, REER, hypothèque, impôt, crédit et assurance.",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "CA"
              }
            })
          }}
        />
      </Head>

      {/* Google Analytics — consent mode: denied by default until user accepts */}
      <Script id="ga-consent-default" strategy="beforeInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('consent', 'default', { analytics_storage: 'denied' });
      `}</Script>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-9MMLY6FHFR" strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-9MMLY6FHFR');
      `}</Script>

      <div className="min-h-screen bg-[#0D1117] text-[#E6EDF3]" style={{ fontFamily: "var(--font-dm-sans, 'Helvetica Neue', sans-serif)" }}>

        {/* Nav */}
        <nav className="border-b border-[#21262D] sticky top-0 bg-[#0D1117]/95 backdrop-blur-md z-50">
          <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-[60px]">

            {/* Logo */}
            <Link href="/" className="flex items-center no-underline">
              <img src="/logo.svg" alt="monportefeuille.ca" className="h-16 w-auto" width="480" height="72" />
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">

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

              {/* Guides dropdown */}
              <div className="relative">
                <button
                  onClick={() => setGuidesOpen(!guidesOpen)}
                  onBlur={() => setTimeout(() => setGuidesOpen(false), 150)}
                  className="flex items-center gap-1.5 text-xs text-[#8B949E] hover:text-[#E6EDF3] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#161B22]"
                >
                  Guides
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
                    style={{ transform: guidesOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                    <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>

                {guidesOpen && (
                  <div className="absolute top-10 left-0 bg-[#161B22] border border-[#21262D] rounded-xl py-3 w-72 z-50 shadow-2xl">
                    <div className="px-4 pb-1">
                      <span className="text-[9px] uppercase tracking-widest font-medium" style={{ color: "#F0A500" }}>
                        Investissement
                      </span>
                    </div>
                    <Link href="/guide-investissement-debutant-canada" onClick={() => setGuidesOpen(false)}
                      className="block px-4 py-2 text-xs text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#21262D] transition-colors no-underline">
                      Guide d'investissement pour débutants
                    </Link>
                    <Link href="/guide-cote-de-credit-canada" onClick={() => setGuidesOpen(false)}
                      className="block px-4 py-2 text-xs text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#21262D] transition-colors no-underline">
                      Guide cote de crédit au Canada
                    </Link>
                  </div>
                )}
              </div>

              {/* À propos */}
              <Link href="/a-propos"
                className="text-xs text-[#8B949E] hover:text-[#E6EDF3] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#161B22] no-underline whitespace-nowrap">
                À propos
              </Link>

              {/* Nous joindre */}
              <Link href="/nous-joindre"
                className="text-xs text-[#E6EDF3] bg-[#21262D] hover:bg-[#30363D] transition-colors px-3 py-1.5 rounded-lg no-underline border border-[#30363D] whitespace-nowrap">
                Nous joindre
              </Link>
            </div>

            {/* Right side — Bêta + 🇨🇦 + burger mobile */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium text-[#484F58] bg-[#161B22] border border-[#21262D] rounded-full px-2 py-0.5 tracking-wide">
                Bêta
              </span>
              <span className="hidden lg:flex items-center gap-1.5 text-xs text-[#8B949E] bg-[#161B22] border border-[#21262D] rounded-full px-3 py-1">
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

              {/* Guides mobile */}
              <div>
                <div className="pt-3 pb-1">
                  <span className="text-[9px] uppercase tracking-widest font-medium" style={{ color: "#F0A500" }}>Guides</span>
                </div>
                <Link href="/guide-investissement-debutant-canada" onClick={() => setMobileOpen(false)}
                  className="block py-2 text-sm text-[#8B949E] hover:text-[#E6EDF3] pl-2 no-underline">
                  Guide d'investissement pour débutants
                </Link>
                <Link href="/guide-cote-de-credit-canada" onClick={() => setMobileOpen(false)}
                  className="block py-2 text-sm text-[#8B949E] hover:text-[#E6EDF3] pl-2 no-underline">
                  Guide cote de crédit au Canada
                </Link>
              </div>

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
        <footer className="border-t border-[#21262D] py-8 text-center">
          <p className="text-xs text-[#484F58] mb-2">
            Les informations fournies sont à titre éducatif uniquement et ne constituent pas des conseils financiers.{" "}
            Consultez un professionnel avant de prendre toute décision financière.
          </p>
          <p className="text-xs text-[#484F58]">
            monportefeuille.ca · Les liens peuvent être des liens affiliés ·{" "}
            <Link href="/a-propos" className="underline hover:text-[#8B949E]">À propos</Link>
            {" "}·{" "}
            <Link href="/nous-joindre" className="underline hover:text-[#8B949E]">Nous joindre</Link>
            {" "}·{" "}
            <Link href="/nous-joindre" className="underline hover:text-[#8B949E]">Signaler une erreur</Link>
            {" "}·{" "}
            <Link href="/mentions-legales" className="underline hover:text-[#8B949E]">Mentions légales</Link>
            {" "}·{" "}
            <Link href="/confidentialite" className="underline hover:text-[#8B949E]">Confidentialité</Link>
          </p>
        </footer>
      </div>

      <CookieConsent />
    </>
  );
}