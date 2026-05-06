import { useState } from "react";
import Layout from "../components/Layout";
import Link from "next/link";

const FAQ_ITEMS = [
  {
    q: "Vérifier ma cote de crédit la fait-elle baisser?",
    a: "Non. Vérifier toi-même ta cote est une vérification douce (soft check) et n'a aucun impact. Seules les vérifications dures (hard checks) — faites par un prêteur lors d'une demande de crédit — peuvent temporairement affecter ta cote.",
  },
  {
    q: "Est-ce que porter un solde sur ma carte améliore ma cote?",
    a: "Non, c'est un mythe très répandu. Tu n'as pas besoin de payer des intérêts pour bâtir ton crédit. Utilise ta carte, puis rembourse le solde en entier chaque mois. Tu bâtis ton historique sans payer un cent d'intérêts.",
  },
  {
    q: "Fermer une vieille carte de crédit est-il une bonne idée?",
    a: "Généralement non. Fermer une vieille carte réduit ton crédit total disponible (ce qui augmente ton taux d'utilisation) et raccourcit ton historique de crédit. Sauf si la carte a des frais annuels élevés sans avantages, il est souvent préférable de la garder active avec de petits achats occasionnels.",
  },
  {
    q: "Combien de temps un retard de paiement reste-t-il au dossier?",
    a: "En général 6 à 7 ans à partir de la date de l'incident, selon le bureau de crédit (Equifax ou TransUnion). Son impact sur ta cote diminue avec le temps, surtout si tu maintiens de bonnes habitudes par la suite.",
  },
  {
    q: "Est-ce que mon conjoint(e) a accès à ma cote de crédit?",
    a: "Non. Au Canada, chaque personne a son propre dossier de crédit, indépendant de celui de son partenaire. Vous pouvez cependant vous affecter mutuellement si vous cosignez un prêt ou ouvrez un compte joint.",
  },
  {
    q: "Quelle est la différence entre Equifax et TransUnion?",
    a: "Ce sont deux bureaux de crédit indépendants qui compilent chacun leur propre dossier. Ils reçoivent les informations des mêmes prêteurs mais peuvent différer légèrement dans leurs données. C'est pourquoi certains prêteurs consultent les deux. Il est recommandé de vérifier ton dossier auprès des deux bureaux une fois par an.",
  },
  {
    q: "Peut-on bâtir un crédit au Canada sans carte de crédit?",
    a: "Oui. Les paiements de prêts auto, prêts étudiants et hypothèques sont rapportés aux bureaux de crédit. Certains fournisseurs de services (télécommunications, certains loyers) peuvent aussi rapporter les paiements. Les prêts pour bâtir le crédit (credit builder loans) sont aussi une option.",
  },
  {
    q: "Mon score Borrowell est différent de mon score TransUnion — lequel est exact?",
    a: "Les deux sont exacts mais utilisent des modèles de calcul différents (Borrowell utilise le score Equifax, Credit Karma utilise TransUnion). Les prêteurs utilisent souvent leur propre modèle de score interne. L'important est la tendance générale, pas le chiffre exact.",
  },
];

