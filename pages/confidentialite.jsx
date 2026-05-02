import Layout from "../components/Layout";

const today = new Date();
const dateStr = today.toLocaleDateString("fr-CA", { year: "numeric", month: "long", day: "numeric" });

export default function Confidentialite() {
  return (
    <Layout title="Politique de confidentialité">
      <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", background: "#0D1117", minHeight: "100vh", padding: "3rem 1rem" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');`}</style>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>

          <div className="mb-10">
            <div className="text-[10px] text-[#484F58] uppercase tracking-widest mb-2">monportefeuille.ca</div>
            <h1 style={{ fontFamily: "'DM Mono', monospace" }} className="text-3xl font-medium text-[#E6EDF3] mb-2">Politique de confidentialité</h1>
            <p className="text-xs text-[#484F58]">Dernière mise à jour : {dateStr}</p>
          </div>

          <div className="space-y-4 text-sm text-[#8B949E] leading-relaxed">

            <div className="bg-[#161B22] border border-[#21262D] rounded-2xl p-6">
              <p className="text-[#C9D1D9]">
                Cette politique explique comment <strong className="text-[#E6EDF3]">monportefeuille.ca</strong> traite les données des utilisateurs. Nous prenons votre vie privée au sérieux — nos outils ne collectent ni ne stockent vos données financières personnelles.
              </p>
            </div>

            {/* Ce qu'on collecte vs pas */}
            <div className="rounded-2xl p-6" style={{ background: "#161B22", border: "1px solid #21262D" }}>
              <h2 className="text-base font-medium text-[#E6EDF3] mb-4">Données collectées</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-[10px] text-[#8B949E] uppercase tracking-widest mb-3">Données anonymes (collectées)</div>
                  <ul className="space-y-2">
                    {[
                      "Données de navigation anonymes (Google Analytics)",
                      "Clics sur les liens affiliés",
                      "Informations techniques (navigateur, appareil)",
                    ].map(i => (
                      <li key={i} className="flex gap-2 text-xs text-[#8B949E]">
                        <span className="text-[#8B949E] mt-0.5 flex-shrink-0">·</span>
                        {i}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-[10px] text-[#3DDC97] uppercase tracking-widest mb-3">Données jamais collectées</div>
                  <ul className="space-y-2">
                    {[
                      "Revenus ou données financières personnelles",
                      "Informations saisies dans les calculateurs",
                      "Numéros de compte ou données bancaires",
                      "Données d'identification personnelle",
                    ].map(i => (
                      <li key={i} className="flex gap-2 text-xs text-[#8B949E]">
                        <span className="text-[#3DDC97] mt-0.5 flex-shrink-0">✓</span>
                        {i}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {[
              {
                titre: "Stockage local (localStorage)",
                texte: "Certains outils utilisent le stockage local de votre navigateur (localStorage) pour mémoriser vos paramètres entre les sessions. Ces données restent uniquement sur votre appareil — elles ne sont jamais transmises à nos serveurs ni à des tiers.",
                accent: "#60A5FA",
              },
              {
                titre: "Utilisation des données anonymes",
                texte: "Les données anonymes de navigation peuvent être utilisées pour améliorer le site, analyser le trafic et optimiser les outils. Elles ne permettent pas de vous identifier personnellement.",
                accent: "#8B949E",
              },
              {
                titre: "Partage des données",
                texte: "Nous ne vendons pas vos données. Certaines données anonymes peuvent être partagées avec des outils d'analyse (Google Analytics) et des plateformes d'affiliation (pour le suivi des commissions). Ces tiers ont leurs propres politiques de confidentialité.",
                accent: "#8B949E",
              },
              {
                titre: "Cookies",
                texte: "Le site peut utiliser des cookies pour analyser le trafic et améliorer l'expérience utilisateur. Vous pouvez les désactiver dans les paramètres de votre navigateur, ce qui peut affecter certaines fonctionnalités du site.",
                accent: "#8B949E",
              },
              {
                titre: "Sécurité",
                texte: "Nous prenons des mesures raisonnables pour protéger les données anonymes collectées. Étant donné qu'aucune donnée financière personnelle n'est transmise à nos serveurs, le risque lié à une éventuelle fuite est minimal.",
                accent: "#3DDC97",
              },
            ].map(({ titre, texte, accent }) => (
              <div key={titre} className="rounded-2xl p-6" style={{ background: "#161B22", border: "1px solid #21262D" }}>
                <h2 className="text-base font-medium text-[#E6EDF3] mb-2">{titre}</h2>
                <p className="text-xs text-[#8B949E] leading-relaxed">{texte}</p>
              </div>
            ))}

            <div className="rounded-2xl p-6" style={{ background: "#161B22", border: "1px solid #21262D" }}>
              <h2 className="text-base font-medium text-[#E6EDF3] mb-2">Contact</h2>
              <p className="text-xs text-[#8B949E] leading-relaxed">
                Pour toute question concernant cette politique de confidentialité, contactez-nous via la page{" "}
                <a href="/nous-joindre" className="text-[#60A5FA] hover:underline">Nous joindre</a>.
              </p>
            </div>

            <div className="text-center pt-4">
              <a href="/mentions-legales" className="text-xs text-[#484F58] hover:text-[#8B949E] underline">
                Voir aussi : Mentions légales et Conditions d'utilisation →
              </a>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}
