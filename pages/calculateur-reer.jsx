import { useState, useMemo, useEffect } from "react";
import Layout from "../components/Layout";
import AffiliateLink from "../components/AffiliateLink";

// ─── Tax Data 2025 ───────────────────────────────────────────────────────────
const FEDERAL_BRACKETS = [
  { min: 0, max: 57375, rate: 0.15 },
  { min: 57375, max: 114750, rate: 0.205 },
  { min: 114750, max: 158519, rate: 0.26 },
  { min: 158519, max: 220000, rate: 0.29 },
  { min: 220000, max: Infinity, rate: 0.33 },
];

const PROVINCIAL_BRACKETS = {
  QC: [
    { min: 0, max: 51780, rate: 0.14 },
    { min: 51780, max: 103545, rate: 0.19 },
    { min: 103545, max: 126000, rate: 0.24 },
    { min: 126000, max: Infinity, rate: 0.2575 },
  ],
  ON: [
    { min: 0, max: 51446, rate: 0.0505 },
    { min: 51446, max: 102894, rate: 0.0915 },
    { min: 102894, max: 150000, rate: 0.1116 },
    { min: 150000, max: 220000, rate: 0.1216 },
    { min: 220000, max: Infinity, rate: 0.1316 },
  ],
  BC: [
    { min: 0, max: 45654, rate: 0.0506 },
    { min: 45654, max: 91310, rate: 0.077 },
    { min: 91310, max: 104835, rate: 0.105 },
    { min: 104835, max: 127299, rate: 0.1229 },
    { min: 127299, max: 172602, rate: 0.147 },
    { min: 172602, max: 240716, rate: 0.168 },
    { min: 240716, max: Infinity, rate: 0.205 },
  ],
  AB: [
    { min: 0, max: 148269, rate: 0.10 },
    { min: 148269, max: 177922, rate: 0.12 },
    { min: 177922, max: 237230, rate: 0.13 },
    { min: 237230, max: 355845, rate: 0.14 },
    { min: 355845, max: Infinity, rate: 0.15 },
  ],
  SK: [
    { min: 0, max: 49720, rate: 0.105 },
    { min: 49720, max: 142058, rate: 0.125 },
    { min: 142058, max: Infinity, rate: 0.145 },
  ],
  MB: [
    { min: 0, max: 47000, rate: 0.108 },
    { min: 47000, max: 100000, rate: 0.1275 },
    { min: 100000, max: Infinity, rate: 0.174 },
  ],
  NB: [
    { min: 0, max: 47715, rate: 0.094 },
    { min: 47715, max: 95431, rate: 0.14 },
    { min: 95431, max: 176756, rate: 0.16 },
    { min: 176756, max: Infinity, rate: 0.195 },
  ],
  NS: [
    { min: 0, max: 29590, rate: 0.0879 },
    { min: 29590, max: 59180, rate: 0.1495 },
    { min: 59180, max: 93000, rate: 0.1667 },
    { min: 93000, max: 150000, rate: 0.175 },
    { min: 150000, max: Infinity, rate: 0.21 },
  ],
  PE: [
    { min: 0, max: 32656, rate: 0.096 },
    { min: 32656, max: 64313, rate: 0.1337 },
    { min: 64313, max: 105000, rate: 0.167 },
    { min: 105000, max: 140000, rate: 0.18 },
    { min: 140000, max: Infinity, rate: 0.1875 },
  ],
  NL: [
    { min: 0, max: 43198, rate: 0.087 },
    { min: 43198, max: 86395, rate: 0.145 },
    { min: 86395, max: 154244, rate: 0.158 },
    { min: 154244, max: 215943, rate: 0.178 },
    { min: 215943, max: 275870, rate: 0.198 },
    { min: 275870, max: 551739, rate: 0.208 },
    { min: 551739, max: Infinity, rate: 0.218 },
  ],
  YT: [
    { min: 0, max: 57375, rate: 0.064 },
    { min: 57375, max: 114750, rate: 0.09 },
    { min: 114750, max: 500000, rate: 0.109 },
    { min: 500000, max: Infinity, rate: 0.15 },
  ],
  NT: [
    { min: 0, max: 50597, rate: 0.059 },
    { min: 50597, max: 101198, rate: 0.086 },
    { min: 101198, max: 164525, rate: 0.122 },
    { min: 164525, max: Infinity, rate: 0.1405 },
  ],
  NU: [
    { min: 0, max: 53268, rate: 0.04 },
    { min: 53268, max: 106537, rate: 0.07 },
    { min: 106537, max: 173205, rate: 0.09 },
    { min: 173205, max: Infinity, rate: 0.115 },
  ],
};

