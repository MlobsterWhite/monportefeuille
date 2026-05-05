import { useState, useMemo, useEffect } from "react";
import Layout from "../components/Layout";
import AffiliateLink from "../components/AffiliateLink";
import ShareButton from "../components/ShareButton";        
import useSharedParams from "../hooks/useSharedParams";

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

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => "$" + Math.round(n || 0).toLocaleString("fr-CA");

// ─── Slider with click-to-edit ────────────────────────────────────────────────
function Slider({ label, value, min, max, step, onChange, display, color = "#F0A500" }) {
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
            className="w-28 bg-[#0D1117] border rounded px-2 py-0.5 text-xs text-[#E6EDF3] text-right focus:outline-none"
            style={{ borderColor: color }}
          />
        ) : (
          <span onClick={() => { setRaw(value); setEditing(true); }}
            className="text-xs font-medium text-[#E6EDF3] tabular-nums cursor-pointer hover:opacity-80 transition-opacity border-b border-dashed border-[#484F58]"
            title="Cliquez pour modifier">
            {display}
          </span>
        )}
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full cursor-pointer"
        style={{ accentColor: color }} />
      <div className="flex justify-between text-[10px] text-[#484F58] mt-1">
        <span>{typeof min === "number" && min >= 1000 ? fmt(min) : min}</span>
        <span>{typeof max === "number" && max >= 1000 ? fmt(max) : max}</span>
      </div>
    </div>
  );
}

// ─── Dual Chart Component ─────────────────────────────────────────────────────
function DualChart({ celiData, reerData, years }) {
  if (!celiData.length || !reerData.length) return null;
  
  const W = 500, H = 180, PX = 8, PY = 12;
  const iW = W - PX * 2, iH = H - PY * 2;
  const maxVal = Math.max(...celiData, ...reerData);
  
  const x = (i) => PX + (i / (celiData.length - 1)) * iW;
  const y = (v) => PY + ((maxVal - v) / (maxVal || 1)) * iH;

  const celiPath = celiData.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(v)}`).join(" ");
  const reerPath = reerData.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(v)}`).join(" ");
  
  const celiArea = celiPath + ` L ${x(celiData.length - 1)} ${H} L ${PX} ${H} Z`;
  const reerArea = reerPath + ` L ${x(reerData.length - 1)} ${H} L ${PX} ${H} Z`;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 180 }}>
        <defs>
          <linearGradient id="celiGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F0A500" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#F0A500" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="reerGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#60A5FA" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        <path d={celiArea} fill="url(#celiGrad)" />
        <path d={celiPath} fill="none" stroke="#F0A500" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        
        <path d={reerArea} fill="url(#reerGrad)" />
        <path d={reerPath} fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      
      <div className="flex justify-center gap-6 mt-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ background: "#F0A500" }} />
          <span className="text-[#8B949E]">CELI</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ background: "#60A5FA" }} />
          <span className="text-[#8B949E]">REER</span>
        </div>
      </div>
      
      <div className="flex justify-between text-[10px] text-[#484F58] mt-2">
        <span>{years[0]} ans</span>
        <span>{Math.round((years[0] + years[years.length - 1]) / 2)} ans</span>
        <span>{years[years.length - 1]} ans</span>
      </div>
    </div>
  );
}

