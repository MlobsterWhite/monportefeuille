import Link from "next/link";
import Layout from "../components/Layout";
import { useState, useMemo, useEffect } from "react";

function CELIChart({ dataPoints }) {
  const max = Math.max(...dataPoints.map(d => d.total));
  const width = 560;
  const height = 200;
  const padL = 60;
  const padR = 16;
  const padT = 16;
  const padB = 32;
  const chartW = width - padL - padR;
  const chartH = height - padT - padB;
  const n = dataPoints.length;

  const fmt = (n) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + "M$";
    if (n >= 1000) return Math.round(n / 1000) + "k$";
    return Math.round(n) + "$";
  };

  const contribPath = dataPoints.map((d, i) => {
    const x = padL + (i / (n - 1)) * chartW;
    const y = padT + chartH - (d.contributions / max) * chartH;
    return `${i === 0 ? "M" : "L"}${x},${y}`;
  }).join(" ");

  const totalPath = dataPoints.map((d, i) => {
    const x = padL + (i / (n - 1)) * chartW;
    const y = padT + chartH - (d.total / max) * chartH;
    return `${i === 0 ? "M" : "L"}${x},${y}`;
  }).join(" ");

  const totalAreaPath = [
    ...dataPoints.map((d, i) => {
      const x = padL + (i / (n - 1)) * chartW;
      const y = padT + chartH - (d.total / max) * chartH;
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    }),
    `L${padL + chartW},${padT + chartH}`,
    `L${padL},${padT + chartH}`, "Z"
  ].join(" ");

  const contribAreaPath = [
    ...dataPoints.map((d, i) => {
      const x = padL + (i / (n - 1)) * chartW;
      const y = padT + chartH - (d.contributions / max) * chartH;
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    }),
    `L${padL + chartW},${padT + chartH}`,
    `L${padL},${padT + chartH}`, "Z"
  ].join(" ");

  const yTicks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F0A500" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#F0A500" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="contribGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3DDC97" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#3DDC97" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {yTicks.map(t => {
        const y = padT + chartH - t * chartH;
        return (
          <g key={t}>
            <line x1={padL} y1={y} x2={padL + chartW} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <text x={padL - 8} y={y + 4} textAnchor="end" fontSize="10" fill="rgba(255,255,255,0.25)">{fmt(max * t)}</text>
          </g>
        );
      })}
      <path d={totalAreaPath} fill="url(#totalGrad)" />
      <path d={contribAreaPath} fill="url(#contribGrad)" />
      <path d={totalPath} fill="none" stroke="#F0A500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d={contribPath} fill="none" stroke="#3DDC97" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 3" />
      {dataPoints.filter((_, i) => i % Math.max(1, Math.floor(n / 5)) === 0 || i === n - 1).map((d) => {
        const origI = dataPoints.indexOf(d);
        const x = padL + (origI / (n - 1)) * chartW;
        return (
          <text key={origI} x={x} y={padT + chartH + 18} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.25)">
            {d.year}
          </text>
        );
      })}
      <circle cx={padL + chartW} cy={padT + chartH - (dataPoints[n - 1].total / max) * chartH} r="4" fill="#F0A500" />
    </svg>
  );
}

