import Link from "next/link";
import Layout from "../components/Layout";

const partners = [
  {
    id: "borrowell",
    name: "Borrowell",
    tagline: "Vérifiez votre cote de crédit gratuitement",
    description: "Cote de crédit Equifax gratuite, sans impact. Recommandations personnalisées.",
    category: "Crédit",
    badge: "Gratuit",
    color: "#3DDC97",
    tool: "Estimateur de crédit",
    emoji: "📊",
  },
  {
    id: "wealthsimple",
    name: "Wealthsimple",
    tagline: "Investissez sans frais de commission",
    description: "REER, CELI, et actions — tout en un. Plateforme canadienne #1.",
    category: "Investissement",
    badge: "Populaire",
    color: "#F0A500",
    tool: "Calculateur CELI",
    emoji: "📈",
  },
  {
    id: "eq-bank",
    name: "EQ Bank",
    tagline: "Le meilleur taux d'épargne au Canada",
    description: "CELI épargne à taux élevé. Aucuns frais mensuels. 100% en ligne.",
    category: "Épargne",
    badge: "Meilleur taux",
    color: "#60A5FA",
    tool: "Calculateur fonds d'urgence",
    emoji: "🏦",
  },
  {
    id: "questrade",
    name: "Questrade",
    tagline: "Achetez des FNB gratuitement",
    description: "FNB gratuits à l'achat, commissions réduites. Idéal pour les dividendes.",
    category: "Courtage",
    badge: "FNB gratuits",
    color: "#C084FC",
    tool: "Projecteur de dividendes",
    emoji: "💹",
  },
  {
    id: "ratehub",
    name: "Ratehub",
    tagline: "Comparez les meilleurs taux hypothécaires",
    description: "Hypothèques, cartes de crédit, assurances. Comparaison instantanée.",
    category: "Hypothèque",
    badge: "Meilleur taux",
    color: "#FB923C",
    tool: "Calculateur hypothécaire",
    emoji: "🏠",
  },
  {
    id: "tangerine",
    name: "Tangerine",
    tagline: "Compte chèques sans frais + bonus",
    description: "200$ de bienvenue, aucuns frais mensuels, taux compétitif.",
    category: "Banque",
    badge: "Bonus 200$",
    color: "#F87171",
    tool: "Calculateur d'économies",
    emoji: "🍊",
  },
];

export default function Home() {
  return (
    <Layout title="Outils financiers canadiens">
      <div className="max-w-5xl mx-auto px-6 pb-20">
        {/* Hero */}
        <div className="py-16 text-center">
          <div className="inline-block bg-[#3DDC97]/10 border border-[#3DDC97]/25 rounded-full px-4 py-1 text-xs text-[#3DDC97] uppercase tracking-widest mb-5">
            Outils financiers canadiens
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#E6EDF3] mb-4 leading-tight">
            Prenez le contrôle de<br />
            <span className="text-[#3DDC97]">votre portefeuille</span>
          </h1>
          <p className="text-lg text-[#8B949E] max-w-xl mx-auto leading-relaxed">
            Des outils interactifs pour comprendre votre crédit, maximiser votre épargne
            et investir intelligemment — le tout 100% canadien.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 border border-[#21262D] rounded-xl overflow-hidden mb-14">
          {[["6", "Outils gratuits"], ["100%", "Canadien"], ["0$", "Aucun abonnement"]].map(([val, label]) => (
            <div key={label} className="bg-[#161B22] py-5 text-center">
              <div className="text-2xl font-extrabold text-[#3DDC97]">{val}</div>
              <div className="text-xs text-[#8B949E] mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Grid */}
        <p className="text-xs text-[#8B949E] uppercase tracking-widest font-semibold mb-5">Choisissez un outil</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {partners.map(p => (
            <Link
              key={p.id}
              href={`/${p.id}`}
              className="bg-[#161B22] border border-[#21262D] rounded-2xl p-5 flex flex-col gap-4 no-underline hover:bg-[#1F2937] transition-all group"
              style={{ borderColor: undefined }}
            >
              <div className="flex justify-between items-start">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-lg font-black"
                  style={{ background: `${p.color}15`, border: `1px solid ${p.color}35`, color: p.color }}
                >
                  {p.emoji}
                </div>
                <span
                  className="text-xs font-semibold rounded-full px-3 py-1"
                  style={{ color: p.color, background: `${p.color}15`, border: `1px solid ${p.color}30` }}
                >
                  {p.badge}
                </span>
              </div>
              <div>
                <div className="text-xs text-[#484F58] uppercase tracking-wider mb-1">{p.category}</div>
                <div className="text-base font-bold text-[#E6EDF3] mb-1.5">{p.name}</div>
                <div className="text-sm text-[#8B949E] leading-relaxed">{p.tagline}</div>
              </div>
              <div>
                <span
                  className="text-xs font-semibold rounded-lg px-2.5 py-1.5"
                  style={{ color: p.color, background: `${p.color}12`, border: `1px solid ${p.color}20` }}
                >
                  🛠 {p.tool}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
