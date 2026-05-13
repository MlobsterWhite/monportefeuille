import { useState, useMemo, useEffect, useRef } from "react";
import Layout from "../components/Layout";
import ToolSchema from "../components/ToolSchema";
import AffiliateLink from "../components/AffiliateLink";
import ShareButton from "../components/ShareButton";
import Slider from "../components/Slider";
import useSharedParams from "../hooks/useSharedParams";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => "$" + Math.round(n || 0).toLocaleString("fr-CA");
const pct = (n) => (n * 100).toFixed(1) + "%";

// ─── Chart ────────────────────────────────────────────────────────────────────
function AreaChart({ dataPoints, maxVal }) {
  if (!dataPoints.length) return null;
  const W = 500, H = 140, PX = 8, PY = 12;
  const iW = W - PX * 2, iH = H - PY * 2;
  const x = (i) => PX + (i / (dataPoints.length - 1)) * iW;
  const y = (v) => PY + ((maxVal - v) / (maxVal || 1)) * iH;

  const path = dataPoints.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(v)}`).join(" ");
  const area = path + ` L ${x(dataPoints.length - 1)} ${H} L ${PX} ${H} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 140 }}>
      <defs>
        <linearGradient id="celiGradSmall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F0A500" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#F0A500" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#celiGradSmall)" />
      <path d={path} fill="none" stroke="#F0A500" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// ─── Tooltip ─────────────────────────────────────────────────────────────────
