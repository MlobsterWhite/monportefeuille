import Link from "next/link";
import Layout from "../components/Layout";

export default function NotFound() {
  return (
    <Layout
      title="Page introuvable"
      description="Cette page n'existe pas ou a été déplacée."
    >
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">

        {/* Big 404 */}
        <div
          className="text-[120px] md:text-[160px] font-black leading-none mb-4 select-none"
          style={{ fontFamily: "'DM Mono', monospace", color: "rgba(61,220,151,0.12)" }}
        >
          404
        </div>

        {/* Icon + heading */}
        <div className="text-4xl mb-4">🗺️</div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#E6EDF3] mb-3">
          Page introuvable
        </h1>
        <p className="text-sm text-[#8B949E] max-w-sm leading-relaxed mb-8">
          Cette page n'existe pas ou a été déplacée. Retournez à l'accueil pour
          accéder à nos outils financiers gratuits.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="bg-[#3DDC97] text-[#0D1117] font-bold rounded-xl px-6 py-3 text-sm hover:bg-[#34c487] transition-colors no-underline"
          >
            ← Retour à l'accueil
          </Link>
          <Link
            href="/nous-joindre"
            className="border border-[#21262D] text-[#8B949E] rounded-xl px-6 py-3 text-sm hover:border-[#484F58] hover:text-[#E6EDF3] transition-colors no-underline"
          >
            Signaler un problème
          </Link>
        </div>

        {/* Quick links */}
        <div className="mt-12 border-t border-[#21262D] pt-8 w-full max-w-md">
          <p className="text-xs text-[#484F58] uppercase tracking-widest mb-4">Outils populaires</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { href: "/calculateur-celi",     label: "Calculateur CELI" },
              { href: "/calculateur-reer",     label: "Calculateur REER" },
              { href: "/estimateur-impot",     label: "Estimateur d'impôt" },
              { href: "/calculateur-hypotheque", label: "Hypothèque" },
              { href: "/estimateur-credit",    label: "Crédit" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-xs text-[#8B949E] border border-[#21262D] rounded-full px-3 py-1.5 hover:text-[#E6EDF3] hover:border-[#484F58] transition-colors no-underline"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </Layout>
  );
}
