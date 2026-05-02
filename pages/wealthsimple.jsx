import { useState } from "react";
import Link from "next/link";
import Layout from "../components/Layout";

function CELICalculator() {
  const [age, setAge] = useState(30);
  const [currentBalance, setCurrentBalance] = useState(10000);
  const [monthlyContrib, setMonthlyContrib] = useState(300);
  const [returnRate, setReturnRate] = useState(7);

  const yearsToRetirement = Math.max(0, 65 - age);
  const monthlyRate = returnRate / 100 / 12;
  const months = yearsToRetirement * 12;

  let balance = currentBalance;
  for (let i = 0; i < months; i++) {
    balance = balance * (1 + monthlyRate) + monthlyContrib;
  }
  const totalContribs = currentBalance + monthlyContrib * months;
  const growth = balance - totalContribs;

  const fmt = (n) => Math.round(n).toLocaleString("fr-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 });

  const inputClass = "bg-[#0D1117] border border-[#21262D] text-[#E6EDF3] rounded-lg px-3.5 py-2.5 w-full text-sm focus:outline-none focus:border-[#3DDC97]/50";

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between">
            <label className="text-xs text-[#8B949E] uppercase tracking-wider">Votre âge</label>
            <span className="text-xs font-bold text-[#F0A500]">{age} ans</span>
          </div>
          <input type="range" min={18} max={64} value={age} onChange={e => setAge(+e.target.value)} className="w-full accent-[#F0A500]" />
          <div className="flex justify-between text-xs text-[#484F58]"><span>18</span><span>64</span></div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between">
            <label className="text-xs text-[#8B949E] uppercase tracking-wider">Taux de rendement estimé</label>
            <span className="text-xs font-bold text-[#F0A500]">{returnRate}%</span>
          </div>
          <input type="range" min={1} max={12} value={returnRate} onChange={e => setReturnRate(+e.target.value)} className="w-full accent-[#F0A500]" />
          <div className="flex justify-between text-xs text-[#484F58]"><span>1%</span><span>12%</span></div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-[#8B949E] uppercase tracking-wider">Solde actuel ($)</label>
          <input type="number" className={inputClass} value={currentBalance} onChange={e => setCurrentBalance(+e.target.value)} min={0} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-[#8B949E] uppercase tracking-wider">Contribution mensuelle ($)</label>
          <input type="number" className={inputClass} value={monthlyContrib} onChange={e => setMonthlyContrib(+e.target.value)} min={0} />
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-3 gap-3 mt-2">
        <div className="bg-[#0D1117] rounded-xl p-4 border border-[#21262D] text-center">
          <div className="text-xs text-[#8B949E] mb-2 uppercase tracking-wider">À la retraite</div>
          <div className="text-xl font-black text-[#F0A500]">{fmt(balance)}</div>
        </div>
        <div className="bg-[#0D1117] rounded-xl p-4 border border-[#21262D] text-center">
          <div className="text-xs text-[#8B949E] mb-2 uppercase tracking-wider">Vos contributions</div>
          <div className="text-xl font-black text-[#E6EDF3]">{fmt(totalContribs)}</div>
        </div>
        <div className="bg-[#0D1117] rounded-xl p-4 border border-[#21262D] text-center">
          <div className="text-xs text-[#8B949E] mb-2 uppercase tracking-wider">Croissance</div>
          <div className="text-xl font-black text-[#3DDC97]">{fmt(growth)}</div>
        </div>
      </div>

      {yearsToRetirement > 0 && (
        <div className="bg-[#F0A500]/06 rounded-xl p-4 border border-[#F0A500]/20">
          <p className="text-sm text-[#8B949E] leading-relaxed">
            En contribuant <strong className="text-[#E6EDF3]">{fmt(monthlyContrib)}/mois</strong> pendant{" "}
            <strong className="text-[#E6EDF3]">{yearsToRetirement} ans</strong>, votre CELI pourrait atteindre{" "}
            <strong className="text-[#F0A500]">{fmt(balance)}</strong> à la retraite — dont{" "}
            <strong className="text-[#3DDC97]">{fmt(growth)}</strong> en intérêts composés, complètement libres d'impôt.
          </p>
        </div>
      )}
    </div>
  );
}

export default function WealthsimplePage() {
  return (
    <Layout title="Wealthsimple — Investissez sans frais de commission">
      <div className="max-w-3xl mx-auto px-6 pb-20">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#8B949E] hover:text-[#E6EDF3] no-underline pt-6 pb-8 transition-colors">
          ← Retour aux outils
        </Link>

        {/* Hero */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl overflow-hidden bg-white flex items-center justify-center border border-[#21262D]">
              <img src="https://logo.clearbit.com/wealthsimple.com" alt="Wealthsimple"
                className="w-8 h-8 object-contain"
                onError={e => { e.target.style.display="none"; e.target.parentNode.innerHTML="📈"; }} />
            </div>
            <div>
              <div className="text-xs text-[#8B949E] uppercase tracking-widest">Investissement</div>
              <h1 className="text-2xl font-extrabold text-[#E6EDF3] tracking-tight">Wealthsimple</h1>
            </div>
          </div>
          <p className="text-base text-[#8B949E] leading-relaxed">
            La plateforme d'investissement canadienne #1. Ouvrez un CELI, REER ou un compte de courtage
            et achetez des actions et FNB sans frais de commission.
          </p>
        </div>

        {/* Tool */}
        <div className="bg-[#161B22] rounded-2xl p-7 border border-[#21262D] mb-7">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-[#E6EDF3] mb-1">🛠 Calculateur CELI</h2>
            <p className="text-sm text-[#8B949E]">
              Estimez la croissance de votre CELI jusqu'à la retraite selon vos contributions mensuelles.
            </p>
          </div>
          <CELICalculator />
        </div>

        {/* Features */}
        <div className="bg-[#161B22] rounded-2xl p-7 border border-[#21262D] mb-7">
          <h2 className="text-lg font-bold text-[#E6EDF3] mb-4">Pourquoi Wealthsimple?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: "💸", title: "0$ de commission", desc: "Achetez et vendez des actions canadiennes et américaines sans frais." },
              { icon: "🇨🇦", title: "100% canadien", desc: "Fondé à Toronto. Réglementé par l'OCRI. Protégé par le FCPE." },
              { icon: "📱", title: "Simple à utiliser", desc: "Application mobile intuitive. Idéal pour les débutants et investisseurs actifs." },
            ].map(item => (
              <div key={item.title} className="bg-[#0D1117] rounded-xl p-4 border border-[#21262D]">
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="text-sm font-bold text-[#E6EDF3] mb-1">{item.title}</div>
                <div className="text-xs text-[#8B949E] leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#F0A500]/06 border border-[#F0A500]/25 rounded-2xl p-8 text-center">
          <div className="text-3xl mb-3">🚀</div>
          <h3 className="text-xl font-bold text-[#E6EDF3] mb-2">Commencez à investir aujourd'hui</h3>
          <p className="text-sm text-[#8B949E] mb-6 leading-relaxed max-w-sm mx-auto">
            Ouvrez un compte CELI ou REER en 5 minutes. Aucuns frais mensuels, aucune commission.
            Recevez un bonus à l'ouverture via ce lien.
          </p>
          <a
            href="https://www.wealthsimple.com/invite/EDVQ3W"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-block bg-[#F0A500] text-[#0D1117] font-bold rounded-xl px-8 py-3.5 text-sm tracking-wide hover:bg-[#D4940A] transition-colors no-underline"
          >
            Ouvrir un compte Wealthsimple →
          </a>
          <p className="text-xs text-[#484F58] mt-4">
            ✓ Gratuit à l'ouverture · ✓ Aucune commission · ✓ Protégé FCPE · Lien affilié
          </p>
        </div>
      </div>
    </Layout>
  );
}