function Tooltip({ text, children }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-block"
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-[#21262D] border border-[#30363D] text-[#C9D1D9] text-[10px] rounded-lg px-3 py-2 z-50 leading-relaxed shadow-xl">
          {text}
        </span>
      )}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CalculateurCELI() {
  const [currentBalance, setCurrentBalance] = useState(0);
  const [monthly, setMonthly] = useState(300);
  const [age, setAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(65);
  const [returnRate, setReturnRate] = useState(7);
  const [tab, setTab] = useState("inputs");
  const [celiRoom, setCeliRoom] = useState(0);
  const heroResultRef = useRef(null);

  useSharedParams({
    currentBalance: { setter: setCurrentBalance, parser: Number },
    monthly: { setter: setMonthly, parser: Number },
    age: { setter: setAge, parser: Number },
    retirementAge: { setter: setRetirementAge, parser: Number },
    returnRate: { setter: setReturnRate, parser: Number },
  });

  const yearsToRetirement = Math.max(1, retirementAge - age);
  const CELI_ANNUAL = 7000; // 2025
  const totalCeliRoom = celiRoom + CELI_ANNUAL * yearsToRetirement;

  // Persist params
  useEffect(() => {
    try {
      const saved = localStorage.getItem("celi:params");
      if (saved) {
        const p = JSON.parse(saved);
        if (p.currentBalance !== undefined) setCurrentBalance(p.currentBalance);
        if (p.monthly) setMonthly(p.monthly);
        if (p.age) setAge(p.age);
        if (p.retirementAge) setRetirementAge(p.retirementAge);
        if (p.returnRate) setReturnRate(p.returnRate);
        if (p.celiRoom !== undefined) setCeliRoom(p.celiRoom);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("celi:params", JSON.stringify({ currentBalance, monthly, age, retirementAge, returnRate, celiRoom }));
    } catch {}
  }, [currentBalance, monthly, age, retirementAge, returnRate, celiRoom]);

  const { dataPoints, finalBalance, totalContribs, growth } = useMemo(() => {
    const r = returnRate / 100 / 12;
    const dataPoints = [];
    let bal = currentBalance;

    for (let m = 0; m <= yearsToRetirement * 12; m++) {
      if (m % 12 === 0) dataPoints.push(bal);
      bal = bal * (1 + r) + monthly;
    }

    const finalBalance = dataPoints[dataPoints.length - 1];
    const totalContribs = currentBalance + monthly * 12 * yearsToRetirement;
    const growth = finalBalance - totalContribs;

    return { dataPoints, finalBalance, totalContribs, growth };
  }, [currentBalance, monthly, age, retirementAge, returnRate, yearsToRetirement]);

  // Export to net worth tracker
  useEffect(() => {
    localStorage.setItem("celi:projected", Math.round(finalBalance));
  }, [finalBalance]);

  const maxVal = Math.max(...dataPoints);
  const currentYear = new Date().getFullYear();

  const tabs = [
    { key: "inputs", label: "Paramètres" },
    { key: "results", label: "Résultats" },
    { key: "info", label: "C'est quoi le CELI?" },
  ];

  return (
    <Layout
      title="Calculateur CELI 2026 — Épargne libre d'impôt"
      description="Calculez vos droits de cotisation CELI, projetez votre épargne libre d'impôt et maximisez votre retraite. Gratuit pour tous les Canadiens."
      canonical="https://monportefeuille.ca/calculateur-celi"
    >
      <ToolSchema
        name="Calculateur CELI 2026"
        description="Calculez vos droits de cotisation CELI, projetez la croissance de votre épargne libre d'impôt et planifiez votre retraite au Canada."
        url="https://monportefeuille.ca/calculateur-celi"
      />
      <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", background: "#0D1117", minHeight: "100vh", padding: "2rem 1rem" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>

          {/* Header */}
          <div className="mb-6">
            <div className="text-[10px] text-[#484F58] uppercase tracking-widest mb-1">monportefeuille.ca</div>
            <h1 style={{ fontFamily: "'DM Mono', monospace" }} className="text-3xl font-medium text-[#E6EDF3]">
              Calculateur CELI
            </h1>
            <p className="text-sm text-[#8B949E] mt-1">Projetez la croissance de votre CELI jusqu'à la retraite</p>
          </div>

          {/* Hero */}
          <div className="rounded-2xl p-5 mb-4 relative overflow-hidden" style={{ background: "#161B22", border: "1px solid #21262D" }}>
            <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 80% 50%, rgba(61,220,151,0.07) 0%, transparent 65%)" }} />
            <div className="relative">
              {/* Ligne 1 — valeurs principales */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-[10px] text-[#8B949E] uppercase tracking-wide mb-1">Valeur à la retraite</div>
                  <div style={{ fontFamily: "'DM Mono', monospace" }} className="text-3xl text-[#F0A500] font-medium">{fmt(finalBalance)}</div>
                  <div className="text-[10px] text-[#484F58] mt-0.5">libre d'impôt à {retirementAge} ans</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#8B949E] uppercase tracking-wide mb-1">Croissance</div>
                  <div style={{ fontFamily: "'DM Mono', monospace" }} className="text-3xl text-[#F0A500] font-medium">{fmt(growth)}</div>
                  <div className="text-[10px] text-[#484F58] mt-0.5">intérêts composés</div>
                </div>
              </div>
              {/* Ligne 2 — valeurs secondaires */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#21262D]">
                <div>
                  <div className="text-[10px] text-[#8B949E] uppercase tracking-wide mb-1">Total contributions</div>
                  <div style={{ fontFamily: "'DM Mono', monospace" }} className="text-base text-[#E6EDF3] font-medium">{fmt(totalContribs)}</div>
                  <div className="text-[10px] text-[#484F58] mt-0.5">sur {yearsToRetirement} ans</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#8B949E] uppercase tracking-wide mb-1">Contribution mensuelle</div>
                  <div style={{ fontFamily: "'DM Mono', monospace" }} className="text-base text-[#E6EDF3] font-medium">{fmt(monthly)} / mois</div>
                  <div className="text-[10px] text-[#484F58] mt-0.5">à {returnRate}% de rendement</div>
                </div>
              </div>
            </div>
          </div>

          {/* Chart */}
          {(() => {
            const contribData = Array.from({ length: yearsToRetirement + 1 }, (_, i) => currentBalance + monthly * 12 * i);
            const roomData = Array.from({ length: yearsToRetirement + 1 }, (_, i) => (celiRoom > 0 ? celiRoom : 0) + CELI_ANNUAL * i);
            const overLimit = celiRoom > 0 && contribData.some((v, i) => v > roomData[i]);
            const W = 500, H = 180, PX = 8, PY = 12;
            const iW = W - PX * 2, iH = H - PY * 2;
            const allVals = [...dataPoints, ...contribData, ...(celiRoom > 0 ? roomData : [])];
            const maxV = Math.max(...allVals) || 1;
            const x = (i) => PX + (i / (dataPoints.length - 1)) * iW;
            const y = (v) => PY + ((maxV - v) / maxV) * iH;
            const growthPath = dataPoints.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(v)}`).join(" ");
            const growthArea = growthPath + ` L ${x(dataPoints.length - 1)} ${H} L ${PX} ${H} Z`;
            const contribPath = contribData.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(v)}`).join(" ");
            const roomPath = roomData.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(v)}`).join(" ");
            const lastGrowth = dataPoints[dataPoints.length - 1];
            const lastContrib = contribData[contribData.length - 1];
            const lastRoom = celiRoom > 0 ? roomData[roomData.length - 1] : null;
            return (
              <div className="rounded-2xl p-5 mb-4" style={{ background: "#161B22", border: "1px solid #21262D" }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs text-[#8B949E] uppercase tracking-widest">Projection sur {yearsToRetirement} ans</div>
                  <div className="flex items-center gap-3 text-[10px] text-[#8B949E]">
                    <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-[#F0A500] inline-block rounded" />Valeur</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-[#484F58] inline-block rounded" />Contributions</span>
                    {celiRoom > 0 && <span className="flex items-center gap-1"><span className="w-3 border-t border-dashed border-[#3DDC97] inline-block" style={{width:12}} />Plafond</span>}
                  </div>
                </div>
                {overLimit && (
                  <div className="mb-3 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-2.5 text-xs text-red-400">
                    ⚠️ Attention — vos contributions projetées dépassent votre plafond CELI disponible. Vous risquez une pénalité de 1%/mois sur l'excédent.
                  </div>
                )}
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 180 }}>
                  <defs>
                    <linearGradient id="celiGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F0A500" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#F0A500" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={growthArea} fill="url(#celiGrad)" />
                  <path d={growthPath} fill="none" stroke="#F0A500" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                  <path d={contribPath} fill="none" stroke="#484F58" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
                  {celiRoom > 0 && <path d={roomPath} fill="none" stroke="#3DDC97" strokeWidth="1.5" strokeDasharray="4 3" strokeLinejoin="round" strokeLinecap="round" />}
                  <text x={W - PX - 4} y={Math.max(PY + 8, y(lastGrowth) - 5)} textAnchor="end" fontSize="8" fill="#F0A500" fontFamily="monospace">{fmt(lastGrowth)}</text>
                  <text x={W - PX - 4} y={Math.min(H - 4, y(lastContrib) + 10)} textAnchor="end" fontSize="8" fill="#8B949E" fontFamily="monospace">{fmt(lastContrib)}</text>
                  {lastRoom && <text x={W - PX - 4} y={Math.max(PY + 8, y(lastRoom) - 5)} textAnchor="end" fontSize="8" fill="#3DDC97" fontFamily="monospace">{fmt(lastRoom)}</text>}
                </svg>
                <div className="flex justify-between mt-1 text-[10px] text-[#484F58]">
                  <span>{currentYear}</span>
                  <span>{currentYear + Math.floor(yearsToRetirement / 2)}</span>
                  <span>{currentYear + yearsToRetirement}</span>
                </div>
              </div>
            );
          })()}

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

              <div>
                <label className="text-xs text-[#8B949E] block mb-1.5">Solde actuel du CELI</label>
                <input
                  type="number" min="0" step="1000" value={currentBalance || ""}
                  onChange={(e) => setCurrentBalance(Number(e.target.value) || 0)}
                  placeholder="0 (nouveau CELI)"
                  className="w-full bg-[#0D1117] border border-[#21262D] rounded-lg px-3 py-2.5 text-[#E6EDF3] text-sm focus:outline-none focus:border-[#F0A500] transition-colors placeholder-[#484F58]"
                />
              </div>

              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <label className="text-xs text-[#8B949E]">Droits de cotisation disponibles aujourd'hui</label>
                  <Tooltip text="Consultez votre compte 'Mon dossier' sur canada.ca (ARC) pour connaître vos droits CELI exacts. Cherchez 'Droits de cotisation au CELI'.">
                    <span className="text-[10px] text-[#484F58] border border-[#484F58] rounded-full w-3.5 h-3.5 inline-flex items-center justify-center cursor-help">?</span>
                  </Tooltip>
                </div>
                <input
                  type="number" min="0" step="500" value={celiRoom || ""}
                  onChange={(e) => setCeliRoom(Number(e.target.value) || 0)}
                  placeholder="Ex: 45 000 (laisser vide si inconnu)"
                  className="w-full bg-[#0D1117] border border-[#21262D] rounded-lg px-3 py-2.5 text-[#E6EDF3] text-sm focus:outline-none focus:border-[#F0A500] transition-colors placeholder-[#484F58]"
                />
                {celiRoom > 0 && (
                  <div className="text-[10px] text-[#8B949E] mt-1.5 bg-[#0D1117] rounded-lg px-3 py-2 border border-[#21262D]">
                    Plafond total sur {yearsToRetirement} ans : <span className="text-[#F0A500]">{fmt(totalCeliRoom)}</span>
                    {" "}(droits actuels + {fmt(CELI_ANNUAL)}/an)
                  </div>
                )}
              </div>

              <Slider label="Contribution mensuelle" value={monthly} min={50} max={2500} step={50}
                onChange={setMonthly} display={fmt(monthly) + " / mois"} />

              <div className="grid grid-cols-2 gap-4">
                <Slider label="Âge actuel" value={age} min={18} max={retirementAge - 1} step={1}
                  onChange={setAge} display={age + " ans"} />
                <Slider label="Âge de retraite" value={retirementAge} min={age + 1} max={80} step={1}
                  onChange={setRetirementAge} display={retirementAge + " ans"} />
              </div>

              <Slider label="Rendement annuel estimé" value={returnRate} min={1} max={12} step={0.5}
                onChange={setReturnRate} display={returnRate + "%"} />

              {/* Voir résultats + Reset */}
              <button
                onClick={() => {
                  setTab("results");
                  // Attendre le rendu du nouvel onglet avant de scroller vers le résultat héros
                  setTimeout(() => {
                    heroResultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }, 50);
                }}
                className="w-full bg-[#F0A500] text-[#0D1117] font-bold rounded-xl py-3.5 text-sm tracking-wide hover:bg-[#D4940A] transition-colors"
              >
                Voir mes résultats ↑
              </button>
              <button
                onClick={() => {
                  setCurrentBalance(0); setCeliRoom(0); setMonthly(300);
                  setAge(30); setRetirementAge(65); setReturnRate(7);
                  localStorage.removeItem("celi:params");
                }}
                className="w-full border border-[#21262D] text-[#8B949E] rounded-xl py-3 text-sm hover:border-[#484F58] hover:text-[#E6EDF3] transition-colors"
              >
                Réinitialiser
              </button>
              </div>
            )}

          {/* Results Tab */}
          {tab === "results" && (
            <div className="space-y-3" ref={heroResultRef}>
              <div className="rounded-2xl p-5" style={{ background: "#161B22", border: "1px solid #21262D" }}>
                <div className="text-xs text-[#8B949E] uppercase tracking-widest mb-4">Projection détaillée</div>
                <div className="space-y-3">
                  {[
                    { label: "Solde de départ", val: fmt(currentBalance), color: "#E6EDF3" },
                    { label: "Contribution mensuelle", val: fmt(monthly) + " / mois", color: "#E6EDF3" },
                    { label: "Durée", val: yearsToRetirement + " ans", color: "#E6EDF3" },
                    { label: "Rendement annuel estimé", val: returnRate + "%", color: "#E6EDF3" },
                    { label: "Total contributions", val: fmt(totalContribs), color: "#E6EDF3" },
                    { label: "Croissance (intérêts composés)", val: fmt(growth), color: "#F0A500" },
                    { label: "Valeur à la retraite", val: fmt(finalBalance), color: "#F0A500" },
                    { label: "Impôt sur les retraits", val: "0$ — 100% libre d'impôt", color: "#F0A500" },
                  ].map(({ label, val, color }) => (
                    <div key={label} className="flex justify-between items-center py-2 border-b border-[#21262D] last:border-0">
                      <span className="text-xs text-[#8B949E]">{label}</span>
                      <span style={{ fontFamily: "'DM Mono', monospace", color }} className="text-sm font-medium">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl p-5" style={{ background: "#161B22", border: "1px solid #21262D" }}>
                <div className="text-xs text-[#8B949E] uppercase tracking-widest mb-3">Jalons de croissance</div>
                <div className="space-y-2">
                  {[5, 10, 15, 20, 25, 30].filter(y => y <= yearsToRetirement).map(y => {
                    const r = returnRate / 100 / 12;
                    let bal = currentBalance;
                    for (let m = 0; m < y * 12; m++) bal = bal * (1 + r) + monthly;
                    return (
                      <div key={y} className="flex justify-between items-center py-1.5 border-b border-[#21262D] last:border-0">
                        <span className="text-xs text-[#8B949E]">Dans {y} ans ({currentYear + y})</span>
                        <span style={{ fontFamily: "'DM Mono', monospace" }} className="text-sm text-[#E6EDF3]">{fmt(bal)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Info Tab */}
          {tab === "info" && (
            <div className="rounded-2xl p-5 space-y-4" style={{ background: "#161B22", border: "1px solid #21262D" }}>
              {[
                { icon: "💡", title: "C'est quoi un CELI?", text: "Le Compte d'Épargne Libre d'Impôt (CELI) est un compte enregistré canadien où votre argent croît à l'abri de l'impôt. Contrairement au REER, vous ne déduisez pas vos contributions, mais tous les retraits sont 100% libres d'impôt." },
                { icon: "📅", title: "Droits de cotisation", text: "Chaque année, un nouveau montant s'ajoute à vos droits disponibles (6 500$ en 2023, 7 000$ en 2024). Les droits inutilisés s'accumulent depuis 2009 — si vous n'avez jamais cotisé, vous pouvez avoir plus de 95 000$ disponibles." },
                { icon: "🔄", title: "Flexibilité des retraits", text: "Vous pouvez retirer n'importe quel montant en tout temps, sans pénalité et sans impôt. Les droits retirés sont récupérés le 1er janvier de l'année suivante — une flexibilité unique par rapport au REER." },
                { icon: "📊", title: "CELI vs REER", text: "Le CELI est idéal si votre taux d'imposition est bas maintenant (revenus modestes, retraite proche, jeune adulte). Le REER est plus avantageux si vous êtes dans une tranche d'imposition élevée aujourd'hui et prévoyez être dans une tranche plus basse à la retraite." },
                { icon: "⚠️", title: "Important", text: "Ce calculateur est un outil éducatif. Les droits de cotisation exacts dépendent de votre historique personnel. Consultez votre compte CRA Mon dossier ou un conseiller financier pour connaître vos droits précis." },
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
            <div className="text-3xl mb-3">📈</div>
            <h3 className="text-xl font-bold text-[#E6EDF3] mb-2">Ouvrez votre CELI chez Wealthsimple</h3>
            <p className="text-sm text-[#8B949E] mb-6 leading-relaxed max-w-sm mx-auto">
              Aucuns frais, aucune commission sur les FNB. Recevez un bonus à l'ouverture de votre compte.
            </p>
            <AffiliateLink
              href="https://www.wealthsimple.com/invite/EDVQ3W"
              partner="wealthsimple-celi"
              className="inline-block bg-[#F0A500] text-[#0D1117] font-bold rounded-xl px-8 py-3.5 text-sm tracking-wide hover:bg-[#D4940A] transition-colors no-underline"
            >
              Ouvrir un CELI chez Wealthsimple →
            </AffiliateLink>
            <p className="text-xs text-[#484F58] mt-4">✓ Gratuit · ✓ Aucune commission · ✓ Protégé FCPE · Lien affilié</p>
          </div>

          <div className="mt-8 rounded-2xl p-5 bg-[#161B22] border border-[#21262D]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-[#E6EDF3] mb-1">Partagez cette simulation</h3>
                <p className="text-xs text-[#8B949E]">Envoyez le lien à un ami ou sauvegardez vos calculs</p>
              </div>
              <div className="hover:opacity-80 transition-opacity duration-200 cursor-pointer">
                <ShareButton params={{ currentBalance, monthly, age, retirementAge, returnRate }} color="#F0A500" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}