const PROVINCES = [
  { code: "QC", name: "Québec" },
  { code: "ON", name: "Ontario" },
  { code: "BC", name: "Colombie-Britannique" },
  { code: "AB", name: "Alberta" },
  { code: "SK", name: "Saskatchewan" },
  { code: "MB", name: "Manitoba" },
  { code: "NB", name: "Nouveau-Brunswick" },
  { code: "NS", name: "Nouvelle-Écosse" },
  { code: "PE", name: "Île-du-Prince-Édouard" },
  { code: "NL", name: "Terre-Neuve-et-Labrador" },
  { code: "YT", name: "Yukon" },
  { code: "NT", name: "Territoires du Nord-Ouest" },
  { code: "NU", name: "Nunavut" },
];

// ─── Tax Calculations ─────────────────────────────────────────────────────────
function calcTax(income, brackets) {
  let tax = 0;
  for (const b of brackets) {
    if (income <= b.min) break;
    tax += (Math.min(income, b.max) - b.min) * b.rate;
  }
  return tax;
}

function getMarginalRate(income, province) {
  const fedBracket = FEDERAL_BRACKETS.findLast((b) => income > b.min) || FEDERAL_BRACKETS[0];
  const provBrackets = PROVINCIAL_BRACKETS[province] || PROVINCIAL_BRACKETS.ON;
  const provBracket = provBrackets.findLast((b) => income > b.min) || provBrackets[0];
  return fedBracket.rate + provBracket.rate;
}

function getRefund(income, contribution, province) {
  const provBrackets = PROVINCIAL_BRACKETS[province] || PROVINCIAL_BRACKETS.ON;
  const taxBefore = calcTax(income, FEDERAL_BRACKETS) + calcTax(income, provBrackets);
  const taxAfter = calcTax(income - contribution, FEDERAL_BRACKETS) + calcTax(income - contribution, provBrackets);
  return Math.max(0, taxBefore - taxAfter);
}

