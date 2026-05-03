import Layout from "../components/Layout";
import Link from "next/link";

export default function APropos() {
  return (
    <Layout title="À propos">
      <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", background: "#0D1117", minHeight: "100vh", padding: "3rem 1rem" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');`}</style>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>

          <div className="mb-10">
            <div className="text-[10px] text-[#484F58] uppercase tracking-widest mb-2">monportefeuille.ca</div>
            <h1 style={{ fontFamily: "'DM Mono', monospace" }} className="text-3xl font-medium text-[#E6EDF3] mb-2">À propos</h1>
            <p className="text-sm text-[#8B949E]">Le projet, la mission, la transparence.</p>
          </div>

          <div className="space-y-4">

            {/* Mission */}
            <div className="rounded-2xl p-6" style={{ background: "#161B22", border: "1px solid #21262D" }}>
              <div className="text-3xl mb-4">🇨🇦</div>
              <h2 className="text-lg font-medium text-[#E6EDF3] mb-3">Pourquoi ce site?</h2>
              <p className="text-sm text-[#8B949E] leading-relaxed mb-3">
                J'ai créé monportefeuille.ca parce que la littératie financière au Canada — surtout en français — est souvent inaccessible, compliquée ou noyée dans du jargon. Pourtant, quelques décisions simples peuvent faire une énorme différence sur 10 ou 20 ans.
              </p>
              <p className="text-sm text-[#8B949E] leading-relaxed">
                Ici, pas de conseils financiers complexes. Juste des outils clairs, des simulations honnêtes, et des recommandations de produits canadiens reconnus pour passer à l'action — le tout 100% gratuit.
              </p>
            </div>

            {/* Ce que c'est / pas */}
            <div className="rounded-2xl p-6" style={{ background: "#161B22", border: "1px solid #21262D" }}>
              <h2 className="text-lg font-medium text-[#E6EDF3] mb-4">Ce que ce site est — et n'est pas</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] text-[#3DDC97] uppercase tracking-widest mb-3">Ce que c'est ✓</div>
                  <ul className="space-y-2">
                    {[
                      "Un outil éducatif gratuit",
                      "Des simulateurs pour explorer vos options",
                      "Des explications claires sans jargon",
                      "100% canadien, en français",
                    ].map(i => (
                      <li key={i} className="flex gap-2 text-xs text-[#8B949E]">
                        <span className="text-[#3DDC97] flex-shrink-0">·</span>{i}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-[10px] text-[#f87171] uppercase tracking-widest mb-3">Ce que ce n'est pas ✗</div>
                  <ul className="space-y-2">
                    {[
                      "Des conseils financiers personnalisés",
                      "Un conseiller ou planificateur financier",
                      "Un service réglementé par l'AMF",
                      "Une garantie de résultats",
                    ].map(i => (
                      <li key={i} className="flex gap-2 text-xs text-[#8B949E]">
                        <span className="text-[#f87171] flex-shrink-0">·</span>{i}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Transparence affiliés */}
            <div className="rounded-2xl p-6" style={{ background: "#161B22", border: "1px solid #21262D" }}>
              <h2 className="text-lg font-medium text-[#E6EDF3] mb-3">Transparence sur les liens affiliés</h2>
              <p className="text-sm text-[#8B949E] leading-relaxed mb-3">
                Ce site est gratuit et le restera. Pour couvrir les coûts d'hébergement, certains liens vers des produits recommandés sont des <strong className="text-[#E6EDF3]">liens affiliés</strong> — si vous ouvrez un compte via ces liens, je reçois une petite commission de la part du partenaire, sans aucun coût supplémentaire pour vous.
              </p>
              <p className="text-sm text-[#8B949E] leading-relaxed mb-4">
                Les produits recommandés (Wealthsimple, Borrowell, nesto, etc.) sont sélectionnés parce qu'ils sont <strong className="text-[#E6EDF3]">réellement reconnus au Canada</strong> — pas parce qu'ils paient le plus. Les affiliations ne dictent jamais le contenu éducatif des outils.
              </p>
              <div className="bg-[#0D1117] rounded-xl p-4 border border-[#21262D]">
                <p className="text-xs text-[#484F58]">
                  Partenaires actuels : Borrowell (estimateur de crédit) · Wealthsimple (CELI, REER, Impôt, CELIAPP) · nesto (hypothèque — à venir) · Sonnet (assurance — à venir)
                </p>
              </div>
            </div>

            {/* Données */}
            <div className="rounded-2xl p-6" style={{ background: "#161B22", border: "1px solid #21262D" }}>
              <h2 className="text-lg font-medium text-[#E6EDF3] mb-3">Vos données restent les vôtres</h2>
              <p className="text-sm text-[#8B949E] leading-relaxed">
                Les informations que vous saisissez dans les calculateurs (revenus, épargne, etc.) ne quittent jamais votre navigateur. Elles sont stockées localement sur votre appareil uniquement, pour mémoriser vos paramètres entre les visites. Aucune donnée personnelle n'est envoyée à nos serveurs.
              </p>
            </div>

            {/* CTA */}
            <div className="rounded-2xl p-6 text-center" style={{ background: "#161B22", border: "1px solid #21262D" }}>
              <p className="text-sm text-[#8B949E] mb-4">Une question, une suggestion ou une erreur à signaler?</p>
              <Link href="/nous-joindre"
                className="inline-block bg-[#21262D] border border-[#30363D] text-[#E6EDF3] font-medium rounded-xl px-6 py-3 text-sm hover:bg-[#30363D] transition-colors no-underline">
                Nous joindre →
              </Link>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}