export default function GuideCoteDeCredit() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <Layout
      title="Guide Cote de Crédit Canada 2026 — Bâtir et Améliorer son Score"
      description="Guide complet pour comprendre, vérifier et améliorer sa cote de crédit au Canada. Les 5 facteurs, les erreurs à éviter, et les étapes concrètes pour bâtir un excellent dossier."
      canonical="https://monportefeuille.ca/guide-cote-de-credit-canada"
    >
      {/* Schema Markup */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Guide Complet — Cote de Crédit au Canada 2026",
        "description": "Comment comprendre, vérifier et améliorer sa cote de crédit au Canada. Les 5 facteurs, les erreurs à éviter, et les étapes concrètes.",
        "author": { "@type": "Organization", "name": "monportefeuille.ca" },
        "publisher": {
          "@type": "Organization",
          "name": "monportefeuille.ca",
          "logo": { "@type": "ImageObject", "url": "https://monportefeuille.ca/logo.svg" }
        },
        "datePublished": "2026-05-06",
        "dateModified": "2026-05-06",
        "mainEntityOfPage": { "@type": "WebPage", "@id": "https://monportefeuille.ca/guide-cote-de-credit-canada" }
      })}} />

      <div style={{ fontFamily: "var(--font-dm-sans, 'Helvetica Neue', sans-serif)" }}>
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
            <span className="text-[#E6EDF3]">Guide — Cote de crédit au Canada</span>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-[#E6EDF3] mb-4" style={{ fontFamily: "var(--font-dm-mono, monospace)" }}>
              Cote de crédit au Canada — Guide complet 2026
            </h1>
            <div className="flex flex-wrap gap-4 text-xs text-[#8B949E] mb-6">
              <span>📖 Temps de lecture : ~12 minutes</span>
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
                  Les informations décrivent des mécanismes généraux du crédit au Canada et ne constituent pas une recommandation d'action.
                  Pour une situation complexe (faillite, proposition de consommateur, dettes importantes), consultez un syndic autorisé en insolvabilité ou un conseiller en crédit agréé.
                </p>
              </div>
            </div>
          </div>

          {/* Table des matières */}
          <div className="bg-[#161B22] border border-[#21262D] rounded-2xl p-6 mb-10">
            <h2 className="text-sm font-bold text-[#E6EDF3] mb-4 uppercase tracking-wide">Table des matières</h2>
            <nav className="space-y-2">
              {[
                { id: "quest-ce-que", label: "1 — C'est quoi une cote de crédit?" },
                { id: "comment-calculee", label: "2 — Comment est-elle calculée?" },
                { id: "niveaux", label: "3 — Les niveaux de cote au Canada" },
                { id: "verifier", label: "4 — Comment vérifier sa cote gratuitement" },
                { id: "ameliorer", label: "5 — 7 habitudes pour améliorer sa cote" },
                { id: "erreurs", label: "6 — Les erreurs qui font baisser la cote" },
                { id: "delais", label: "7 — Combien de temps pour s'améliorer?" },
                { id: "zero", label: "8 — Bâtir un crédit de zéro" },
                { id: "faq", label: "Questions fréquentes" },
              ].map(({ id, label }) => (
                <a key={id} href={`#${id}`} className="block text-sm text-[#8B949E] hover:text-[#3DDC97] transition-colors">
                  {label}
                </a>
              ))}
            </nav>
          </div>

          {/* Introduction */}
          <div className="prose mb-12">
            <h2 className="text-2xl font-bold text-[#E6EDF3]">Un chiffre qui influence presque tout</h2>
            <p className="text-[#C9D1D9]">
              Ta cote de crédit, c'est un peu ton bulletin financier. Elle influence le taux d'intérêt sur ton hypothèque,
              l'approbation de ta carte de crédit, la location d'un appartement, parfois même une vérification d'employeur.
              Un excellent dossier peut te faire économiser des dizaines de milliers de dollars sur la durée d'un prêt hypothécaire.
            </p>
            <p className="text-[#C9D1D9]">
              Pourtant, la majorité des Canadiens ne savent pas comment leur cote est calculée, et encore moins comment
              l'améliorer concrètement. Ce guide change ça.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 my-6">
              <div className="bg-[#161B22] border border-[#21262D] rounded-xl p-5">
                <p className="text-sm font-bold text-[#3DDC97] mb-3">Ce que tu trouveras ici ✓</p>
                <ul className="text-xs text-[#8B949E] space-y-1.5">
                  <li>• Comment fonctionne vraiment le système de crédit</li>
                  <li>• Les 5 facteurs qui déterminent ton score</li>
                  <li>• Les habitudes concrètes pour progresser</li>
                  <li>• Les erreurs les plus courantes à éviter</li>
                  <li>• Comment bâtir un crédit de zéro</li>
                </ul>
              </div>
              <div className="bg-[#0D1117] border border-[#30363D] rounded-xl p-5">
                <p className="text-sm font-bold text-red-400 mb-3">Ce que tu ne trouveras PAS ✗</p>
                <ul className="text-xs text-[#8B949E] space-y-1.5">
                  <li>• Des promesses d'amélioration rapide</li>
                  <li>• Des "hacks" miracles</li>
                  <li>• Des conseils personnalisés sur ta dette</li>
                  <li>• Des conseils juridiques</li>
                </ul>
              </div>
            </div>
          </div>

          {/* ── Section 1 ── */}
          <section id="quest-ce-que" className="mb-14">
            <h2 className="text-3xl font-bold text-[#E6EDF3] mb-2">1 — C'est quoi une cote de crédit?</h2>
            <p className="text-sm text-[#8B949E] mb-8">Equifax, TransUnion, et la plage 300–900</p>
            <div className="prose">
              <p className="text-[#C9D1D9]">
                La cote de crédit est un chiffre entre <strong className="text-[#E6EDF3]">300 et 900</strong> qui résume
                ton comportement passé en matière de crédit. Plus il est élevé, plus tu es considéré comme un emprunteur fiable.
              </p>
              <p className="text-[#C9D1D9]">
                Au Canada, deux bureaux de crédit compilent et calculent ces informations de façon indépendante :
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-6">
              {[
                {
                  name: "Equifax Canada",
                  desc: "Fondé en 1899. Utilisé par la majorité des grandes banques canadiennes. Borrowell te donne accès à ton score Equifax gratuitement.",
                  color: "#3DDC97",
                },
                {
                  name: "TransUnion Canada",
                  desc: "Opère au Canada depuis les années 1980. Utilisé par de nombreux prêteurs alternatifs et Credit Karma. Certains prêteurs consultent les deux.",
                  color: "#60A5FA",
                },
              ].map(b => (
                <div key={b.name} className="bg-[#161B22] border border-[#21262D] rounded-2xl p-5">
                  <div className="text-sm font-bold mb-2" style={{ color: b.color }}>{b.name}</div>
                  <p className="text-xs text-[#8B949E] leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#3DDC97]/10 border border-[#3DDC97]/25 rounded-2xl p-5 mt-6">
              <p className="text-xs text-[#8B949E] leading-relaxed">
                <span className="text-[#3DDC97] font-medium">À savoir : </span>
                Les deux bureaux reçoivent leurs informations des mêmes prêteurs, mais peuvent différer légèrement.
                Il est possible d'avoir une cote légèrement différente chez Equifax et TransUnion. C'est normal.
                Certains prêteurs hypothécaires consultent les deux avant d'approuver un prêt.
              </p>
            </div>
          </section>

          {/* ── Section 2 ── */}
          <section id="comment-calculee" className="mb-14">
            <h2 className="text-3xl font-bold text-[#E6EDF3] mb-2">2 — Comment est-elle calculée?</h2>
            <p className="text-sm text-[#8B949E] mb-8">Les 5 facteurs et leur poids exact</p>
            <div className="prose">
              <p className="text-[#C9D1D9]">
                Ton score est calculé à partir de 5 facteurs, chacun avec un poids différent.
                Comprendre ces facteurs, c'est comprendre exactement sur quoi agir en priorité.
              </p>
            </div>

            <div className="space-y-4 mt-6">
              {[
                {
                  pct: "35%",
                  titre: "Historique de paiement",
                  color: "#3DDC97",
                  desc: "Le facteur le plus important. Est-ce que tu paies tes factures à temps? Un seul retard de paiement — même de quelques jours — peut faire chuter ta cote de façon significative. À l'inverse, des années de paiements ponctuels sont ce qui construit une excellente cote.",
                  conseil: "Mets toutes tes factures en paiement automatique. Un oubli peut coûter cher.",
                },
                {
                  pct: "30%",
                  titre: "Taux d'utilisation du crédit",
                  color: "#F0A500",
                  desc: "C'est le ratio entre le crédit que tu utilises et le crédit total disponible. Si ta carte a une limite de 5 000 $ et que tu portes un solde de 2 500 $, ton taux est de 50 % — ce qui est trop élevé. Vise un taux sous 30 %, idéalement sous 10 %.",
                  conseil: "Si possible, demande une augmentation de limite sans augmenter tes dépenses. Ton taux d'utilisation baisse automatiquement.",
                },
                {
                  pct: "15%",
                  titre: "Durée de l'historique de crédit",
                  color: "#60A5FA",
                  desc: "Plus ton historique est long, mieux c'est. L'âge moyen de tous tes comptes de crédit est pris en compte. C'est pourquoi fermer une vieille carte peut parfois nuire à ta cote.",
                  conseil: "Garde tes vieux comptes ouverts, même si tu les utilises peu. Un petit achat occasionnel suffit.",
                },
                {
                  pct: "10%",
                  titre: "Types de crédit",
                  color: "#C084FC",
                  desc: "Avoir une variété de types de crédit (cartes de crédit, prêt auto, hypothèque, ligne de crédit) démontre que tu peux gérer différentes formes d'endettement. Mais n'ouvre pas de crédit uniquement pour diversifier — l'impact est limité.",
                  conseil: "Ne t'endette pas pour diversifier. Ce facteur est secondaire.",
                },
                {
                  pct: "10%",
                  titre: "Nouvelles demandes de crédit",
                  color: "#FB923C",
                  desc: "Chaque fois qu'un prêteur fait une vérification dure (hard check) de ton dossier, une «enquête» apparaît. Trop d'enquêtes en peu de temps signalent un risque financier potentiel. Exception : plusieurs demandes de prêt hypothécaire ou auto dans un délai de 14 à 45 jours sont souvent comptées comme une seule enquête.",
                  conseil: "Évite de demander plusieurs nouvelles cartes de crédit sur une courte période.",
                },
              ].map(f => (
                <div key={f.titre} className="bg-[#161B22] border border-[#21262D] rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl font-bold flex-shrink-0 w-16 text-center" style={{ color: f.color, fontFamily: "var(--font-dm-mono, monospace)" }}>
                      {f.pct}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-[#E6EDF3] mb-2">{f.titre}</h3>
                      <p className="text-xs text-[#8B949E] leading-relaxed mb-3">{f.desc}</p>
                      <div className="bg-[#0D1117] rounded-lg px-4 py-2.5">
                        <p className="text-xs text-[#3DDC97]">💡 {f.conseil}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Section 3 ── */}
          <section id="niveaux" className="mb-14">
            <h2 className="text-3xl font-bold text-[#E6EDF3] mb-2">3 — Les niveaux de cote au Canada</h2>
            <p className="text-sm text-[#8B949E] mb-8">De 300 à 900 — ce que ça veut dire concrètement</p>
            <div className="prose mb-6">
              <p className="text-[#C9D1D9]">
                Voici comment les prêteurs canadiens interprètent généralement les niveaux de cote.
                Ces plages sont indicatives — chaque institution a ses propres critères.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-[#21262D]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#161B22]">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-[#8B949E] uppercase tracking-wide">Niveau</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-[#8B949E] uppercase tracking-wide">Plage</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-[#8B949E] uppercase tracking-wide">Ce que ça signifie</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#21262D]">
                  {[
                    { niveau: "Excellent", plage: "760 – 900", desc: "Accès aux meilleurs taux. Peu ou pas de refus.", color: "#3DDC97" },
                    { niveau: "Très bon", plage: "725 – 759", desc: "Très bien perçu. Bons taux sur la plupart des produits.", color: "#60A5FA" },
                    { niveau: "Bon", plage: "660 – 724", desc: "Généralement approuvé. Taux légèrement moins avantageux.", color: "#F0A500" },
                    { niveau: "Acceptable", plage: "560 – 659", desc: "Approbations possibles mais avec des conditions plus strictes ou des taux plus élevés.", color: "#FB923C" },
                    { niveau: "Faible", plage: "300 – 559", desc: "Difficultés d'approbation. Produits de crédit limités.", color: "#f87171" },
                  ].map(r => (
                    <tr key={r.niveau} className="bg-[#0D1117]">
                      <td className="px-5 py-3.5 font-semibold text-sm" style={{ color: r.color }}>{r.niveau}</td>
                      <td className="px-5 py-3.5 text-[#E6EDF3] font-mono text-xs">{r.plage}</td>
                      <td className="px-5 py-3.5 text-[#8B949E] text-xs leading-relaxed">{r.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-[#3DDC97]/10 border border-[#3DDC97]/25 rounded-2xl p-5 mt-6">
              <p className="text-xs text-[#8B949E] leading-relaxed">
                <span className="text-[#3DDC97] font-medium">Cote moyenne au Canada : </span>
                Environ 650 à 680 selon Equifax. La majorité des Canadiens se situent dans la zone «Bon» à «Très bon».
                Un score de 720+ est généralement considéré comme solide pour obtenir de bons taux hypothécaires.
              </p>
            </div>
          </section>

          {/* ── Section 4 ── */}
          <section id="verifier" className="mb-14">
            <h2 className="text-3xl font-bold text-[#E6EDF3] mb-2">4 — Comment vérifier sa cote gratuitement</h2>
            <p className="text-sm text-[#8B949E] mb-8">Soft check vs hard check — la distinction qui change tout</p>
            <div className="prose mb-6">
              <p className="text-[#C9D1D9]">
                Bonne nouvelle : vérifier ta propre cote de crédit est une vérification douce (<em>soft check</em>) et
                n'a <strong className="text-[#E6EDF3]">aucun impact</strong> sur ton score.
                Tu peux le faire aussi souvent que tu veux.
              </p>
            </div>

            <div className="bg-[#161B22] border border-[#21262D] rounded-2xl p-6 mb-6">
              <h3 className="text-sm font-bold text-[#E6EDF3] mb-4">Soft check vs Hard check</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-[#3DDC97] mb-2">Vérification douce (soft check) ✓</p>
                  <ul className="text-xs text-[#8B949E] space-y-1">
                    <li>• Vérification personnelle</li>
                    <li>• Pré-approbation hypothécaire</li>
                    <li>• Vérification d'employeur</li>
                    <li>• Offres de crédit pré-approuvées</li>
                  </ul>
                  <p className="text-[10px] text-[#3DDC97] mt-2">N'affecte PAS ta cote.</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-red-400 mb-2">Vérification dure (hard check) ✗</p>
                  <ul className="text-xs text-[#8B949E] space-y-1">
                    <li>• Demande de carte de crédit</li>
                    <li>• Demande de prêt personnel</li>
                    <li>• Demande de prêt hypothécaire</li>
                    <li>• Demande de financement auto</li>
                  </ul>
                  <p className="text-[10px] text-red-400 mt-2">Peut faire baisser la cote temporairement. Reste au dossier 3 ans.</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {[
                {
                  service: "Borrowell",
                  bureau: "Equifax",
                  prix: "Gratuit",
                  desc: "Le service gratuit le plus populaire au Canada. Score mis à jour hebdomadairement. Recommandations personnalisées.",
                  url: "https://borrowell.com",
                },
                {
                  service: "Credit Karma",
                  bureau: "TransUnion",
                  prix: "Gratuit",
                  desc: "Donne accès au score TransUnion. Mis à jour régulièrement. Interface simple.",
                  url: "https://www.creditkarma.ca",
                },
                {
                  service: "Equifax Canada (direct)",
                  bureau: "Equifax",
                  prix: "Gratuit (rapport annuel) / Payant (surveillance continue)",
                  desc: "Accès direct à ton dossier complet Equifax. Le rapport annuel est gratuit par la loi.",
                  url: "https://www.equifax.ca",
                },
                {
                  service: "TransUnion Canada (direct)",
                  bureau: "TransUnion",
                  prix: "Gratuit (rapport annuel) / Payant (surveillance continue)",
                  desc: "Accès direct à ton dossier TransUnion. Possibilité de contester des erreurs directement.",
                  url: "https://www.transunion.ca",
                },
              ].map(s => (
                <div key={s.service} className="bg-[#161B22] border border-[#21262D] rounded-xl px-5 py-4">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                    <span className="text-sm font-semibold text-[#E6EDF3]">{s.service}</span>
                    <div className="flex gap-2">
                      <span className="text-[10px] bg-[#60A5FA]/10 text-[#60A5FA] border border-[#60A5FA]/20 rounded-full px-2 py-0.5">{s.bureau}</span>
                      <span className="text-[10px] bg-[#3DDC97]/10 text-[#3DDC97] border border-[#3DDC97]/20 rounded-full px-2 py-0.5">{s.prix}</span>
                    </div>
                  </div>
                  <p className="text-xs text-[#8B949E] leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#F0A500]/10 border border-[#F0A500]/30 rounded-2xl p-5 mt-6">
              <p className="text-xs text-[#8B949E] leading-relaxed">
                <span className="text-[#F0A500] font-medium">Conseil : </span>
                Vérifie ton dossier complet (pas juste la cote) auprès d'Equifax et TransUnion au moins une fois par an.
                Le dossier complet révèle les erreurs potentielles — comptes que tu ne reconnais pas, informations incorrectes —
                que tu peux contester directement auprès des bureaux.
              </p>
            </div>

            {/* CTA interne */}
            <div className="mt-6 bg-[#161B22] border border-[#21262D] rounded-2xl p-6 text-center">
              <p className="text-sm text-[#E6EDF3] font-medium mb-2">Tu veux estimer ton profil de crédit?</p>
              <p className="text-xs text-[#8B949E] mb-4">Notre outil interactif t'aide à évaluer où tu en es et quoi améliorer.</p>
              <Link href="/estimateur-credit"
                className="inline-block bg-[#3DDC97] text-[#0D1117] font-semibold rounded-xl px-6 py-2.5 text-sm hover:opacity-90 transition-opacity no-underline">
                Utiliser l'estimateur de crédit →
              </Link>
            </div>
          </section>

          {/* ── Section 5 ── */}
          <section id="ameliorer" className="mb-14">
            <h2 className="text-3xl font-bold text-[#E6EDF3] mb-2">5 — 7 habitudes pour améliorer sa cote</h2>
            <p className="text-sm text-[#8B949E] mb-8">Les actions concrètes, classées par impact</p>
            <div className="prose mb-6">
              <p className="text-[#C9D1D9]">
                Il n'existe pas de raccourci. Mais il existe des habitudes précises qui, maintenues dans le temps,
                produisent des résultats mesurables. Voici les plus importantes, dans l'ordre de leur impact.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  num: "01",
                  titre: "Payer à temps, toujours",
                  impact: "Très élevé",
                  impactColor: "#3DDC97",
                  desc: "C'est le facteur le plus important (35% du score). Un seul paiement manqué peut faire chuter ta cote de 50 à 100 points. Mets en place des paiements automatiques au minimum pour le montant minimum dû — idéalement pour le solde total.",
                },
                {
                  num: "02",
                  titre: "Maintenir un faible taux d'utilisation",
                  impact: "Très élevé",
                  impactColor: "#3DDC97",
                  desc: "Vise un taux d'utilisation sous 30% sur chaque carte individuellement et en totalité. Par exemple, avec une limite de 5 000 $, essaie de ne jamais dépasser 1 500 $ de solde au moment où le relevé est émis. En dessous de 10%, c'est idéal.",
                },
                {
                  num: "03",
                  titre: "Ne pas fermer ses vieux comptes",
                  impact: "Modéré",
                  impactColor: "#F0A500",
                  desc: "La durée de ton historique (15% du score) est affectée par l'âge moyen de tous tes comptes. Fermer une vieille carte raccourcit cet historique. Garde-la active avec un petit achat mensuel automatique (ex: un abonnement de streaming).",
                },
                {
                  num: "04",
                  titre: "Demander des augmentations de limite",
                  impact: "Modéré",
                  impactColor: "#F0A500",
                  desc: "Demander une augmentation de ta limite de crédit (sans augmenter tes dépenses) réduit mécaniquement ton taux d'utilisation. La demande elle-même peut être une vérification douce ou dure selon l'émetteur — renseigne-toi avant.",
                },
                {
                  num: "05",
                  titre: "Espacer les demandes de nouveau crédit",
                  impact: "Modéré",
                  impactColor: "#F0A500",
                  desc: "Chaque hard check laisse une trace pendant 3 ans et peut temporairement réduire ta cote. Évite de demander plusieurs nouveaux produits de crédit en peu de temps. Exception : plusieurs demandes hypothécaires dans une courte fenêtre (14-45 jours) sont souvent comptées comme une seule.",
                },
                {
                  num: "06",
                  titre: "Contester les erreurs à ton dossier",
                  impact: "Variable",
                  impactColor: "#60A5FA",
                  desc: "Des études suggèrent qu'une proportion significative des dossiers de crédit contiennent des erreurs. Vérifie ton rapport complet (gratuit une fois par an) et conteste toute information inexacte directement auprès du bureau concerné. Une correction peut parfois améliorer la cote immédiatement.",
                },
                {
                  num: "07",
                  titre: "Devenir utilisateur autorisé",
                  impact: "Variable",
                  impactColor: "#60A5FA",
                  desc: "Si un proche (parent, conjoint) a une excellente cote et une ancienne carte en bonne standing, te faire ajouter comme utilisateur autorisé peut faire apparaître cet historique dans ton dossier. L'impact varie selon les bureaux et les émetteurs.",
                },
              ].map(h => (
                <div key={h.num} className="bg-[#161B22] border border-[#21262D] rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl font-black text-[#3DDC97]/15 flex-shrink-0 w-10" style={{ fontFamily: "var(--font-dm-mono, monospace)" }}>
                      {h.num}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="text-sm font-bold text-[#E6EDF3]">{h.titre}</h3>
                        <span className="text-[10px] font-medium rounded-full px-2 py-0.5 border"
                          style={{ color: h.impactColor, background: `${h.impactColor}12`, borderColor: `${h.impactColor}25` }}>
                          Impact {h.impact}
                        </span>
                      </div>
                      <p className="text-xs text-[#8B949E] leading-relaxed">{h.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Section 6 ── */}
          <section id="erreurs" className="mb-14">
            <h2 className="text-3xl font-bold text-[#E6EDF3] mb-2">6 — Les erreurs qui font baisser la cote</h2>
            <p className="text-sm text-[#8B949E] mb-8">Ce qu'il faut absolument éviter</p>

            <div className="space-y-3">
              {[
                {
                  erreur: "Manquer un paiement",
                  impact: "–50 à –100 points",
                  note: "Même un seul retard signalé aux bureaux peut causer des dommages importants. L'impact s'atténue avec le temps mais l'incident reste 6-7 ans au dossier.",
                },
                {
                  erreur: "Maxer ses cartes de crédit",
                  impact: "–20 à –50 points",
                  note: "Un taux d'utilisation à 90-100% est un signal de risque majeur pour les prêteurs. L'impact est immédiat mais aussi rapidement réversible si tu rembourses.",
                },
                {
                  erreur: "Demander plusieurs cartes en peu de temps",
                  impact: "–5 à –15 points par enquête",
                  note: "Chaque hard check s'accumule. Cinq demandes en un mois peut sembler désespéré aux yeux d'un prêteur.",
                },
                {
                  erreur: "Fermer un vieux compte de crédit",
                  impact: "Variable",
                  note: "Réduit ton crédit disponible total (taux d'utilisation monte) et peut raccourcir ton historique moyen.",
                },
                {
                  erreur: "Ignorer une dette en collection",
                  impact: "–50 à –150 points",
                  note: "Un compte envoyé en collection reste au dossier 6-7 ans et est très négatif. Même réglée, la mention reste visible.",
                },
                {
                  erreur: "Faillite ou proposition de consommateur",
                  impact: "Très sévère",
                  note: "Une faillite reste au dossier 6 ans après libération (première faillite) chez la plupart des bureaux. Une proposition de consommateur, 3 ans après paiement final.",
                },
              ].map(e => (
                <div key={e.erreur} className="bg-[#0D1117] border border-[#21262D] rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-start gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#E6EDF3] mb-1">{e.erreur}</p>
                    <p className="text-xs text-[#8B949E] leading-relaxed">{e.note}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="text-xs font-mono font-bold text-red-400 bg-red-400/10 border border-red-400/20 rounded-full px-3 py-1 whitespace-nowrap">
                      {e.impact}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Section 7 ── */}
          <section id="delais" className="mb-14">
            <h2 className="text-2xl font-bold text-[#E6EDF3] mb-6">
              <span className="text-[#3DDC97] font-mono text-xl mr-3">7</span>
              Combien de temps pour s'améliorer?
            </h2>
            <div className="prose mb-6">
              <p className="text-[#C9D1D9]">
                Il n'existe pas de réponse unique — le délai dépend de ce qui a affecté ta cote et de ta situation de départ.
                Voici des estimations générales pour différents scénarios.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { scenario: "Taux d'utilisation élevé", delai: "1 à 2 mois", desc: "Rembourser un solde élevé a un effet quasi immédiat dès que le prêteur rapporte le nouveau solde au bureau (généralement après ton relevé mensuel)." },
                { scenario: "Pas ou peu d'historique de crédit", delai: "6 à 12 mois", desc: "En ouvrant un premier produit de crédit et en l'utilisant responsablement, une cote de base se constitue en quelques mois." },
                { scenario: "Cote faible avec retards passés", delai: "12 à 24 mois", desc: "Avec des habitudes constantes (paiements à temps, faible utilisation), une amélioration significative est possible en 1-2 ans même avec un passé difficile." },
                { scenario: "Après une faillite ou proposition de consommateur", delai: "2 à 6 ans", desc: "La reconstruction est longue mais possible. Carte sécurisée, prêt bâtisseur de crédit, et discipline sont les outils principaux. Après 2-3 ans de bonnes habitudes, une hypothèque peut redevenir accessible." },
              ].map(s => (
                <div key={s.scenario} className="bg-[#161B22] border border-[#21262D] rounded-xl px-5 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <p className="text-sm font-semibold text-[#E6EDF3]">{s.scenario}</p>
                    <span className="text-xs font-medium text-[#3DDC97] bg-[#3DDC97]/10 border border-[#3DDC97]/20 rounded-full px-3 py-0.5">
                      {s.delai}
                    </span>
                  </div>
                  <p className="text-xs text-[#8B949E] leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Section 8 ── */}
          <section id="zero" className="mb-14">
            <h2 className="text-2xl font-bold text-[#E6EDF3] mb-6">
              <span className="text-[#3DDC97] font-mono text-xl mr-3">8</span>
              Bâtir un crédit de zéro
            </h2>
            <div className="prose mb-6">
              <p className="text-[#C9D1D9]">
                Tu arrives au Canada, tu as 18 ans, ou tu n'as simplement jamais utilisé de crédit?
                Sans historique, tu es «invisible» pour les prêteurs — ce qui est presque aussi difficile
                qu'un mauvais historique. Voici comment construire une base solide.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  etape: "1",
                  titre: "Carte de crédit sécurisée",
                  desc: "Tu déposes un montant (ex: 500 $) qui devient ta limite de crédit. Le prêteur prend peu de risque, et toi tu bâtis un historique réel. Après 6-12 mois de bons paiements, tu peux souvent convertir vers une carte normale.",
                  exemples: "Koho, Capital One Guaranteed, Refresh Financial",
                },
                {
                  etape: "2",
                  titre: "Prêt pour bâtir le crédit (credit builder loan)",
                  desc: "Tu fais des paiements mensuels sur un prêt dont les fonds sont mis en réserve. À la fin, tu récupères l'argent ET tu as un historique de crédit. Proposé par certaines coopératives de crédit et fintechs.",
                  exemples: "Certaines caisses Desjardins, coopératives de crédit locales",
                },
                {
                  etape: "3",
                  titre: "Utilisateur autorisé sur la carte d'un proche",
                  desc: "Si un parent ou conjoint avec une excellente cote t'ajoute comme utilisateur autorisé sur sa carte, leur historique positif peut apparaître dans ton dossier. Tu n'as pas nécessairement besoin d'utiliser la carte.",
                  exemples: "Option la plus rapide si tu as un proche coopératif",
                },
                {
                  etape: "4",
                  titre: "Rapporter les paiements de loyer",
                  desc: "Certains services permettent maintenant de rapporter tes paiements de loyer aux bureaux de crédit — un historique qui n'était pas traditionnellement comptabilisé.",
                  exemples: "Landlord Credit Bureau, Chexy",
                },
              ].map(e => (
                <div key={e.etape} className="bg-[#161B22] border border-[#21262D] rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#3DDC97]/15 border border-[#3DDC97]/25 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-[#3DDC97]">{e.etape}</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#E6EDF3] mb-2">{e.titre}</h3>
                      <p className="text-xs text-[#8B949E] leading-relaxed mb-2">{e.desc}</p>
                      <p className="text-[10px] text-[#484F58]">Exemples : {e.exemples}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── CTA estimateur ── */}
          <div className="bg-[#3DDC97]/10 border border-[#3DDC97]/25 rounded-2xl p-8 mb-14 text-center">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-[#E6EDF3] mb-3">Évalue ton profil de crédit</h3>
            <p className="text-sm text-[#8B949E] leading-relaxed mb-6 max-w-md mx-auto">
              Notre estimateur interactif analyse ton profil et t'indique les leviers les plus impactants
              pour améliorer ta situation. Gratuit, anonyme, 2 minutes.
            </p>
            <Link href="/estimateur-credit"
              className="inline-block bg-[#3DDC97] text-[#0D1117] font-bold rounded-xl px-8 py-3 text-sm hover:opacity-90 transition-opacity no-underline">
              Estimer mon profil de crédit →
            </Link>
          </div>

          {/* ── FAQ ── */}
          <section id="faq" className="mb-14">
            <h2 className="text-2xl font-bold text-[#E6EDF3] mb-2">Questions fréquentes</h2>
            <p className="text-sm text-[#8B949E] mb-8 font-light">Les vraies questions que tout le monde se pose</p>
            <div className="space-y-2">
              {FAQ_ITEMS.map((item, i) => (
                <div key={i} className="bg-[#0E1520] border border-[#21262D] rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full text-left px-5 py-4 flex justify-between items-center gap-4"
                  >
                    <span className="text-sm font-medium text-[#E6EDF3]">{item.q}</span>
                    <span className="text-[#3DDC97] text-lg flex-shrink-0">{openFaq === i ? "−" : "+"}</span>
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-4">
                      <p className="text-sm text-[#8B949E] leading-relaxed font-light">{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Footer du guide */}
          <div className="border-t border-[#21262D] pt-8 text-center">
            <p className="text-xs text-[#484F58] mb-4">
              Ce guide est à titre informatif uniquement. Il ne constitue pas un conseil financier ou juridique.
              Pour toute situation complexe, consultez un syndic autorisé en insolvabilité ou un conseiller en crédit agréé (AFCC).
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-xs text-[#484F58]">
              <Link href="/estimateur-credit" className="hover:text-[#8B949E] transition-colors no-underline">Estimateur de crédit</Link>
              <span>·</span>
              <Link href="/guide-investissement-debutant-canada" className="hover:text-[#8B949E] transition-colors no-underline">Guide investissement débutant</Link>
              <span>·</span>
              <Link href="/" className="hover:text-[#8B949E] transition-colors no-underline">Tous les outils</Link>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
