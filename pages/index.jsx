import Link from "next/link";
import Layout from "../components/Layout";

const partners = [
  { id: "borrowell", name: "Borrowell", tagline: "Vérifiez votre cote de crédit gratuitement", category: "Crédit", badge: "Gratuit", tool: "Estimateur de crédit", domain: "borrowell.com", emoji: "📊" },
  { id: "wealthsimple", name: "Wealthsimple", tagline: "Investissez sans frais de commission", category: "Investissement", badge: "Populaire", tool: "Calculateur CELI", domain: "wealthsimple.com", emoji: "📈" },
  { id: "eq-bank", name: "EQ Bank", tagline: "Le meilleur taux d'épargne au Canada", category: "Épargne", badge: "Meilleur taux", tool: "Calculateur fonds d'urgence", domain: "eqbank.ca", emoji: "🏦" },
  { id: "questrade", name: "Questrade", tagline: "Achetez des FNB gratuitement", category: "Courtage", badge: "FNB gratuits", tool: "Projecteur de dividendes", domain: "questrade.com", emoji: "💹" },
  { id: "ratehub", name: "Ratehub", tagline: "Comparez les meilleurs taux hypothécaires", category: "Hypothèque", badge: "Meilleur taux", tool: "Calculateur hypothécaire", domain: "ratehub.ca", emoji: "🏠" },
  { id: "tangerine", name: "Tangerine", tagline: "Compte chèques sans frais + bonus", category: "Banque", badge: "Bonus 200$", tool: "Calculateur d'économies", domain: "tangerine.ca", emoji: "🍊" },
];

function PartnerLogo({ domain, name, emoji }) {
  return (
    <div className="w-11 h-11 rounded-xl overflow-hidden bg-white flex items-center justify-center border border-[#21262D] flex-shrink-0">
      <img
        src={`https://logo.clearbit.com/${domain}`}
        alt={name}
        className="w-8 h-8 object-contain"
        onError={e => {
          e.target.style.display = "none";
          e.target.parentNode.innerHTML = `<span style="font-size:18px">${emoji}</span>`;
        }}
      />
    </div>
  );
}

export default function Home() {
  return (
    <Layout title="Outils financiers canadiens">
      <div className="max-w-5xl mx-auto px-6 pb-20">
        <div className="py-16 text-center">
          <div className="inline-block bg-[#3DDC97]/10 border border-[#3DDC97]/20 rounded-full px-4 py-1 text-xs text-[#3DDC97] uppercase tracking-widest mb-5">
            Outils financiers canadiens
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#E6EDF3] mb-4 leading-tight">
            Prenez le contrôle de<br />
            <span className="text-[#3DDC97]">votre portefeuille</span>
          </h1>
          <p className="text-lg text-[#8B949E] max-w-xl mx-auto leading-relaxed font-light">
            Des outils interactifs pour comprendre votre crédit, maximiser votre épargne
            et investir intelligemment — le tout 100% canadien.
          </p>
        </div>

        <div className="grid grid-cols-3 border border-[#21262D] rounded-xl overflow-hidden mb-14">
          {[["6", "Outils gratuits"], ["100%", "Canadien"], ["0$", "Aucun abonnement"]].map(([val, label]) => (
            <div key={label} className="bg-[#161B22] py-5 text-center">
              <div className="text-2xl font-bold text-[#3DDC97]">{val}</div>
              <div className="text-xs text-[#8B949E] mt-1 font-light">{label}</div>
            </div>
          ))}
        </div>

        <p className="text-xs text-[#484F58] uppercase tracking-widest mb-5">Choisissez un outil</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {partners.map(p => (
            <Link
              key={p.id}
              href={`/${p.id}`}
              className="bg-[#0E1520] border border-[#21262D] rounded-2xl p-5 flex flex-col gap-4 no-underline hover:bg-[#121B28] hover:border-[#3DDC97]/20 transition-all"
            >
              <div className="flex justify-between items-start">
                <PartnerLogo domain={p.domain} name={p.name} emoji={p.emoji} />
                <span className="text-xs font-medium rounded-full px-3 py-1 text-[#8B949E] bg-white/5 border border-white/[0.06]">
                  {p.badge}
                </span>
              </div>
              <div>
                <div className="text-xs text-[#484F58] uppercase tracking-wider mb-1">{p.category}</div>
                <div className="text-base font-semibold text-[#E6EDF3] mb-1.5">{p.name}</div>
                <div className="text-sm text-[#8B949E] leading-relaxed font-light">{p.tagline}</div>
              </div>
              <div>
                <span className="text-xs text-[#3DDC97]/50 rounded-lg px-2.5 py-1.5 bg-[#3DDC97]/5 border border-[#3DDC97]/10">
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