function CELICalculator() {
  const [age, setAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(65);
  const [currentBalance, setCurrentBalance] = useState(10000);
  const [monthlyContrib, setMonthlyContrib] = useState(300);
  const [returnRate, setReturnRate] = useState(7);

  const yearsToRetirement = Math.max(1, retirementAge - age);
  const monthlyRate = returnRate / 100 / 12;

  const dataPoints = useMemo(() => {
    const points = [];
    let bal = currentBalance;
    const currentYear = new Date().getFullYear();
    for (let y = 0; y <= yearsToRetirement; y++) {
      const contributions = currentBalance + monthlyContrib * 12 * y;
      points.push({ year: currentYear + y, total: bal, contributions: Math.min(contributions, bal) });
      for (let m = 0; m < 12; m++) bal = bal * (1 + monthlyRate) + monthlyContrib;
    }
    return points;
  }, [age, retirementAge, currentBalance, monthlyContrib, returnRate, yearsToRetirement, monthlyRate]);

  const finalBalance = dataPoints[dataPoints.length - 1].total;
  useEffect(() => {
    localStorage.setItem("celi:projected", Math.round(finalBalance));
  }, [finalBalance]);
  const totalContribs = currentBalance + monthlyContrib * 12 * yearsToRetirement;
  const growth = finalBalance - totalContribs;

  const fmt = (n) => Math.round(n).toLocaleString("fr-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 });
  const inputClass = "bg-[#0D1117] border border-[#21262D] text-[#E6EDF3] rounded-lg px-3.5 py-2.5 w-full text-sm focus:outline-none focus:border-[#F0A500]/50";

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between">
            <label className="text-xs text-[#8B949E] uppercase tracking-wider">Votre âge actuel</label>
            <span className="text-xs font-bold text-[#F0A500]">{age} ans</span>
          </div>
          <input type="range" min={18} max={retirementAge - 1} value={age}
            onChange={e => setAge(+e.target.value)} className="w-full accent-[#F0A500]" />
          <div className="flex justify-between text-xs text-[#484F58]"><span>18</span><span>{retirementAge - 1}</span></div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between">
            <label className="text-xs text-[#8B949E] uppercase tracking-wider">Âge de retraite visé</label>
            <span className="text-xs font-bold text-[#F0A500]">{retirementAge} ans</span>
          </div>
          <input type="range" min={age + 1} max={80} value={retirementAge}
            onChange={e => setRetirementAge(+e.target.value)} className="w-full accent-[#F0A500]" />
          <div className="flex justify-between text-xs text-[#484F58]"><span>{age + 1}</span><span>80</span></div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between">
            <label className="text-xs text-[#8B949E] uppercase tracking-wider">Taux de rendement</label>
            <span className="text-xs font-bold text-[#F0A500]">{returnRate}%</span>
          </div>
          <input type="range" min={1} max={12} value={returnRate}
            onChange={e => setReturnRate(+e.target.value)} className="w-full accent-[#F0A500]" />
          <div className="flex justify-between text-xs text-[#484F58]"><span>1%</span><span>12%</span></div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-[#8B949E] uppercase tracking-wider">Contribution mensuelle ($)</label>
          <input type="number" className={inputClass} value={monthlyContrib}
            onChange={e => setMonthlyContrib(+e.target.value)} min={0} />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="text-xs text-[#8B949E] uppercase tracking-wider">Solde actuel ($)</label>
          <input type="number" className={inputClass} value={currentBalance}
            onChange={e => setCurrentBalance(+e.target.value)} min={0} />
        </div>
      </div>

      {/* Summary bar */}
      <div className="bg-[#F0A500]/06 rounded-xl px-5 py-3 border border-[#F0A500]/15 flex flex-wrap gap-4 justify-between">
        <span className="text-xs text-[#8B949E]">
          📅 <strong className="text-[#E6EDF3]">{yearsToRetirement} ans</strong> d'investissement
        </span>
        <span className="text-xs text-[#8B949E]">
          🎯 Retraite à <strong className="text-[#E6EDF3]">{retirementAge} ans</strong>
        </span>
        <span className="text-xs text-[#8B949E]">
          📈 Rendement <strong className="text-[#E6EDF3]">{returnRate}%/an</strong>
        </span>
      </div>

      {/* Chart */}
      <div className="bg-[#0D1117] rounded-xl p-4 border border-[#21262D]">
        <div className="flex gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 bg-[#F0A500]"></div>
            <span className="text-xs text-[#8B949E]">Valeur totale</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6" style={{ borderTop: "2px dashed #3DDC97" }}></div>
            <span className="text-xs text-[#8B949E]">Vos contributions</span>
          </div>
        </div>
        <CELIChart dataPoints={dataPoints} />
      </div>

      {/* Results */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#0D1117] rounded-xl p-4 border border-[#21262D] text-center">
          <div className="text-xs text-[#8B949E] mb-2 uppercase tracking-wider">À la retraite</div>
          <div className="text-lg font-black text-[#F0A500]">{fmt(finalBalance)}</div>
        </div>
        <div className="bg-[#0D1117] rounded-xl p-4 border border-[#21262D] text-center">
          <div className="text-xs text-[#8B949E] mb-2 uppercase tracking-wider">Contributions</div>
          <div className="text-lg font-black text-[#E6EDF3]">{fmt(totalContribs)}</div>
        </div>
        <div className="bg-[#0D1117] rounded-xl p-4 border border-[#21262D] text-center">
          <div className="text-xs text-[#8B949E] mb-2 uppercase tracking-wider">Croissance</div>
          <div className="text-lg font-black text-[#3DDC97]">{fmt(growth)}</div>
        </div>
      </div>

      <div className="bg-[#F0A500]/06 rounded-xl p-4 border border-[#F0A500]/20">
        <p className="text-sm text-[#8B949E] leading-relaxed">
          En contribuant <strong className="text-[#E6EDF3]">{fmt(monthlyContrib)}/mois</strong> pendant{" "}
          <strong className="text-[#E6EDF3]">{yearsToRetirement} ans</strong>, votre CELI pourrait atteindre{" "}
          <strong className="text-[#F0A500]">{fmt(finalBalance)}</strong> à <strong className="text-[#E6EDF3]">{retirementAge} ans</strong> — dont{" "}
          <strong className="text-[#3DDC97]">{fmt(growth)}</strong> en intérêts composés, libres d'impôt.
        </p>
      </div>
    </div>
  );
}

export default function CalculateurCELIPage() {
  return (
    <Layout title="Calculateur CELI — Projetez votre retraite">
      <div className="max-w-3xl mx-auto px-6 pb-20">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#8B949E] hover:text-[#E6EDF3] no-underline pt-6 pb-8 transition-colors">
          ← Retour aux outils
        </Link>

        <div className="mb-10">
          <div className="inline-block bg-[#F0A500]/10 border border-[#F0A500]/20 rounded-full px-3 py-1 text-xs text-[#F0A500] uppercase tracking-widest mb-4">
            Investissement
          </div>
          <h1 className="text-3xl font-extrabold text-[#E6EDF3] tracking-tight mb-3">Calculateur CELI</h1>
          <p className="text-base text-[#8B949E] leading-relaxed font-light">
            Projetez la croissance de votre CELI jusqu'à l'âge de retraite que vous visez.
            Ajustez les paramètres pour voir l'impact de vos contributions en temps réel.
          </p>
        </div>

        <div className="bg-[#161B22] rounded-2xl p-7 border border-[#21262D] mb-7">
          <CELICalculator />
        </div>

        <div className="bg-[#161B22] rounded-2xl p-7 border border-[#21262D] mb-7">
          <h2 className="text-lg font-bold text-[#E6EDF3] mb-4">Pourquoi le CELI est si puissant?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: "🚫", title: "Zéro impôt sur la croissance", desc: "Vos gains, dividendes et intérêts ne sont jamais imposés, même au retrait." },
              { icon: "🔄", title: "Retraits sans pénalité", desc: "Vous récupérez vos droits de cotisation l'année suivante. Aucune restriction." },
              { icon: "📅", title: "Droits cumulatifs", desc: "Si vous n'avez jamais cotisé, vous pouvez accumuler jusqu'à 95 000$ de droits (2024)." },
            ].map(item => (
              <div key={item.title} className="bg-[#0D1117] rounded-xl p-4 border border-[#21262D]">
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="text-sm font-bold text-[#E6EDF3] mb-1">{item.title}</div>
                <div className="text-xs text-[#8B949E] leading-relaxed font-light">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#F0A500]/06 border border-[#F0A500]/25 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-[#E6EDF3] mb-2">Ouvrez votre CELI en 5 minutes</h3>
          <p className="text-sm text-[#8B949E] mb-6 leading-relaxed max-w-sm mx-auto">
            Wealthsimple est la plateforme canadienne la plus simple pour ouvrir un CELI.
            Aucuns frais, aucune commission sur les FNB. Recevez un bonus à l'ouverture.
          </p>
          <a href="https://www.wealthsimple.com/invite/EDVQ3W"
            target="_blank" rel="noopener noreferrer sponsored"
            className="inline-block bg-[#F0A500] text-[#0D1117] font-bold rounded-xl px-8 py-3.5 text-sm tracking-wide hover:bg-[#D4940A] transition-colors no-underline">
            Ouvrir un CELI chez Wealthsimple →
          </a>
          <p className="text-xs text-[#484F58] mt-4">
            ✓ Gratuit · ✓ Aucune commission · ✓ Protégé FCPE · Lien affilié
          </p>
        </div>
      </div>
    </Layout>
  );
}
