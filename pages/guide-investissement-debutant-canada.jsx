import { useState } from "react";
import Layout from "../components/Layout";
import AffiliateLink from "../components/AffiliateLink";
import Link from "next/link";

export default function GuideInvestissementDebutant() {
  const [openSection, setOpenSection] = useState(null);
  const toggleSection = (id) => setOpenSection(openSection === id ? null : id);

  return (
    <Layout
      title="Guide Investissement Débutant Canada 2026"
      description="Guide complet pour débuter en investissement au Canada : ordre de priorité, CELI vs REER, CELIAPP, FNB, CPG, plateformes. Gratuit, sans jargon, 100% canadien."
      canonical="https://monportefeuille.ca/guide-investissement-debutant-canada"
    >
      {/* Schema Markup */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Guide du Nouvel Investisseur Canadien 2026",
        "description": "Guide complet pour débuter en investissement au Canada : CELI, REER, CELIAPP, FNB, CPG, plateformes, ordre de priorité.",
        "author": { "@type": "Organization", "name": "monportefeuille.ca" },
        "publisher": {
          "@type": "Organization",
          "name": "monportefeuille.ca",
          "logo": { "@type": "ImageObject", "url": "https://monportefeuille.ca/logo.svg" }
        },
        "datePublished": "2026-05-04",
        "dateModified": "2026-05-06",
        "mainEntityOfPage": { "@type": "WebPage", "@id": "https://monportefeuille.ca/guide-investissement-debutant-canada" }
      })}} />

      <div style={{ fontFamily: "var(--font-dm-sans, 'Helvetica Neue', sans-serif)", background: "#0D1117", minHeight: "100vh" }}>
        <style>{`
          .prose { max-width: 75ch; line-height: 1.7; }
          .prose p { margin-bottom: 1.25rem; }
          .prose h2 { margin-top: 3rem; margin-bottom: 1.5rem; }
          .prose h3 { margin-top: 2rem; margin-bottom: 1rem; }
          .prose ul, .prose ol { margin: 1.5rem 0; padding-left: 1.5rem; }
          .prose li { margin-bottom: 0.5rem; }
          .prose table { width: 100%; margin: 2rem 0; border-collapse: collapse; }
          .prose th, .prose td { padding: 0.75rem; border: 1px solid #21262D; text-align: left; }
          .prose th { background: #161B22; font-weight: 600; }
        `}</style>

        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

          {/* Breadcrumbs */}
          <nav aria-label="breadcrumb" className="text-xs text-[#8B949E] mb-6">
            <Link href="/" className="hover:text-[#E6EDF3] transition-colors">Accueil</Link>
            <span className="mx-2">›</span>
            <span className="text-[#E6EDF3]">Guide Investissement Débutant</span>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-[#E6EDF3] mb-4" style={{ fontFamily: "var(--font-dm-mono, monospace)" }}>
              Guide du Nouvel Investisseur Canadien 2026
            </h1>
            <div className="flex flex-wrap gap-4 text-xs text-[#8B949E] mb-6">
              <span>📖 Temps de lecture : ~15 minutes</span>
              <span>•</span>
              <span>Dernière mise à jour : 6 mai 2026</span>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-[#F0A500]/10 border border-[#F0A500]/30 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className="text-sm font-bold text-[#E6EDF3] mb-2">Avertissement important</h3>
                <p className="text-xs text-[#8B949E] leading-relaxed">
                  Ce guide est exclusivement informatif et éducatif. Nous ne sommes pas conseillers financiers et ne fournissons aucun conseil personnalisé.
                  Les informations présentées décrivent des options et comportements couramment observés, mais ne constituent pas une recommandation d'action.
                  Consultez toujours un planificateur financier qualifié (CFP) pour des conseils adaptés à votre situation personnelle.
                </p>
              </div>
            </div>
          </div>

          {/* Table des matières */}
          <div className="bg-[#161B22] border border-[#21262D] rounded-2xl p-6 mb-10">
            <h2 className="text-sm font-bold text-[#E6EDF3] mb-4 uppercase tracking-wide">Table des matières</h2>
            <nav className="space-y-2">
              {[
                { id: "etape-1", label: "Étape 1 : Évalue ta situation financière" },
                { id: "etape-2", label: "Étape 2 : L'ordre de priorité recommandé" },
                { id: "etape-3", label: "Étape 3 : Les véhicules d'épargne (CELI, REER, CELIAPP)" },
                { id: "etape-4", label: "Étape 4 : Quoi acheter à l'intérieur (FNB, CPG, actions)" },
                { id: "etape-5", label: "Étape 5 : Où ouvrir ton compte (plateformes)" },
                { id: "faq",     label: "Questions fréquentes" },
              ].map(({ id, label }) => (
                <a key={id} href={`#${id}`} className="block text-sm text-[#8B949E] hover:text-[#3DDC97] transition-colors">
                  {label}
                </a>
              ))}
            </nav>
          </div>

          {/* Introduction */}
          <div className="prose mb-12">
            <h2 className="text-2xl font-bold text-[#E6EDF3]">Par où commencer quand tout semble compliqué</h2>
            <p className="text-[#C9D1D9]">
              Tu veux commencer à investir, mais tu te sens submergé par les options. CELI, REER, FNB, CPG, robo-advisor,
              courtier autonome : les termes s'empilent et chaque article financier semble te dire quelque chose de différent.
            </p>
            <p className="text-[#C9D1D9]">
              C'est normal. L'industrie financière canadienne est complexe par conception.
            </p>
            <p className="text-[#C9D1D9]">
              Ce guide existe pour une raison simple : te présenter les options disponibles au Canada de façon honnête, sans jargon,
              sans promesses irréalistes, et sans te dire quoi faire : parce qu'investir, c'est personnel.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 my-6">
              <div className="bg-[#161B22] border border-[#21262D] rounded-xl p-5">
                <p className="text-sm font-bold text-[#3DDC97] mb-3">Ce que tu trouveras ici ✓</p>
                <ul className="text-xs text-[#8B949E] space-y-1.5">
                  <li>• L'ordre de priorité couramment observé</li>
                  <li>• Les véhicules d'épargne canadiens (CELI, REER, CELIAPP)</li>
                  <li>• Les types de placements et leurs différences</li>
                  <li>• Les plateformes existantes, leurs frais réels</li>
                  <li>• Les pièges courants à éviter</li>
                </ul>
              </div>
              <div className="bg-[#0D1117] border border-[#30363D] rounded-xl p-5">
                <p className="text-sm font-bold text-red-400 mb-3">Ce que tu ne trouveras PAS ✗</p>
                <ul className="text-xs text-[#8B949E] space-y-1.5">
                  <li>• Des prescriptions ("achète X", "investis Y% dans Z")</li>
                  <li>• Des promesses de rendement</li>
                  <li>• Des formules magiques</li>
                  <li>• Des conseils personnalisés</li>
                </ul>
              </div>
            </div>
          </div>

          {/* ── Étape 1 ── */}
          <section id="etape-1" className="mb-16">
            <h2 className="text-3xl font-bold text-[#E6EDF3] mb-2">Étape 1 : Évalue ta situation financière</h2>
            <p className="text-sm text-[#8B949E] mb-8">Le point de départ que beaucoup sautent</p>

            <div className="prose">
              <p className="text-[#C9D1D9]">
                Avant de choisir où et quoi investir, il est utile de faire un bilan de ta situation actuelle.
                Pourquoi ? Parce qu'investir 200 $/mois dans un CELI alors que tu portes 8 000 $ de dette de carte
                de crédit à 19,99 % est rarement la stratégie la plus efficace mathématiquement.
              </p>

              <h3 className="text-xl font-bold text-[#E6EDF3] mt-8 mb-4">Qu'est-ce que la valeur nette ?</h3>
              <div className="bg-[#161B22] border border-[#21262D] rounded-xl p-5 my-6">
                <p className="text-sm font-mono text-[#3DDC97] mb-4">Valeur nette = Actifs − Passifs</p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-bold text-[#E6EDF3] mb-2">ACTIFS (ce que tu possèdes) : </p>
                    <ul className="text-xs text-[#8B949E] space-y-1">
                      <li>• Comptes bancaires</li>
                      <li>• CELI / REER / CELIAPP existants</li>
                      <li>• Propriété (valeur marchande)</li>
                      <li>• Véhicule</li>
                      <li>• Autres placements</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#E6EDF3] mb-2">PASSIFS (ce que tu dois) : </p>
                    <ul className="text-xs text-[#8B949E] space-y-1">
                      <li>• Prêt étudiant</li>
                      <li>• Dettes de cartes de crédit</li>
                      <li>• Prêt auto</li>
                      <li>• Hypothèque</li>
                      <li>• Marge de crédit</li>
                    </ul>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-[#E6EDF3] mt-8 mb-4">Exemple courant : 28 ans, Montréal</h3>
              <div className="bg-[#0D1117] border border-[#30363D] rounded-xl p-5 my-6 font-mono text-xs">
                <p className="text-[#3DDC97] font-bold mb-3">ACTIFS : </p>
                <p className="text-[#8B949E] mb-1">• Compte chèque : 3 200 $</p>
                <p className="text-[#8B949E] mb-1">• CELI : 1 800 $</p>
                <p className="text-[#8B949E] mb-1">• Voiture : 8 000 $</p>
                <p className="text-[#E6EDF3] font-bold mb-4">TOTAL : 13 000 $</p>
                <p className="text-red-400 font-bold mb-3">PASSIFS : </p>
                <p className="text-[#8B949E] mb-1">• Prêt étudiant AFE : 12 000 $</p>
                <p className="text-[#8B949E] mb-1">• Carte de crédit : 2 400 $</p>
                <p className="text-[#E6EDF3] font-bold mb-4">TOTAL : 14 400 $</p>
                <p className="text-[#F0A500] font-bold">VALEUR NETTE : −1 400 $</p>
              </div>

              <p className="text-[#C9D1D9]">
                Une valeur nette négative n'est ni catastrophique ni rare chez les jeunes professionnels.
                C'est un constat de départ, pas une sentence. La question utile est : quelle est la séquence
                couramment adoptée dans cette situation ?
              </p>

              <h3 className="text-xl font-bold text-[#E6EDF3] mt-8 mb-4">Séquences observées selon le type de dette</h3>
              <div className="space-y-4">
                {[
                  {
                    label: "SITUATION A : Dettes à hauts intérêts (carte de crédit 19 %+)",
                    obs: "Remboursement prioritaire avant investissements",
                    why: "Rendement « garanti » de 19 %+ en économisant les intérêts : difficile à battre"
                  },
                  {
                    label: "SITUATION B : Dettes à bas intérêts (prêt étudiant 3–4 %)",
                    obs: "Remboursement minimal + début d'investissement simultané",
                    why: "Le potentiel de croissance des marchés dépasse généralement le coût de la dette"
                  },
                  {
                    label: "SITUATION C : Sans dette significative",
                    obs: "Fonds d'urgence (3–6 mois de dépenses) en premier, puis investir le surplus",
                    why: "Un coussin de liquidités évite de devoir liquider des placements à perte en cas d'imprévu"
                  },
                ].map(({ label, obs, why }) => (
                  <div key={label} className="bg-[#161B22] border border-[#21262D] rounded-xl p-5">
                    <p className="text-sm font-bold text-[#E6EDF3] mb-2">{label}</p>
                    <p className="text-xs text-[#8B949E] mb-1">📌 Observation : {obs}</p>
                    <p className="text-xs text-[#484F58]">Raison : {why}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#161B22] border border-[#3DDC97]/40 rounded-xl p-6 my-8">
              <Link href="/valeur-nette" className="text-[#3DDC97] font-bold text-sm hover:underline">
                → Calcule ta valeur nette en 2 minutes
              </Link>
              <p className="text-xs text-[#8B949E] mt-2">Bilan complet actifs et passifs : gratuit, aucune donnée transmise.</p>
            </div>
          </section>

          {/* ── Étape 2 : Ordre de priorité ── */}
          <section id="etape-2" className="mb-16">
            <h2 className="text-3xl font-bold text-[#E6EDF3] mb-2">Étape 2 : L'ordre de priorité couramment recommandé</h2>
            <p className="text-sm text-[#8B949E] mb-8">La séquence que beaucoup de planificateurs suggèrent</p>

            <div className="prose">
              <p className="text-[#C9D1D9]">
                Une des questions les plus fréquentes est : « Par quoi commencer ? » Voici l'ordre de priorité
                le plus souvent observé dans la littérature financière canadienne. Ce n'est pas une règle universelle;
                ta situation peut justifier une approche différente.
              </p>
            </div>

            <div className="space-y-4 mt-6">
              {[
                {
                  num: "1",
                  color: "#3DDC97",
                  title: "Fonds d'urgence (3–6 mois de dépenses)",
                  desc: "Avant tout investissement, un coussin de liquidités dans un compte épargne ou CPG à court terme. Sans ce filet, tu pourrais être forcé de liquider des placements au mauvais moment.",
                  note: "Exemple : dépenses mensuelles de 2 500 $ → fonds d'urgence cible : 7 500 $–15 000 $"
                },
                {
                  num: "2",
                  color: "#3DDC97",
                  title: "Dettes à hauts intérêts (>8–10 %)",
                  desc: "Rembourser une carte à 19,99 % équivaut à un rendement garanti de 19,99 %. Aucun placement n'offre ça sans risque. La plupart des planificateurs suggèrent de liquider ces dettes avant d'investir agressivement.",
                  note: null
                },
                {
                  num: "3",
                  color: "#F0A500",
                  title: "REER collectif avec cotisation patronale (si disponible)",
                  desc: "Si ton employeur offre un REER collectif avec cotisation de contrepartie (ex : il verse 0,50 $ pour chaque 1 $ que tu contribues), c'est un rendement immédiat de 50 %. Peu importe le marché, c'est difficile à ignorer.",
                  note: "📌 Vérifie dans ton contrat ou avec les RH : c'est souvent sous-utilisé"
                },
                {
                  num: "4",
                  color: "#60A5FA",
                  title: "CELIAPP (si premier acheteur)",
                  desc: "Combine les avantages CELI + REER pour l'achat d'une première propriété. Double avantage fiscal unique : prioritaire sur CELI/REER si tu comptes acheter dans 5–15 ans.",
                  note: null
                },
                {
                  num: "5",
                  color: "#60A5FA",
                  title: "CELI et/ou REER selon ta situation",
                  desc: "Le choix CELI vs REER dépend principalement de ton taux d'imposition actuel vs futur et de tes objectifs. Voir Étape 3 pour les détails.",
                  note: null
                },
                {
                  num: "6",
                  color: "#484F58",
                  title: "Compte non enregistré (une fois les comptes enregistrés maximisés)",
                  desc: "Une fois CELI et REER maximisés, un compte non enregistré permet d'investir sans plafond : mais les gains sont imposables (gains en capital imposés à 50 %, dividendes selon les crédits applicables).",
                  note: null
                },
              ].map(({ num, color, title, desc, note }) => (
                <div key={num} className="flex gap-4 bg-[#161B22] border border-[#21262D] rounded-xl p-5">
                  <div className="text-2xl font-black flex-shrink-0 w-8 text-center" style={{ color, opacity: 0.4 }}>{num}</div>
                  <div>
                    <p className="text-sm font-bold text-[#E6EDF3] mb-1">{title}</p>
                    <p className="text-xs text-[#8B949E] leading-relaxed">{desc}</p>
                    {note && <p className="text-xs text-[#484F58] mt-2 italic">{note}</p>}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#F0A500]/10 border border-[#F0A500]/30 rounded-xl p-5 mt-6">
              <p className="text-xs text-[#8B949E] leading-relaxed">
                <strong className="text-[#E6EDF3]">Important : </strong> Cette séquence est un cadre général, pas une règle absolue.
                Des facteurs comme l'âge, les objectifs de retraite, un régime de retraite à prestations déterminées (DB pension),
                ou une situation fiscale particulière peuvent changer l'ordre optimal. Un planificateur financier agréé (CFP/Pl.Fin.)
                peut t'aider à personnaliser cette séquence.
              </p>
            </div>
          </section>

          {/* ── Étape 3 : Véhicules d'épargne ── */}
          <section id="etape-3" className="mb-16">
            <h2 className="text-3xl font-bold text-[#E6EDF3] mb-2">Étape 3 : Les véhicules d'épargne canadiens</h2>
            <p className="text-sm text-[#8B949E] mb-8">CELI, REER, CELIAPP : des enveloppes fiscales, pas des placements</p>

            <div className="prose">
              <p className="text-[#C9D1D9]">
                Au Canada, tu choisis non seulement <em>quoi</em> acheter, mais aussi <em>dans quel type de compte</em> le placer.
                Ces comptes sont des enveloppes fiscales : à l'intérieur, tu peux détenir des FNB, des CPG, des actions, etc.
                Le compte lui-même détermine comment tes gains sont imposés.
              </p>

              {/* CELI vs REER */}
              <h3 className="text-xl font-bold text-[#E6EDF3] mt-8 mb-4">A) CELI vs REER : les différences clés</h3>

              <div className="overflow-x-auto my-6">
                <table className="min-w-full text-xs">
                  <thead>
                    <tr className="bg-[#161B22]">
                      <th className="text-left text-[#E6EDF3] p-3 border border-[#21262D]">Caractéristique</th>
                      <th className="text-left text-[#E6EDF3] p-3 border border-[#21262D]">CELI</th>
                      <th className="text-left text-[#E6EDF3] p-3 border border-[#21262D]">REER</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#8B949E]">
                    {[
                      ["Plafond annuel (2025)", "7 000 $ (cumulatif depuis 2009)", "18 % du revenu, max 32 490 $"],
                      ["Déduction fiscale", "Non : cotisation après impôt", "Oui : réduit le revenu imposable"],
                      ["Impôt au retrait", "Aucun : croissance et retraits libres d'impôt", "Oui : imposé comme revenu ordinaire"],
                      ["Récupération des droits", "Droits retirés récupérés le 1er janvier suivant", "Droits perdus définitivement au retrait"],
                      ["Flexibilité", "Retrait possible en tout temps, sans pénalité", "Retenue à la source + perte de droits"],
                      ["Âge limite", "Aucun", "Conversion en FERR obligatoire à 71 ans"],
                      ["Idéal pour", "Objectifs flexibles, revenus bas-modérés", "Retraite, revenus élevés, RAP (maison)"],
                    ].map(([car, celi, reer], i) => (
                      <tr key={car} className={i % 2 === 1 ? "bg-[#0D1117]" : ""}>
                        <td className="p-3 border border-[#21262D] font-medium text-[#C9D1D9]">{car}</td>
                        <td className="p-3 border border-[#21262D]">{celi}</td>
                        <td className="p-3 border border-[#21262D]">{reer}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* CELI droits importants */}
              <div className="bg-[#3DDC97]/10 border border-[#3DDC97]/30 rounded-xl p-5 my-6">
                <p className="text-sm font-bold text-[#E6EDF3] mb-3">📌 Point souvent mal compris : la récupération des droits CELI</p>
                <p className="text-xs text-[#8B949E] leading-relaxed mb-2">
                  Si tu retires 5 000 $ de ton CELI en 2025, ces 5 000 $ sont <strong className="text-[#E6EDF3]">rajoutés à tes droits disponibles le 1er janvier 2026</strong>.
                  Tu peux les re-cotiser à ce moment : pas avant (à moins d'avoir des droits non utilisés).
                </p>
                <p className="text-xs text-[#8B949E] leading-relaxed mb-2">
                  Re-cotiser dans la même année sans droits disponibles entraîne une <strong className="text-red-400]">pénalité de 1 %/mois</strong> sur l'excédent : une erreur fréquente.
                </p>
                <p className="text-xs text-[#484F58]">
                  Droits cumulatifs maximaux en 2026 (si tu avais 18 ans ou plus en 2009 et n'as jamais cotisé) : <strong className="text-[#E6EDF3]">109 000 $</strong>
                </p>
              </div>

              <h3 className="text-xl font-bold text-[#E6EDF3] mt-8 mb-4">Situations où chacun est couramment choisi</h3>
              <div className="grid md:grid-cols-2 gap-4 my-6">
                <div className="bg-[#F0A500]/10 border border-[#F0A500]/30 rounded-xl p-5">
                  <p className="text-sm font-bold text-[#E6EDF3] mb-3">CELI souvent privilégié : </p>
                  <ul className="text-xs text-[#8B949E] space-y-1.5">
                    <li>• Revenus sous 55 000 $ (faible avantage fiscal REER)</li>
                    <li>• Objectifs à court-moyen terme (mise de fonds, voyage, voiture)</li>
                    <li>• Besoin de flexibilité (retrait sans pénalité)</li>
                    <li>• Déjà bénéficiaire de prestations basées sur le revenu (GIS, etc.)</li>
                  </ul>
                </div>
                <div className="bg-[#60A5FA]/10 border border-[#60A5FA]/30 rounded-xl p-5">
                  <p className="text-sm font-bold text-[#E6EDF3] mb-3">REER souvent avantageux : </p>
                  <ul className="text-xs text-[#8B949E] space-y-1.5">
                    <li>• Revenus au-dessus de 70 000 $ (économie fiscale substantielle)</li>
                    <li>• Horizon retraite 20+ ans</li>
                    <li>• Prévision de revenus futurs inférieurs aux revenus actuels</li>
                    <li>• Achat d'une première maison via le <strong className="text-[#C9D1D9]">RAP (60 000 $)</strong></li>
                  </ul>
                </div>
              </div>

              <div className="bg-[#161B22] border border-[#21262D] rounded-xl p-5 my-6">
                <p className="text-sm font-bold text-[#E6EDF3] mb-2">Utilise notre estimateur pour voir ton économie REER exacte : </p>
                <Link href="/estimateur-impot" className="text-[#C084FC] hover:underline text-xs">
                  → Estimateur d'impôt : calcule ton remboursement REER selon ta province
                </Link>
              </div>

              {/* CELIAPP */}
              <h3 className="text-xl font-bold text-[#E6EDF3] mt-10 mb-4">B) CELIAPP : Pour les premiers acheteurs</h3>
              <p className="text-[#C9D1D9]">
                Le Compte d'épargne libre d'impôt pour l'achat d'une première propriété (CELIAPP) est disponible depuis avril 2023.
                Il combine les avantages fiscaux du REER et du CELI dans un seul compte.
              </p>

              <div className="grid md:grid-cols-2 gap-4 my-6">
                <div className="bg-[#0D1117] border border-[#30363D] rounded-xl p-5">
                  <p className="text-sm font-bold text-[#E6EDF3] mb-3">Caractéristiques : </p>
                  <ul className="text-xs text-[#8B949E] space-y-1.5">
                    <li>• Plafond annuel : 8 000 $ (max 40 000 $ à vie)</li>
                    <li>• Déduction fiscale immédiate (comme le REER)</li>
                    <li>• Retrait libre d'impôt pour achat d'une maison (comme le CELI)</li>
                    <li>• Droits non utilisés reportables à l'année suivante</li>
                    <li>• Si non utilisé, fermé après 15 ans : fonds transférables au REER</li>
                  </ul>
                </div>
                <div className="bg-[#0D1117] border border-[#30363D] rounded-xl p-5">
                  <p className="text-sm font-bold text-[#E6EDF3] mb-3">Conditions d'admissibilité : </p>
                  <ul className="text-xs text-[#8B949E] space-y-1.5">
                    <li>• Résider au Canada</li>
                    <li>• Ne pas avoir possédé une résidence principale <strong className="text-[#C9D1D9]">au cours de l'année en cours ni des 4 années civiles précédentes</strong></li>
                    <li>• Acheter avant le 31 décembre de l'année où tu as 71 ans</li>
                  </ul>
                  <p className="text-[10px] text-[#484F58] mt-3">
                    ⚠️ La règle des 4 ans exclut plusieurs personnes qui ont vendu une maison récemment.
                    Vérifie ton admissibilité auprès de l'ARC.
                  </p>
                </div>
              </div>

              {/* RAP */}
              <div className="bg-[#161B22] border border-[#21262D] rounded-xl p-5 my-6">
                <p className="text-sm font-bold text-[#E6EDF3] mb-2">Le RAP (Régime d'accession à la propriété) : alternative REER</p>
                <p className="text-xs text-[#8B949E] leading-relaxed">
                  Si tu as des fonds dans un REER, le RAP te permet de retirer jusqu'à <strong className="text-[#C9D1D9]">60 000 $</strong> (limite relevée en 2024)
                  pour l'achat d'une première propriété, sans impôt immédiat. Tu dois rembourser le montant dans ton REER sur 15 ans.
                  CELIAPP et RAP peuvent être utilisés en combinaison.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 my-8">
              <div className="bg-[#161B22] border border-[#3DDC97]/40 rounded-xl p-6">
                <Link href="/calculateur-celi" className="text-[#3DDC97] font-bold text-sm hover:underline">
                  → Projette la croissance de ton CELI jusqu'à la retraite
                </Link>
              </div>
              <div className="bg-[#161B22] border border-[#3DDC97]/40 rounded-xl p-6">
                <Link href="/calculateur-reer" className="text-[#3DDC97] font-bold text-sm hover:underline">
                  → Calcule ton remboursement d'impôt REER
                </Link>
              </div>
            </div>
          </section>

          {/* ── Étape 4 : Types de placements ── */}
          <section id="etape-4" className="mb-16">
            <h2 className="text-3xl font-bold text-[#E6EDF3] mb-2">Étape 4 : Quoi acheter à l'intérieur des comptes</h2>
            <p className="text-sm text-[#8B949E] mb-8">Du plus simple au plus complexe</p>

            <div className="prose">
              <p className="text-[#C9D1D9]">
                Une fois que tu sais <em>où</em> mettre ton argent (CELI, REER, CELIAPP), il faut choisir <em>quoi</em> acheter à l'intérieur.
                Ces comptes sont des contenants vides : tu dois y déposer des placements.
              </p>

              {/* CPG */}
              <div className="bg-[#161B22] border border-[#21262D] rounded-xl p-6 my-6">
                <h3 className="text-lg font-bold text-[#E6EDF3] mb-1">1. CPG : Certificat de placement garanti</h3>
                <p className="text-xs text-[#484F58] mb-4">Option la plus conservatrice : idéale pour l'épargne à court terme</p>
                <p className="text-sm text-[#C9D1D9] mb-4">
                  Un CPG est un dépôt à terme auprès d'une banque ou caisse : tu immobilises ton argent pour une période définie
                  (3 mois à 5 ans) en échange d'un taux d'intérêt garanti. Aucun risque de perdre le capital.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold text-[#E6EDF3] mb-2">Avantages : </p>
                    <ul className="text-xs text-[#8B949E] space-y-1">
                      <li>• Capital 100 % garanti</li>
                      <li>• Protégé par la SADC (jusqu'à 100 000 $ par catégorie)</li>
                      <li>• Taux compétitifs récents : 3,5–5 % sur 1 an</li>
                      <li>• Utilisable dans un CELI ou REER</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#E6EDF3] mb-2">Limites : </p>
                    <ul className="text-xs text-[#8B949E] space-y-1">
                      <li>• Argent souvent bloqué jusqu'à échéance</li>
                      <li>• Rendement plafonné : pas de croissance au-delà du taux</li>
                      <li>• Sous-performe historiquement les marchés sur 20+ ans</li>
                    </ul>
                  </div>
                </div>
                <p className="text-[10px] text-[#484F58] mt-4">
                  📌 Couramment utilisé pour : fonds d'urgence, mise de fonds maison à horizon court, investisseurs très conservateurs.
                </p>
              </div>

              {/* FNB */}
              <div className="bg-[#161B22] border border-[#21262D] rounded-xl p-6 my-6">
                <h3 className="text-lg font-bold text-[#E6EDF3] mb-1">2. FNB tout-en-un : L'option la plus courante chez débutants</h3>
                <p className="text-xs text-[#484F58] mb-4">Un seul achat = diversification mondiale instantanée</p>
                <p className="text-sm text-[#C9D1D9] mb-4">
                  Un FNB (Fonds Négocié en Bourse) est un « panier » de centaines ou milliers d'actions et obligations mondiales,
                  acheté comme une seule action en bourse. Les FNB tout-en-un comme VGRO ou XGRO incluent déjà un rééquilibrage automatique.
                </p>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr className="bg-[#0D1117]">
                        <th className="text-left text-[#E6EDF3] p-3 border border-[#21262D]">Symbole</th>
                        <th className="text-left text-[#E6EDF3] p-3 border border-[#21262D]">Actions / Obligations</th>
                        <th className="text-left text-[#E6EDF3] p-3 border border-[#21262D]">Profil de risque</th>
                        <th className="text-left text-[#E6EDF3] p-3 border border-[#21262D]">Frais annuels</th>
                      </tr>
                    </thead>
                    <tbody className="text-[#8B949E]">
                      {[
                        ["VEQT / XEQT", "100 % / 0 %", "Croissance élevée", "0,24 %"],
                        ["VGRO / XGRO", "80 % / 20 %", "Croissance modérée-élevée", "0,24 %"],
                        ["VBAL / XBAL", "60 % / 40 %", "Équilibré", "0,24 %"],
                        ["VCNS / XCNS", "40 % / 60 %", "Conservateur", "0,24 %"],
                      ].map(([sym, alloc, profil, frais], i) => (
                        <tr key={sym} className={i % 2 === 1 ? "bg-[#0D1117]" : ""}>
                          <td className="p-3 border border-[#21262D] font-mono text-[#F0A500]">{sym}</td>
                          <td className="p-3 border border-[#21262D]">{alloc}</td>
                          <td className="p-3 border border-[#21262D]">{profil}</td>
                          <td className="p-3 border border-[#21262D]">{frais}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-[10px] text-[#484F58] mt-3">
                  V = Vanguard Canada, X = iShares (BlackRock Canada). Les deux familles sont bien établies et largement utilisées.
                  Les frais sont approximatifs : vérifier sur le site de chaque gestionnaire.
                </p>
              </div>

              {/* Actions et autres */}
              <div className="bg-[#161B22] border border-[#21262D] rounded-xl p-6 my-6">
                <h3 className="text-lg font-bold text-[#E6EDF3] mb-1">3. Fonds communs de placement</h3>
                <p className="text-xs text-[#484F58] mb-3">Offerts principalement par les banques et conseillers</p>
                <p className="text-sm text-[#C9D1D9] mb-3">
                  Similaires aux FNB dans leur principe (panier diversifié), mais achetés directement auprès d'une institution, sans passer par la bourse.
                </p>
                <p className="text-xs text-[#8B949E]">
                  ⚠️ Les frais de gestion (RFG) sont souvent beaucoup plus élevés que les FNB : entre 1,5 % et 2,5 %/an.
                  Sur 25 ans, cet écart peut représenter des dizaines de milliers de dollars de différence sur un même portefeuille.
                </p>
              </div>

              {/* Ce qu'on évite */}
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 my-6">
                <p className="text-sm font-bold text-[#E6EDF3] mb-3">Ce que beaucoup évitent en début de parcours : </p>
                <ul className="text-xs text-[#8B949E] space-y-2">
                  <li>• <strong className="text-[#C9D1D9]">Actions individuelles : </strong> Sélectionner les bons titres requiert temps, expertise et discipline. Les études montrent que la grande majorité des investisseurs actifs sous-performent un simple FNB indiciel sur 10–20 ans.</li>
                  <li>• <strong className="text-[#C9D1D9]">Cryptomonnaies comme placement principal : </strong> Volatilité extrême, cadre réglementaire limité, aucune garantie. Certains les incluent comme portion spéculative mineure d'un portefeuille, pas comme base.</li>
                  <li>• <strong className="text-[#C9D1D9]">Produits à effet de levier (options, contrats à terme) : </strong> Possibilité de pertes supérieures au capital investi. Non recommandés sans expérience avancée.</li>
                  <li>• <strong className="text-[#C9D1D9]">Fonds communs à frais élevés (2 %+) : </strong> Les frais érodent les rendements de façon significative sur un horizon long.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* ── Étape 5 : Plateformes ── */}
          <section id="etape-5" className="mb-16">
            <h2 className="text-3xl font-bold text-[#E6EDF3] mb-2">Étape 5 : Où ouvrir ton compte</h2>
            <p className="text-sm text-[#8B949E] mb-8">Les plateformes canadiennes et leurs différences réelles</p>

            <div className="prose">
              <p className="text-[#C9D1D9] mb-6">
                Une fois que tu sais <em>quoi</em> acheter et <em>dans quel compte</em>, il faut choisir <em>où</em> l'ouvrir.
                Trois grandes catégories existent au Canada.
              </p>

              <div className="space-y-6">

                {/* Robo-advisors */}
                <div className="bg-[#161B22] border border-[#21262D] rounded-xl p-6">
                  <h3 className="text-lg font-bold text-[#E6EDF3] mb-1">1. Robo-Advisors : Gestion automatisée</h3>
                  <p className="text-xs text-[#484F58] mb-4">Exemples : Wealthsimple Invest, Questwealth, BMO SmartFolio</p>
                  <div className="grid md:grid-cols-2 gap-4 text-xs mb-4">
                    <div>
                      <p className="font-bold text-[#E6EDF3] mb-2">Comment ça fonctionne : </p>
                      <ul className="text-[#8B949E] space-y-1">
                        <li>• Questionnaire risque / objectifs</li>
                        <li>• Portfolio créé et géré automatiquement</li>
                        <li>• Rééquilibrage automatique inclus</li>
                        <li>• Aucune décision manuelle requise</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-bold text-[#E6EDF3] mb-2">Pour qui : </p>
                      <ul className="text-[#8B949E] space-y-1">
                        <li>• Débutants absolus</li>
                        <li>• Ceux qui préfèrent déléguer</li>
                        <li>• Peu de temps à consacrer</li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-[#0D1117] rounded-lg p-4 text-xs">
                    <p className="font-bold text-[#E6EDF3] mb-2">Frais réels à prévoir : </p>
                    <ul className="text-[#8B949E] space-y-1">
                      <li>• Wealthsimple Invest (robo) : <strong className="text-[#C9D1D9]">0,50 %/an</strong> sous 100 000 $ : <strong className="text-[#C9D1D9]">0,40 %/an</strong> au-dessus</li>
                      <li>• Questwealth : 0,25 %/an (+ frais FNB internes ~0,20 %)</li>
                      <li>• BMO SmartFolio : 0,40–0,70 %/an selon solde</li>
                    </ul>
                    <p className="text-[#484F58] mt-2">📌 Ces frais s'ajoutent aux frais internes des FNB détenus (~0,20 %). Total réel ≈ 0,45–0,70 %/an.</p>
                  </div>
                </div>

                {/* Courtiers autonomes */}
                <div className="bg-[#161B22] border border-[#21262D] rounded-xl p-6">
                  <h3 className="text-lg font-bold text-[#E6EDF3] mb-1">2. Courtiers Autonomes : Gestion manuelle (DIY)</h3>
                  <p className="text-xs text-[#484F58] mb-4">Exemples : Wealthsimple Trade, Questrade, Disnat (Desjardins), BNCD (Banque Nationale)</p>
                  <div className="grid md:grid-cols-2 gap-4 text-xs mb-4">
                    <div>
                      <p className="font-bold text-[#E6EDF3] mb-2">Comment ça fonctionne : </p>
                      <ul className="text-[#8B949E] space-y-1">
                        <li>• Tu achètes toi-même les FNB ou actions</li>
                        <li>• Aucun conseil ni gestion automatique</li>
                        <li>• Tu fais le rééquilibrage toi-même</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-bold text-[#E6EDF3] mb-2">Pour qui : </p>
                      <ul className="text-[#8B949E] space-y-1">
                        <li>• Investisseurs qui ont fait leurs recherches</li>
                        <li>• Acheteurs de FNB tout-en-un (1–2 transactions/mois)</li>
                        <li>• Ceux qui veulent minimiser les frais totaux</li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-[#0D1117] rounded-lg p-4 text-xs">
                    <p className="font-bold text-[#E6EDF3] mb-2">Frais de transaction : </p>
                    <ul className="text-[#8B949E] space-y-1">
                      <li>• Wealthsimple Trade : 0 $ pour titres canadiens</li>
                      <li>• Questrade : 0 $ pour achats de FNB, 4,95–9,95 $ pour ventes</li>
                      <li>• Disnat / BNCD : variables selon le plan</li>
                    </ul>
                    <p className="text-[#484F58] mt-2">📌 Pour un investisseur achetant des FNB chaque mois, les frais totaux peuvent se limiter aux frais internes du FNB (~0,24 %/an).</p>
                  </div>
                </div>

                {/* Banques traditionnelles */}
                <div className="bg-[#161B22] border border-[#21262D] rounded-xl p-6">
                  <h3 className="text-lg font-bold text-[#E6EDF3] mb-1">3. Conseiller bancaire / Planificateur financier</h3>
                  <p className="text-xs text-[#484F58] mb-4">Banques traditionnelles (RBC, TD, Desjardins, BMO, Scotia, CIBC)</p>
                  <p className="text-xs text-[#8B949E] leading-relaxed mb-3">
                    Option accessible pour ceux qui préfèrent une relation humaine, des conseils globaux (assurances, planification
                    successorale, fiscalité) et un suivi personnalisé. Les produits offerts (fonds communs maison) ont souvent des
                    frais plus élevés qu'un FNB indiciel autonome, mais l'accompagnement et la discipline peuvent en valoir le coût
                    pour certains profils.
                  </p>
                  <p className="text-[10px] text-[#484F58]">
                    📌 Pour des décisions importantes (planification retraite, assurances, régimes de pension, successions),
                    un planificateur financier agréé (Pl.Fin. / CFP) est le meilleur interlocuteur : indépendamment de la plateforme choisie.
                  </p>
                </div>

              </div>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section id="faq" className="mb-16">
            <h2 className="text-3xl font-bold text-[#E6EDF3] mb-6">Questions fréquentes</h2>
            <div className="space-y-3">
              {[
                {
                  q: "Combien faut-il avoir avant de commencer à investir ?",
                  a: "Aucun montant minimum absolu. Wealthsimple Trade permet de commencer avec 1 $. En pratique, 500–1 000 $ constitue souvent un seuil pratique pour que les frais de transaction (s'il y en a) ne soient pas disproportionnés. Plus important : commencer tôt, même avec peu, donne du temps à l'intérêt composé de travailler."
                },
                {
                  q: "CELI ou REER en premier ?",
                  a: "La règle souvent observée : revenus < 50 000 $ → CELI en priorité (peu d'avantage fiscal REER, flexibilité utile). Revenus > 70 000 $ → REER souvent avantageux (économie d'impôt immédiate significative). Entre 50–70 000 $ → souvent une combinaison. Si premier acheteur → prioriser CELIAPP avant CELI/REER. Utilise notre estimateur d'impôt pour simuler ton économie REER exacte."
                },
                {
                  q: "Quel FNB choisir pour débuter ?",
                  a: "Observation courante chez débutants : FNB tout-en-un (VGRO ou XGRO si tolérance au risque élevée, VBAL ou XBAL si modérée). Un seul titre = diversification mondiale automatique + rééquilibrage inclus. Frais autour de 0,24 %/an. L'avantage principal : tu n'as pas à décider quoi acheter chaque mois : tu achètes toujours le même titre."
                },
                {
                  q: "Dois-je attendre le « bon moment » pour investir ?",
                  a: "L'approche la plus couramment documentée : contributions régulières mensuelles (dollar-cost averaging) plutôt que tenter de « timer » le marché. Historiquement, même les personnes qui ont investi juste avant une correction majeure ont généralement bien performé sur 10+ ans. Le risque de rester sur la touche trop longtemps est réel."
                },
                {
                  q: "Puis-je perdre tout mon argent avec des FNB ?",
                  a: "Avec des FNB diversifiés mondiaux (ex : VGRO, qui détient des milliers d'entreprises dans des dizaines de pays), une perte totale nécessiterait un effondrement économique mondial complet : hautement improbable historiquement. Des baisses temporaires importantes (30–50 %) sont normales et se sont toutes récupérées à ce jour. La durée de détention est le facteur clé. Avec des actions individuelles ou des cryptomonnaies : oui, une perte totale est possible."
                },
                {
                  q: "Mon employeur offre un REER collectif : est-ce que je devrais y cotiser ?",
                  a: "Si ton employeur verse une cotisation de contrepartie (matching), oui : c'est généralement la priorité absolue avant tout autre investissement. Un employeur qui verse 50 % de ta cotisation te donne un rendement immédiat de 50 % avant même que les marchés bougent. Vérifie les conditions (période de vesting, plafond de cotisation éligible) auprès de tes RH."
                },
                {
                  q: "Quelle est la différence entre Wealthsimple Trade et Wealthsimple Invest ?",
                  a: "Ce sont deux produits distincts. Wealthsimple Trade est un courtier autonome (DIY) : tu achètes toi-même des FNB ou actions, sans frais de commission sur les titres canadiens. Wealthsimple Invest est un robo-advisor : le portefeuille est géré automatiquement pour toi, moyennant des frais de 0,50 %/an (sous 100 000 $) ou 0,40 %/an (au-dessus), en plus des frais internes des FNB. Les deux permettent d'ouvrir un CELI, un REER, etc."
                },
                {
                  q: "J'ai retiré 10 000 $ de mon CELI cette année. Puis-je les remettre ?",
                  a: "Pas dans la même année civile, à moins d'avoir des droits de cotisation disponibles. Les 10 000 $ retirés seront ajoutés à tes droits disponibles le 1er janvier de l'année suivante. Re-cotiser avant sans avoir les droits entraîne une pénalité de 1 %/mois sur l'excédent : une erreur fréquente. Vérifie tes droits disponibles sur Mon dossier ARC (canada.ca)."
                },
              ].map((faq, i) => (
                <div key={i} className="bg-[#161B22] border border-[#21262D] rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleSection(`faq-${i}`)}
                    className="w-full text-left px-6 py-4 flex justify-between items-center gap-4 hover:bg-[#0E1520] transition-colors"
                  >
                    <span className="text-sm font-medium text-[#E6EDF3]">{faq.q}</span>
                    <span className="text-[#8B949E] flex-shrink-0">{openSection === `faq-${i}` ? "−" : "+"}</span>
                  </button>
                  {openSection === `faq-${i}` && (
                    <div className="px-6 pb-4">
                      <p className="text-xs text-[#8B949E] leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Conclusion */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-[#E6EDF3] mb-6">En résumé</h2>
            <div className="prose">
              <p className="text-[#C9D1D9]">
                Investir n'est pas une science exacte avec des formules universelles. C'est une série de décisions
                personnelles basées sur ta situation, tes objectifs, ta tolérance au risque et ton horizon temporel.
              </p>
              <p className="text-[#C9D1D9]">
                Ce guide t'a présenté les options couramment observées et les règles réelles qui les gouvernent.
                Que tu choisisses CELI ou REER, FNB tout-en-un ou CPG, robo-advisor ou courtier autonome,
                l'important est de commencer de façon informée et cohérente avec ta situation.
              </p>
              <div className="bg-[#3DDC97]/10 border border-[#3DDC97]/30 rounded-xl p-6 my-8">
                <p className="text-sm font-bold text-[#E6EDF3] mb-3">Prochaines étapes suggérées : </p>
                <ol className="text-xs text-[#8B949E] space-y-2 list-decimal list-inside">
                  <li><Link href="/valeur-nette" className="text-[#3DDC97] hover:underline">Fais ton bilan financier</Link> : valeur nette, dettes, actifs</li>
                  <li><Link href="/estimateur-impot" className="text-[#3DDC97] hover:underline">Évalue ton économie REER selon ta province</Link></li>
                  <li><Link href="/calculateur-celi" className="text-[#3DDC97] hover:underline">Projette ta croissance CELI jusqu'à la retraite</Link></li>
                  <li><Link href="/celi-vs-reer" className="text-[#3DDC97] hover:underline">Compare CELI vs REER selon ta situation</Link></li>
                  <li>Consulte un planificateur financier agréé (Pl.Fin. / CFP) pour une analyse personnalisée</li>
                </ol>
              </div>
              <p className="text-[#C9D1D9]">
                N'oublie pas : ce guide est informatif, pas prescriptif. Les montants, stratégies et choix présentés
                reflètent ce qui est couramment observé : pas nécessairement ce qui conviendra à ta situation unique.
              </p>
              <p className="text-[#C9D1D9] font-medium">Bonne chance dans ton parcours d'investissement. 🎯</p>
            </div>
          </section>

          {/* CTA Final */}
          <div className="bg-[#161B22] border border-[#21262D] rounded-2xl p-8 mb-8">
            <h3 className="text-xl font-bold text-[#E6EDF3] mb-3 text-center">Prêt à ouvrir ton premier compte ?</h3>
            <p className="text-sm text-[#8B949E] text-center mb-6 max-w-2xl mx-auto">
              Wealthsimple Trade permet d'ouvrir un CELI ou REER et d'acheter des FNB sans commission sur les titres canadiens.
              Interface en français, entièrement en ligne. Protégé par l'OCRI.
            </p>
            <div className="flex justify-center">
              <AffiliateLink href="https://www.wealthsimple.com/invite/EDVQ3W" partner="wealthsimple-guide">
                <button className="bg-[#3DDC97] text-[#0D1117] font-bold rounded-xl px-8 py-4 hover:opacity-90 transition-opacity">
                  Ouvrir un compte Wealthsimple →
                </button>
              </AffiliateLink>
            </div>
            <p className="text-[10px] text-[#484F58] text-center mt-4">
              Lien affilié : monportefeuille.ca reçoit une commission si tu ouvres un compte, sans frais pour toi.
            </p>
          </div>

          {/* Retour en haut */}
          <div className="text-center mb-8">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-sm text-[#8B949E] hover:text-[#3DDC97] transition-colors"
            >
              ↑ Retour en haut
            </button>
          </div>

        </div>
      </div>
    </Layout>
  );
}