// ─── Chart ───────────────────────────────────────────────────────────────────
function AreaChart({ dataBase, dataReinvest, showReinvest, maxVal }) {
  if (!dataBase.length) return null;
  const W = 500, H = 140, PX = 8, PY = 12;
  const iW = W - PX * 2, iH = H - PY * 2;
  const x = (i) => PX + (i / (dataBase.length - 1)) * iW;
  const y = (v) => PY + ((maxVal - v) / (maxVal || 1)) * iH;

  const pathBase = dataBase.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(v)}`).join(" ");
  const areaBase = pathBase + ` L ${x(dataBase.length - 1)} ${H} L ${PX} ${H} Z`;

  const pathReinvest = dataReinvest.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(v)}`).join(" ");
  const areaReinvest = pathReinvest + ` L ${x(dataReinvest.length - 1)} ${H} L ${PX} ${H} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 140 }}>
      <defs>
        <linearGradient id="gradBase" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F0A500" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#F0A500" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="gradReinvest" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3DDC97" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#3DDC97" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaBase} fill="url(#gradBase)" />
      <path d={pathBase} fill="none" stroke="#F0A500" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {showReinvest && (
        <>
          <path d={areaReinvest} fill="url(#gradReinvest)" />
          <path d={pathReinvest} fill="none" stroke="#3DDC97" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => "$" + Math.round(n || 0).toLocaleString("fr-CA");
const pct = (n) => (n * 100).toFixed(1) + "%";

function Slider({ label, value, min, max, step, onChange, display }) {
  const [editing, setEditing] = useState(false);
  const [raw, setRaw] = useState("");

  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <label className="text-xs text-[#8B949E]">{label}</label>
        {editing ? (
          <input
            type="number" autoFocus value={raw} min={min} max={max}
            onChange={(e) => setRaw(e.target.value)}
            onBlur={() => { const v = Math.min(max, Math.max(min, Number(raw) || value)); onChange(v); setEditing(false); }}
            onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); if (e.key === "Escape") setEditing(false); }}
            className="w-28 bg-[#0D1117] border border-[#F0A500] rounded px-2 py-0.5 text-xs text-[#E6EDF3] text-right focus:outline-none"
          />
        ) : (
          <span onClick={() => { setRaw(value); setEditing(true); }}
            className="text-xs font-medium text-[#E6EDF3] tabular-nums cursor-pointer hover:text-[#F0A500] transition-colors border-b border-dashed border-[#484F58]"
            title="Cliquez pour modifier">
            {display}
          </span>
        )}
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#F0A500] h-1.5 rounded-full cursor-pointer" />
      <div className="flex justify-between text-[10px] text-[#484F58] mt-1">
        <span>{typeof min === "number" && min >= 1000 ? fmt(min) : min}</span>
        <span>{typeof max === "number" && max >= 1000 ? fmt(max) : max}</span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CalculateurREER() {
  const [income, setIncome] = useState(75000);
  const [monthly, setMonthly] = useState(500);
  const [employerPct, setEmployerPct] = useState(0);
  const [age, setAge] = useState(35);
  const [retireAge, setRetireAge] = useState(65);
  const [returnRate, setReturnRate] = useState(6);
  const [province, setProvince] = useState("QC");
  const [reinvest, setReinvest] = useState(false);
  const [tab, setTab] = useState("inputs");
  const [contribMode, setContribMode] = useState("$");
  const [employeePct, setEmployeePct] = useState(3);

  const years = Math.max(1, retireAge - age);
  const annualContrib = monthly * 12;
  const employerMonthly = (income / 12) * (employerPct / 100);
  const employerAnnual = employerMonthly * 12;
  const totalMonthly = monthly + employerMonthly;
  // Employer contrib is a taxable benefit — adds to income but doesn't generate refund
  const taxableIncomeWithEmployer = income + employerAnnual;
  const marginalRate = getMarginalRate(taxableIncomeWithEmployer, province);
  // Refund only on employee contribution
  const annualRefund = getRefund(taxableIncomeWithEmployer, annualContrib, province);
  const monthlyRefund = annualRefund / 12;

  const { dataBase, dataReinvest, finalBase, finalReinvest, retireTaxRate, netBase, netReinvest } = useMemo(() => {
    const r = returnRate / 100 / 12;
    const dataBase = [];
    const dataReinvest = [];
    let balBase = 0, balReinvest = 0;
    const empMonthly = (income / 12) * (employerPct / 100);
    const total = monthly + empMonthly;
    const refundMonthly = annualRefund / 12;

    for (let m = 0; m <= years * 12; m++) {
      if (m % 12 === 0) {
        dataBase.push(balBase);
        dataReinvest.push(balReinvest);
      }
      balBase = balBase * (1 + r) + total;
      balReinvest = balReinvest * (1 + r) + total + (reinvest ? refundMonthly : 0);
    }

    const finalBase = dataBase[dataBase.length - 1];
    const finalReinvest = dataReinvest[dataReinvest.length - 1];
    const retireIncome = 60000;
    const retireTaxRate = getMarginalRate(retireIncome, province);
    const netBase = finalBase * (1 - retireTaxRate);
    const netReinvest = finalReinvest * (1 - retireTaxRate);

    return { dataBase, dataReinvest, finalBase, finalReinvest, retireTaxRate, netBase, netReinvest };
  }, [income, monthly, employerPct, age, retireAge, returnRate, province, reinvest, annualRefund, years]);

  useEffect(() => {
    localStorage.setItem("reer:projected", Math.round(reinvest ? finalReinvest : finalBase));
  }, [finalBase, finalReinvest, reinvest]);

  const maxVal = Math.max(...dataReinvest, ...dataBase);
  const yearLabels = Array.from({ length: years + 1 }, (_, i) => new Date().getFullYear() + i);
  const gain = reinvest ? finalReinvest - finalBase : 0;

  const tabs = [
    { key: "inputs", label: "Paramètres" },
    { key: "results", label: "Résultats" },
    { key: "info", label: "C'est quoi le REER?" },
  ];

  return (
    <Layout title="Calculateur REER — Projetez votre retraite">
      <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", background: "#0D1117", minHeight: "100vh", padding: "2rem 1rem" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');`}</style>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>

          {/* Header */}
          <div className="mb-6">
            <div className="text-[10px] text-[#484F58] uppercase tracking-widest mb-1">monportefeuille.ca</div>
            <h1 style={{ fontFamily: "'DM Mono', monospace" }} className="text-3xl font-medium text-[#E6EDF3]">
              Calculateur REER
            </h1>
            <p className="text-sm text-[#8B949E] mt-1">Estimez votre remboursement d'impôt et votre valeur à la retraite</p>
          </div>

          {/* Hero — Tax Summary */}
          <div className="rounded-2xl p-5 mb-4 relative overflow-hidden" style={{ background: "#161B22", border: "1px solid #21262D" }}>
            <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 80% 50%, rgba(240,165,0,0.07) 0%, transparent 65%)" }} />
            <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <div className="text-[10px] text-[#8B949E] uppercase tracking-wide mb-1">Taux marginal</div>
                <div style={{ fontFamily: "'DM Mono', monospace" }} className="text-2xl text-[#F0A500] font-medium">{pct(marginalRate)}</div>
                <div className="text-[10px] text-[#484F58] mt-0.5">fédéral + {province}</div>
              </div>
              <div>
                <div className="text-[10px] text-[#8B949E] uppercase tracking-wide mb-1">Remboursement / an</div>
                <div style={{ fontFamily: "'DM Mono', monospace" }} className="text-2xl text-[#3DDC97] font-medium">{fmt(annualRefund)}</div>
                <div className="text-[10px] text-[#484F58] mt-0.5">{fmt(monthlyRefund)} / mois</div>
              </div>
              <div>
                <div className="text-[10px] text-[#8B949E] uppercase tracking-wide mb-1">Valeur à la retraite</div>
                <div style={{ fontFamily: "'DM Mono', monospace" }} className="text-2xl text-[#E6EDF3] font-medium">{fmt(reinvest ? finalReinvest : finalBase)}</div>
                <div className="text-[10px] text-[#484F58] mt-0.5">brut à {retireAge} ans</div>
              </div>
              <div>
                <div className="text-[10px] text-[#8B949E] uppercase tracking-wide mb-1">Valeur nette (après impôt)</div>
                <div style={{ fontFamily: "'DM Mono', monospace" }} className="text-2xl text-[#E6EDF3] font-medium">{fmt(reinvest ? netReinvest : netBase)}</div>
                <div className="text-[10px] text-[#484F58] mt-0.5">estimé à {pct(retireTaxRate)} retraite</div>
              </div>
            </div>

            {reinvest && gain > 0 && (
              <div className="mt-4 bg-[#3DDC97]/10 border border-[#3DDC97]/20 rounded-xl px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs text-[#3DDC97]">✦ Gain du réinvestissement automatique</span>
                <span style={{ fontFamily: "'DM Mono', monospace" }} className="text-sm text-[#3DDC97] font-medium">+{fmt(gain)}</span>
              </div>
            )}
          </div>

          {/* Chart */}
          <div className="rounded-2xl p-5 mb-4" style={{ background: "#161B22", border: "1px solid #21262D" }}>
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs text-[#8B949E] uppercase tracking-widest">Projection sur {years} ans</div>
              <div className="flex items-center gap-3 text-[10px] text-[#8B949E]">
                <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-[#F0A500] inline-block rounded" />Sans réinvestissement</span>
                {reinvest && <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-[#3DDC97] inline-block rounded" />Avec réinvestissement</span>}
              </div>
            </div>
            <AreaChart dataBase={dataBase} dataReinvest={dataReinvest} showReinvest={reinvest} maxVal={maxVal} />
            <div className="flex justify-between mt-1 text-[10px] text-[#484F58]">
              <span>{new Date().getFullYear()}</span>
              <span>{new Date().getFullYear() + Math.floor(years / 2)}</span>
              <span>{new Date().getFullYear() + years}</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-4 bg-[#161B22] border border-[#21262D] rounded-xl p-1">
            {tabs.map(({ key, label }) => (
              <button key={key} onClick={() => setTab(key)}
                className={`flex-1 text-xs py-2 rounded-lg transition-all font-medium ${tab === key ? "bg-[#21262D] text-[#E6EDF3]" : "text-[#8B949E] hover:text-[#C9D1D9]"}`}>
                {label}
              </button>
            ))}
          </div>

          {/* Inputs Tab */}
          {tab === "inputs" && (
            <div className="rounded-2xl p-5 space-y-5" style={{ background: "#161B22", border: "1px solid #21262D" }}>

              {/* Province */}
              <div>
                <label className="text-xs text-[#8B949E] block mb-1.5">Province / Territoire</label>
                <select value={province} onChange={(e) => setProvince(e.target.value)}
                  className="w-full bg-[#0D1117] border border-[#21262D] rounded-lg px-3 py-2.5 text-[#E6EDF3] text-sm focus:outline-none focus:border-[#F0A500] transition-colors">
                  {PROVINCES.map((p) => <option key={p.code} value={p.code}>{p.name}</option>)}
                </select>
              </div>

              <Slider label="Revenu annuel brut" value={income} min={30000} max={300000} step={1000}
                onChange={setIncome} display={fmt(income)} />
              {/* Employee contribution — $ or % */}
              <div className="bg-[#0D1117] rounded-xl p-4 border border-[#21262D] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#8B949E]">Ma contribution au REER</span>
                  <div className="flex gap-1">
                    <button onClick={() => setContribMode("$")}
                      className={`text-[10px] px-2 py-0.5 rounded transition-all ${contribMode === "$" ? "bg-[#F0A500] text-[#0D1117] font-bold" : "text-[#8B949E] border border-[#21262D]"}`}>
                      $
                    </button>
                    <button onClick={() => setContribMode("%")}
                      className={`text-[10px] px-2 py-0.5 rounded transition-all ${contribMode === "%" ? "bg-[#F0A500] text-[#0D1117] font-bold" : "text-[#8B949E] border border-[#21262D]"}`}>
                      %
                    </button>
                  </div>
                </div>
                {contribMode === "$" ? (
                  <Slider label="Montant mensuel" value={monthly} min={50} max={3000} step={50}
                    onChange={setMonthly} display={fmt(monthly) + " / mois"} />
                ) : (
                  <Slider label="% du salaire brut" value={employeePct} min={0.5} max={18} step={0.5}
                    onChange={(v) => { setEmployeePct(v); setMonthly(Math.round((income / 12) * (v / 100))); }}
                    display={`${employeePct}% → ${fmt((income / 12) * (employeePct / 100))}/mois`} />
                )}
              </div>

              {/* Employer contribution */}
              <div className="bg-[#0D1117] rounded-xl p-4 border border-[#21262D] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#8B949E]">Contribution de l'employeur</span>
                  <span className="text-[10px] text-[#484F58] bg-[#21262D] rounded px-2 py-0.5">Avantage imposable</span>
                </div>
                <Slider label="% du salaire brut (employeur)" value={employerPct} min={0} max={20} step={0.5}
                  onChange={setEmployerPct} display={employerPct > 0 ? `${employerPct}% → ${fmt(employerMonthly)}/mois` : "0% (aucune)"} />
                {employerPct > 0 && (
                  <div className="text-[10px] text-[#8B949E] bg-[#161B22] rounded-lg px-3 py-2 leading-relaxed">
                    ✓ Votre part ({fmt(monthly)}/mois) génère un remboursement d'impôt<br/>
                    ✗ Part employeur ({fmt(employerMonthly)}/mois) = avantage imposable, pas de remboursement<br/>
                    ✓ Les deux ({fmt(totalMonthly)}/mois) contribuent à votre valeur à la retraite
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Slider label="Âge actuel" value={age} min={18} max={retireAge - 1} step={1}
                  onChange={setAge} display={age + " ans"} />
                <Slider label="Âge de retraite" value={retireAge} min={age + 1} max={75} step={1}
                  onChange={setRetireAge} display={retireAge + " ans"} />
              </div>

              <Slider label="Rendement annuel estimé" value={returnRate} min={1} max={12} step={0.5}
                onChange={setReturnRate} display={returnRate + "%"} />

              {/* Reinvest toggle */}
              <div className="flex items-start gap-3 bg-[#0D1117] rounded-xl p-4 border border-[#21262D] cursor-pointer"
                onClick={() => setReinvest(!reinvest)}>
                <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all border ${reinvest ? "bg-[#3DDC97] border-[#3DDC97]" : "border-[#484F58]"}`}>
                  {reinvest && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#0D1117" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                </div>
                <div>
                  <div className="text-sm text-[#E6EDF3] font-medium">Réinvestir le remboursement automatiquement</div>
                  <div className="text-xs text-[#8B949E] mt-0.5">
                    Ajoute {fmt(monthlyRefund)}/mois à vos contributions — l'effet boule de neige du REER.
                    Gain potentiel sur {years} ans : <span className="text-[#3DDC97]">{fmt(finalReinvest - finalBase)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results Tab */}
          {tab === "results" && (
            <div className="space-y-3">
              <div className="rounded-2xl p-5" style={{ background: "#161B22", border: "1px solid #21262D" }}>
                <div className="text-xs text-[#8B949E] uppercase tracking-widest mb-4">Résumé fiscal</div>
                <div className="space-y-3">
                  {[
                    { label: "Revenu brut", val: fmt(income), color: "#E6EDF3" },
                    ...(employerPct > 0 ? [{ label: `Avantage imposable employeur (${employerPct}%)`, val: "+" + fmt(employerAnnual), color: "#F0A500" }] : []),
                    ...(employerPct > 0 ? [{ label: "Revenu imposable total", val: fmt(taxableIncomeWithEmployer), color: "#E6EDF3" }] : []),
                    { label: "Votre contribution annuelle REER", val: fmt(annualContrib), color: "#E6EDF3" },
                    ...(employerPct > 0 ? [{ label: "Contribution employeur annuelle", val: fmt(employerAnnual), color: "#8B949E" }] : []),
                    { label: "Taux marginal combiné", val: pct(marginalRate), color: "#F0A500" },
                    { label: "Remboursement d'impôt (votre part seulement)", val: fmt(annualRefund), color: "#3DDC97" },
                    { label: "Remboursement mensuel", val: fmt(monthlyRefund), color: "#3DDC97" },
                  ].map(({ label, val, color }) => (
                    <div key={label} className="flex justify-between items-center py-2 border-b border-[#21262D] last:border-0">
                      <span className="text-xs text-[#8B949E]">{label}</span>
                      <span style={{ fontFamily: "'DM Mono', monospace", color }} className="text-sm font-medium">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl p-5" style={{ background: "#161B22", border: "1px solid #21262D" }}>
                <div className="text-xs text-[#8B949E] uppercase tracking-widest mb-4">Projection à la retraite ({retireAge} ans)</div>
                <div className="space-y-3">
                  {[
                    { label: "Valeur brute (sans réinvestissement)", val: fmt(finalBase), color: "#F0A500" },
                    ...(reinvest ? [{ label: "Valeur brute (avec réinvestissement)", val: fmt(finalReinvest), color: "#3DDC97" }] : []),
                    { label: "Taux d'imposition estimé à la retraite", val: pct(retireTaxRate), color: "#E6EDF3" },
                    { label: "Valeur nette après impôt (sans réinvestissement)", val: fmt(netBase), color: "#F0A500" },
                    ...(reinvest ? [{ label: "Valeur nette après impôt (avec réinvestissement)", val: fmt(netReinvest), color: "#3DDC97" }] : []),
                    ...(reinvest ? [{ label: "Gain total du réinvestissement", val: "+" + fmt(finalReinvest - finalBase), color: "#3DDC97" }] : []),
                  ].map(({ label, val, color }) => (
                    <div key={label} className="flex justify-between items-center py-2 border-b border-[#21262D] last:border-0">
                      <span className="text-xs text-[#8B949E]">{label}</span>
                      <span style={{ fontFamily: "'DM Mono', monospace", color }} className="text-sm font-medium">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Info Tab */}
          {tab === "info" && (
            <div className="rounded-2xl p-5 space-y-4" style={{ background: "#161B22", border: "1px solid #21262D" }}>
              {[
                { icon: "💡", title: "C'est quoi un REER?", text: "Le Régime Enregistré d'Épargne-Retraite (REER) est un compte d'épargne canadien qui permet de reporter l'impôt. Vos contributions réduisent votre revenu imposable aujourd'hui, et vous payez l'impôt seulement au retrait à la retraite — idéalement quand votre taux est plus bas." },
                { icon: "💸", title: "Le remboursement d'impôt", text: "Chaque dollar contribué au REER réduit votre revenu imposable. Si votre taux marginal est de 45%, une contribution de 10 000$ vous donne un remboursement de ~4 500$. Réinvestir ce remboursement chaque année crée un effet boule de neige puissant." },
                { icon: "📅", title: "Date limite de contribution", text: "La date limite pour contribuer et déduire dans l'année fiscale courante est le 1er mars (60 jours après le 31 décembre). Vos droits de cotisation sont 18% de votre revenu de l'année précédente, jusqu'au maximum annuel." },
                { icon: "🔄", title: "REER vs CELI", text: "Le REER est optimal si vous êtes dans une tranche d'imposition élevée maintenant et prévoyez être dans une tranche plus basse à la retraite. Le CELI est idéal si vous êtes dans une tranche basse maintenant. Les deux sont complémentaires." },
                { icon: "⚠️", title: "Important", text: "Ce calculateur est un outil éducatif. Les taux d'imposition sont basés sur 2025 et peuvent changer. Pour des conseils personnalisés, consultez un planificateur financier." },
              ].map(({ icon, title, text }) => (
                <div key={title} className="bg-[#0D1117] rounded-xl p-4 border border-[#21262D]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{icon}</span>
                    <span className="text-sm font-medium text-[#E6EDF3]">{title}</span>
                  </div>
                  <p className="text-xs text-[#8B949E] leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="mt-4 bg-[#F0A500]/06 border border-[#F0A500]/25 rounded-2xl p-8 text-center">
            <div className="text-3xl mb-3">🏦</div>
            <h3 className="text-xl font-bold text-[#E6EDF3] mb-2">Ouvrez votre REER chez Wealthsimple</h3>
            <p className="text-sm text-[#8B949E] mb-6 leading-relaxed max-w-sm mx-auto">
              Aucuns frais, aucune commission sur les FNB. Recevez un bonus à l'ouverture de votre compte.
            </p>
            <AffiliateLink
              href="https://www.wealthsimple.com/invite/EDVQ3W"
              partner="wealthsimple-reer"
              className="inline-block bg-[#F0A500] text-[#0D1117] font-bold rounded-xl px-8 py-3.5 text-sm tracking-wide hover:bg-[#D4940A] transition-colors no-underline"
            >
              Ouvrir un REER chez Wealthsimple →
            </AffiliateLink>
            <p className="text-xs text-[#484F58] mt-4">✓ Gratuit · ✓ Aucune commission · ✓ Protégé FCPE · Lien affilié</p>
          </div>

        </div>
      </div>
    </Layout>
  );
}