import Link from "next/link";
import Layout from "../components/Layout";

const partners = [
  { id: "borrowell", name: "Borrowell", tagline: "Vérifiez votre cote de crédit gratuitement", category: "Crédit", badge: "Gratuit", tool: "Estimateur de crédit" },
  { id: "wealthsimple", name: "Wealthsimple", tagline: "Banque, épargne et investissement sans frais", category: "Banque & Investissement", badge: "Populaire", tool: "Calculateur CELI" },
];

export default function Home() {
  return (
    <Layout title="Outils financiers canadiens">
      <div className="max-w-5xl mx-auto px-6 pb-20">

        {/* Hero */}
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

        {/* Stats */}
        <div className="grid grid-cols-3 border border-[#21262D] rounded-xl overflow-hidden mb-14">
          {[["2", "Outils gratuits"], ["100%", "Canadien"], ["0$", "Aucun abonnement"]].map(([val, label]) => (
            <div key={label} className="bg-[#161B22] py-5 text-center">
              <div className="text-2xl font-bold text-[#3DDC97]">{val}</div>
              <div className="text-xs text-[#8B949E] mt-1 font-light">{label}</div>
            </div>
          ))}
        </div>

        {/* Grid */}
        <p className="text-xs text-[#484F58] uppercase tracking-widest mb-5">Choisissez un outil</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {partners.map(p => (
            <Link
              key={p.id}
              href={`/${p.id}`}
              className="bg-[#0E1520] border border-[#21262D] rounded-2xl p-6 flex flex-col gap-4 no-underline hover:bg-[#121B28] hover:border-[#3DDC97]/20 transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="w-11 h-11 rounded-xl bg-[#3DDC97]/10 border border-[#3DDC97]/20 flex items-center justify-center">
                  <span className="text-[#3DDC97] font-bold text-lg">{p.name[0]}</span>
                </div>
                <span className="text-xs font-medium rounded-full px-3 py-1 text-[#8B949E] bg-white/5 border border-white/[0.06]">
                  {p.badge}
                </span>
              </div>
              <div>
                <div className="text-xs text-[#484F58] uppercase tracking-wider mb-1">{p.category}</div>
                <div className="text-lg font-semibold text-[#E6EDF3] mb-1.5">{p.name}</div>
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