// ─── Advice Card Component ────────────────────────────────────────────────────
function AdviceCard({ title, points, color }) {
  return (
    <div className="rounded-2xl p-5 border" style={{ 
      background: `${color}15`, 
      borderColor: `${color}40` 
    }}>
      <h3 className="text-sm font-medium text-[#E6EDF3] mb-3">{title}</h3>
      <ul className="space-y-2">
        {points.map((point, i) => (
          <li key={i} className="text-xs text-[#8B949E] leading-relaxed flex gap-2">
            <span className="text-[#484F58] mt-0.5">•</span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CELIvsREER() {
  const [budgetMonthly, setBudgetMonthly] = useState(500);
  const [income, setIncome] = useState(75000);
  const [age, setAge] = useState(35);
  const [retireAge, setRetireAge] = useState(65);
  const [province, setProvince] = useState("QC");
  const [returnRate, setReturnRate] = useState(6);
  const [retireIncome, setRetireIncome] = useState(45000);
  const [tab, setTab] = useState("inputs");

  useSharedParams({
    budgetMonthly: { setter: setBudgetMonthly, parser: Number },
    income: { setter: setIncome, parser: Number },
    age: { setter: setAge, parser: Number },
    retireAge: { setter: setRetireAge, parser: Number },
    province: { setter: setProvince },
    returnRate: { setter: setReturnRate, parser: Number },
    retireIncome: { setter: setRetireIncome, parser: Number },
  });

  useEffect(() => {
    if (!window.location.search.includes('retireIncome')) {
      setRetireIncome(Math.round(income * 0.6));
    }
  }, [income]);

  useEffect(() => {
    try {
      localStorage.setItem("celivsreer:params", JSON.stringify({
        budgetMonthly, income, age, retireAge, province, returnRate, retireIncome
      }));
    } catch {}
  }, [budgetMonthly, income, age, retireAge, province, returnRate, retireIncome]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("celivsreer:params");
      if (saved && !window.location.search) {
        const p = JSON.parse(saved);
        if (p.budgetMonthly) setBudgetMonthly(p.budgetMonthly);
        if (p.income) setIncome(p.income);
        if (p.age) setAge(p.age);
        if (p.retireAge) setRetireAge(p.retireAge);
        if (p.province) setProvince(p.province);
        if (p.returnRate) setReturnRate(p.returnRate);
        if (p.retireIncome) setRetireIncome(p.retireIncome);
      }
    } catch {}
  }, []);

  const results = useMemo(() => {
    const years = Math.max(1, retireAge - age);
    const r = returnRate / 100;
    
    const celiMonthly = budgetMonthly;
    const celiAnnual = celiMonthly * 12;
    const celiValue = celiAnnual * (((Math.pow(1 + r, years) - 1) / r));
    const celiNet = celiValue;
    
    const marginalRate = getMarginalRate(income, province);
    const reerMonthly = budgetMonthly / (1 - marginalRate);
    const reerAnnual = reerMonthly * 12;
    const refundAnnual = reerAnnual * marginalRate;
    
    const reerValue = reerAnnual * (((Math.pow(1 + r, years) - 1) / r));
    
    const provBrackets = PROVINCIAL_BRACKETS[province] || PROVINCIAL_BRACKETS.ON;
    const fedTax = calcTax(retireIncome, FEDERAL_BRACKETS);
    const provTax = calcTax(retireIncome, provBrackets);
    const avgTaxRate = retireIncome > 0 ? (fedTax + provTax) / retireIncome : 0;
    const taxOnWithdrawal = reerValue * avgTaxRate;
    const reerNet = reerValue - taxOnWithdrawal;
    
    const celiData = [];
    const reerData = [];
    const yearLabels = [];
    
    for (let y = 0; y <= years; y++) {
      const celiVal = celiAnnual * (y === 0 ? 0 : ((Math.pow(1 + r, y) - 1) / r));
      celiData.push(celiVal);
      
      const reerVal = reerAnnual * (y === 0 ? 0 : ((Math.pow(1 + r, y) - 1) / r));
      reerData.push(reerVal);
      
      yearLabels.push(age + y);
    }
    
    return {
      celi: { monthly: celiMonthly, annual: celiAnnual, value: celiValue, net: celiNet, cost: budgetMonthly, refund: 0, tax: 0 },
      reer: { monthly: reerMonthly, annual: reerAnnual, value: reerValue, net: reerNet, refund: refundAnnual, cost: budgetMonthly, tax: taxOnWithdrawal },
      marginalRate,
      avgTaxRate,
      celiData,
      reerData,
      yearLabels,
    };
  }, [budgetMonthly, income, age, retireAge, province, returnRate, retireIncome]);

  const tabs = [
    { key: "inputs", label: "Paramètres" },
    { key: "comparison", label: "Comparaison" },
    { key: "info", label: "Guide" },
  ];

  return (
    <Layout
      title="Comparateur CELI vs REER 2025 — Quel compte d'épargne choisir?"
      description="Comparez le CELI et le REER selon votre situation fiscale pour maximiser votre épargne-retraite. Calculateur gratuit pour toutes les provinces canadiennes."
      canonical="https://monportefeuille.ca/celi-vs-reer"
    >
      <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", background: "#0D1117", minHeight: "100vh", padding: "2rem 1rem" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');`}</style>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>

          <div className="mb-6">
            <div className="text-[10px] text-[#484F58] uppercase tracking-widest mb-1">monportefeuille.ca</div>
            <h1 style={{ fontFamily: "'DM Mono', monospace" }} className="text-3xl font-medium text-[#E6EDF3]">CELI vs REER</h1>
            <p className="text-sm text-[#8B949E] mt-1">Comparez à coût égal — où investir votre budget?</p>
          </div>

          <div className="flex gap-1 mb-4 border-b border-[#21262D]">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-2.5 text-xs font-medium transition-all ${
                  tab === t.key ? "text-[#E6EDF3] border-b-2 border-[#F0A500]" : "text-[#8B949E] hover:text-[#E6EDF3]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "inputs" && (
            <div className="rounded-2xl p-5 space-y-4" style={{ background: "#161B22", border: "1px solid #21262D" }}>
              
              <div className="bg-[#F0A500]/10 border border-[#F0A500]/30 rounded-xl p-4">
                <div className="text-xs text-[#F0A500] font-medium mb-3 flex items-center gap-2">💰 Budget mensuel disponible pour investir</div>
                <Slider label="Combien pouvez-vous mettre de côté par mois?" value={budgetMonthly} min={100} max={2000} step={50} onChange={setBudgetMonthly} display={fmt(budgetMonthly)} color="#F0A500" />
                <div className="text-[10px] text-[#8B949E] mt-2 leading-relaxed">
                  C'est votre <strong>coût de poche réel</strong> — ce qui sort de votre compte bancaire chaque mois. Le calculateur ajustera automatiquement les cotisations CELI et REER pour respecter ce budget.
                </div>
              </div>

              <Slider label="Revenu annuel actuel" value={income} min={30000} max={200000} step={5000} onChange={setIncome} display={fmt(income)} color="#F0A500" />

              <div className="grid grid-cols-2 gap-4">
                <Slider label="Âge actuel" value={age} min={18} max={70} step={1} onChange={setAge} display={`${age} ans`} color="#F0A500" />
                <Slider label="Âge retraite prévu" value={retireAge} min={age} max={75} step={1} onChange={setRetireAge} display={`${retireAge} ans`} color="#F0A500" />
              </div>

              <div>
                <label className="text-xs text-[#8B949E] block mb-1.5">Province de résidence</label>
                <select value={province} onChange={(e) => setProvince(e.target.value)} className="w-full bg-[#0D1117] border border-[#21262D] rounded-lg px-3 py-2.5 text-[#E6EDF3] text-sm focus:outline-none focus:border-[#F0A500] transition-colors">
                  {PROVINCES.map((p) => (<option key={p.code} value={p.code}>{p.name}</option>))}
                </select>
              </div>

              <Slider label="Taux de rendement annuel estimé" value={returnRate} min={4} max={10} step={0.5} onChange={setReturnRate} display={`${returnRate.toFixed(1)}%`} color="#F0A500" />
              <Slider label="Revenu annuel prévu à la retraite" value={retireIncome} min={20000} max={100000} step={5000} onChange={setRetireIncome} display={fmt(retireIncome)} color="#F0A500" />

              <button onClick={() => { setTab("comparison"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="w-full bg-[#F0A500] text-[#0D1117] font-bold rounded-xl py-3.5 text-sm tracking-wide hover:bg-[#D4940A] transition-colors">
                Voir mes résultats ↑
              </button>
              <button onClick={() => { setBudgetMonthly(500); setIncome(75000); setAge(35); setRetireAge(65); setProvince("QC"); setReturnRate(6); setRetireIncome(45000); localStorage.removeItem("celivsreer:params"); }} className="w-full border border-[#21262D] text-[#8B949E] rounded-xl py-3 text-sm hover:border-[#484F58] hover:text-[#E6EDF3] transition-colors">
                Réinitialiser
              </button>
            </div>
          )}

          {tab === "comparison" && (
            <div className="space-y-6">
              
              <div className="bg-[#60A5FA]/10 border border-[#60A5FA]/30 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <h3 className="text-sm font-medium text-[#E6EDF3] mb-2">Comparaison à coût de poche égal</h3>
                    <p className="text-xs text-[#8B949E] leading-relaxed">
                      Vous avez <strong className="text-[#E6EDF3]">{fmt(budgetMonthly)}/mois</strong> à investir. Voici ce que ça donne dans chaque régime après avoir tenu compte du remboursement d'impôt REER :
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-2xl p-5" style={{ background: "#161B22", border: "1px solid #21262D" }}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full" style={{ background: "#F0A500" }} />
                    <h3 className="text-sm font-medium text-[#E6EDF3]">CELI</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-[10px] text-[#8B949E] uppercase tracking-wide mb-1">Aujourd'hui (par mois)</div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center"><span className="text-xs text-[#8B949E]">Budget disponible</span><span style={{ fontFamily: "'DM Mono', monospace" }} className="text-xs text-[#E6EDF3]">{fmt(budgetMonthly)}</span></div>
                        <div className="flex justify-between items-center"><span className="text-xs text-[#8B949E]">Cotisation CELI</span><span style={{ fontFamily: "'DM Mono', monospace" }} className="text-xs text-[#E6EDF3]">{fmt(results.celi.monthly)}</span></div>
                        <div className="flex justify-between items-center"><span className="text-xs text-[#8B949E]">Remboursement d'impôt</span><span style={{ fontFamily: "'DM Mono', monospace" }} className="text-xs text-[#484F58]">0$</span></div>
                        <div className="flex justify-between items-center pt-1.5 border-t border-[#21262D]"><span className="text-xs text-[#8B949E] font-medium">Coût net de poche</span><span style={{ fontFamily: "'DM Mono', monospace" }} className="text-xs text-[#E6EDF3] font-bold">{fmt(results.celi.cost)}</span></div>
                      </div>
                    </div>
                    <div className="border-t border-[#21262D] pt-3">
                      <div className="text-[10px] text-[#8B949E] uppercase tracking-wide mb-1">À la retraite ({retireAge} ans)</div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center"><span className="text-xs text-[#8B949E]">Valeur accumulée</span><span style={{ fontFamily: "'DM Mono', monospace" }} className="text-xs text-[#E6EDF3]">{fmt(results.celi.value)}</span></div>
                        <div className="flex justify-between items-center"><span className="text-xs text-[#8B949E]">Impôt au retrait</span><span style={{ fontFamily: "'DM Mono', monospace" }} className="text-xs text-[#484F58]">0$</span></div>
                        <div className="flex justify-between items-center pt-1.5 border-t border-[#21262D]"><span className="text-xs text-[#E6EDF3] font-medium">NET après impôt</span><span style={{ fontFamily: "'DM Mono', monospace" }} className="text-sm text-[#E6EDF3] font-bold">{fmt(results.celi.net)}</span></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl p-5" style={{ background: "#161B22", border: "1px solid #21262D" }}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full" style={{ background: "#60A5FA" }} />
                    <h3 className="text-sm font-medium text-[#E6EDF3]">REER</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-[10px] text-[#8B949E] uppercase tracking-wide mb-1">Aujourd'hui (par mois)</div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center"><span className="text-xs text-[#8B949E]">Budget disponible</span><span style={{ fontFamily: "'DM Mono', monospace" }} className="text-xs text-[#E6EDF3]">{fmt(budgetMonthly)}</span></div>
                        <div className="flex justify-between items-center"><span className="text-xs text-[#8B949E]">Cotisation REER</span><span style={{ fontFamily: "'DM Mono', monospace" }} className="text-xs text-[#60A5FA]">{fmt(results.reer.monthly)}</span></div>
                        <div className="flex justify-between items-center"><span className="text-xs text-[#8B949E]">Remboursement d'impôt</span><span style={{ fontFamily: "'DM Mono', monospace" }} className="text-xs text-[#3DDC97]">-{fmt(results.reer.monthly - budgetMonthly)}</span></div>
                        <div className="flex justify-between items-center pt-1.5 border-t border-[#21262D]"><span className="text-xs text-[#8B949E] font-medium">Coût net de poche</span><span style={{ fontFamily: "'DM Mono', monospace" }} className="text-xs text-[#E6EDF3] font-bold">{fmt(results.reer.cost)}</span></div>
                      </div>
                    </div>
                    <div className="border-t border-[#21262D] pt-3">
                      <div className="text-[10px] text-[#8B949E] uppercase tracking-wide mb-1">À la retraite ({retireAge} ans)</div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center"><span className="text-xs text-[#8B949E]">Valeur accumulée</span><span style={{ fontFamily: "'DM Mono', monospace" }} className="text-xs text-[#E6EDF3]">{fmt(results.reer.value)}</span></div>
                        <div className="flex justify-between items-center"><span className="text-xs text-[#8B949E]">Impôt au retrait</span><span style={{ fontFamily: "'DM Mono', monospace" }} className="text-xs text-red-400">-{fmt(results.reer.tax)}</span></div>
                        <div className="flex justify-between items-center pt-1.5 border-t border-[#21262D]"><span className="text-xs text-[#E6EDF3] font-medium">NET après impôt</span><span style={{ fontFamily: "'DM Mono', monospace" }} className="text-sm text-[#E6EDF3] font-bold">{fmt(results.reer.net)}</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {Math.abs(results.celi.net - results.reer.net) > 1000 && (
                <div className={`rounded-2xl p-5 border ${results.reer.net > results.celi.net ? "bg-[#60A5FA]/10 border-[#60A5FA]/30" : "bg-[#F0A500]/10 border-[#F0A500]/30"}`}>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💡</span>
                    <div>
                      <h3 className="text-sm font-medium text-[#E6EDF3] mb-2">
                        {results.reer.net > results.celi.net ? "Le REER performe mieux dans votre situation" : "Le CELI performe mieux dans votre situation"}
                      </h3>
                      <p className="text-xs text-[#8B949E] leading-relaxed">
                        Avec {fmt(budgetMonthly)}/mois de budget, le {results.reer.net > results.celi.net ? "REER" : "CELI"} vous donne <strong className="text-[#E6EDF3]">{fmt(Math.abs(results.reer.net - results.celi.net))}</strong> de plus à {retireAge} ans grâce à {results.reer.net > results.celi.net ? `l'arbitrage fiscal (vous cotisez à ${(results.marginalRate * 100).toFixed(1)}% aujourd'hui et retirez à ${(results.avgTaxRate * 100).toFixed(1)}% à la retraite)` : "l'absence d'impôt au retrait et la flexibilité accrue"}.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="rounded-2xl p-5" style={{ background: "#161B22", border: "1px solid #21262D" }}>
                <h3 className="text-sm font-medium text-[#E6EDF3] mb-4">Croissance dans le temps</h3>
                <DualChart celiData={results.celiData} reerData={results.reerData} years={results.yearLabels} />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <AdviceCard title="Le CELI peut être avantageux si:" color="#F0A500" points={["Votre revenu actuel et futur seront similaires", "Vous prévoyez avoir besoin de liquidités avant la retraite", "Vous êtes proche de la retraite (moins de 10 ans)", "Vous voulez maximiser votre flexibilité", "Vous avez déjà maximisé votre REER avec match employeur"]} />
                <AdviceCard title="Le REER peut être avantageux si:" color="#60A5FA" points={["Votre revenu actuel est élevé (>90k) et sera plus bas à la retraite", "Votre employeur offre une cotisation de contrepartie (argent gratuit!)", "Vous prévoyez acheter une première maison (RAP: 60k sans impôt)", "Vous prévoyez retourner aux études (REEP: 20k sans impôt)", "L'arbitrage fiscal joue en votre faveur"]} />
              </div>
            </div>
          )}

          {tab === "info" && (
            <div className="rounded-2xl p-5 space-y-4" style={{ background: "#161B22", border: "1px solid #21262D" }}>
              {[
                { icon: "💰", title: "C'est quoi le CELI?", text: "Le Compte d'Épargne Libre d'Impôt (CELI) est un compte canadien où vos placements croissent à l'abri de l'impôt. Vous cotisez avec de l'argent déjà imposé, mais tous les gains et retraits sont 100% libres d'impôt." },
                { icon: "🏦", title: "C'est quoi le REER?", text: "Le Régime Enregistré d'Épargne-Retraite (REER) est un compte qui permet de reporter l'impôt. Vos contributions réduisent votre revenu imposable aujourd'hui, et vous payez l'impôt seulement au retrait." },
                { icon: "🎯", title: "La stratégie optimale", text: "Pour la plupart des gens, la meilleure approche est de combiner REER et CELI: (1) Maximiser le match employeur REER d'abord, (2) Contribuer au CELI pour l'épargne à court terme, (3) Utiliser le reste des droits REER si votre revenu est élevé." },
              ].map(({ icon, title, text }) => (
                <div key={title} className="bg-[#0D1117] rounded-xl p-4 border border-[#21262D]">
                  <div className="flex items-center gap-2 mb-2"><span className="text-lg">{icon}</span><span className="text-sm font-medium text-[#E6EDF3]">{title}</span></div>
                  <p className="text-xs text-[#8B949E] leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 bg-[#161B22] border border-[#21262D] rounded-2xl p-8">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-[#E6EDF3] mb-2">Prêt à ouvrir un compte?</h3>
              <p className="text-sm text-[#8B949E] leading-relaxed max-w-md mx-auto">Wealthsimple offre à la fois des comptes CELI et REER avec:</p>
              <ul className="text-xs text-[#8B949E] mt-3 space-y-1">
                <li>• Gestion automatisée de portefeuille</li>
                <li>• 0$ de frais sur les premiers 100 000$</li>
                <li>• Interface 100% canadienne et en français</li>
              </ul>
            </div>
            <div className="grid md:grid-cols-2 gap-3 max-w-md mx-auto">
              <AffiliateLink href="https://www.wealthsimple.com/invite/EDVQ3W" partner="wealthsimple-celi" className="inline-block bg-[#F0A500] text-white font-medium rounded-xl px-6 py-3 text-sm text-center hover:opacity-90 transition-opacity no-underline">Ouvrir un CELI →</AffiliateLink>
              <AffiliateLink href="https://www.wealthsimple.com/invite/EDVQ3W" partner="wealthsimple-reer" className="inline-block bg-[#60A5FA] text-white font-medium rounded-xl px-6 py-3 text-sm text-center hover:opacity-90 transition-opacity no-underline">Ouvrir un REER →</AffiliateLink>
            </div>
            <p className="text-xs text-[#484F58] text-center mt-4 leading-relaxed">
              Note: Liens affiliés — monportefeuille.ca reçoit une commission si vous ouvrez un compte, sans frais pour vous.<br/>Voir notre <a href="/a-propos" className="text-[#60A5FA] hover:underline">politique de transparence</a>.
            </p>
          </div>

          <div className="mt-6 rounded-2xl p-5 bg-[#161B22] border border-[#21262D]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-[#E6EDF3] mb-1">Partagez cette simulation</h3>
                <p className="text-xs text-[#8B949E]">Envoyez le lien à un ami ou sauvegardez vos calculs</p>
              </div>
              <div className="hover:opacity-80 transition-opacity duration-200 cursor-pointer">
                <ShareButton params={{ budgetMonthly, income, age, retireAge, province, returnRate, retireIncome }} color="#F0A500" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}