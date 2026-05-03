import { useState, useMemo, useEffect } from "react";
import Layout from "../components/Layout";
import AffiliateLink from "../components/AffiliateLink";

const ACCENT = "#C084FC";

// ─── Tax Data 2025 ────────────────────────────────────────────────────────────
const FEDERAL_BRACKETS = [
  { min: 0, max: 57375, rate: 0.15 },
  { min: 57375, max: 114750, rate: 0.205 },
  { min: 114750, max: 158519, rate: 0.26 },
  { min: 158519, max: 220000, rate: 0.29 },
  { min: 220000, max: Infinity, rate: 0.33 },
];

const PROVINCIAL_BRACKETS = {
  QC: [{ min: 0, max: 51780, rate: 0.14 }, { min: 51780, max: 103545, rate: 0.19 }, { min: 103545, max: 126000, rate: 0.24 }, { min: 126000, max: Infinity, rate: 0.2575 }],
  ON: [{ min: 0, max: 51446, rate: 0.0505 }, { min: 51446, max: 102894, rate: 0.0915 }, { min: 102894, max: 150000, rate: 0.1116 }, { min: 150000, max: 220000, rate: 0.1216 }, { min: 220000, max: Infinity, rate: 0.1316 }],
  BC: [{ min: 0, max: 45654, rate: 0.0506 }, { min: 45654, max: 91310, rate: 0.077 }, { min: 91310, max: 104835, rate: 0.105 }, { min: 104835, max: 127299, rate: 0.1229 }, { min: 127299, max: Infinity, rate: 0.147 }],
  AB: [{ min: 0, max: 148269, rate: 0.10 }, { min: 148269, max: 177922, rate: 0.12 }, { min: 177922, max: 237230, rate: 0.13 }, { min: 237230, max: Infinity, rate: 0.14 }],
  SK: [{ min: 0, max: 49720, rate: 0.105 }, { min: 49720, max: 142058, rate: 0.125 }, { min: 142058, max: Infinity, rate: 0.145 }],
  MB: [{ min: 0, max: 47000, rate: 0.108 }, { min: 47000, max: 100000, rate: 0.1275 }, { min: 100000, max: Infinity, rate: 0.174 }],
  NB: [{ min: 0, max: 47715, rate: 0.094 }, { min: 47715, max: 95431, rate: 0.14 }, { min: 95431, max: 176756, rate: 0.16 }, { min: 176756, max: Infinity, rate: 0.195 }],
  NS: [{ min: 0, max: 29590, rate: 0.0879 }, { min: 29590, max: 59180, rate: 0.1495 }, { min: 59180, max: 93000, rate: 0.1667 }, { min: 93000, max: Infinity, rate: 0.175 }],
  PE: [{ min: 0, max: 32656, rate: 0.096 }, { min: 32656, max: 64313, rate: 0.1337 }, { min: 64313, max: 105000, rate: 0.167 }, { min: 105000, max: Infinity, rate: 0.18 }],
  NL: [{ min: 0, max: 43198, rate: 0.087 }, { min: 43198, max: 86395, rate: 0.145 }, { min: 86395, max: 154244, rate: 0.158 }, { min: 154244, max: Infinity, rate: 0.178 }],
  YT: [{ min: 0, max: 57375, rate: 0.064 }, { min: 57375, max: 114750, rate: 0.09 }, { min: 114750, max: Infinity, rate: 0.109 }],
  NT: [{ min: 0, max: 50597, rate: 0.059 }, { min: 50597, max: 101198, rate: 0.086 }, { min: 101198, max: Infinity, rate: 0.122 }],
  NU: [{ min: 0, max: 53268, rate: 0.04 }, { min: 53268, max: 106537, rate: 0.07 }, { min: 106537, max: Infinity, rate: 0.09 }],
};

const BASIC_CREDITS = {
  QC: { fed: 15705 * 0.15, prov: 17183 * 0.14 },
  ON: { fed: 15705 * 0.15, prov: 11865 * 0.0505 },
  BC: { fed: 15705 * 0.15, prov: 11981 * 0.0506 },
  AB: { fed: 15705 * 0.15, prov: 21003 * 0.10 },
  SK: { fed: 15705 * 0.15, prov: 17661 * 0.105 },
  MB: { fed: 15705 * 0.15, prov: 15780 * 0.108 },
  NB: { fed: 15705 * 0.15, prov: 12458 * 0.094 },
  NS: { fed: 15705 * 0.15, prov: 8481 * 0.0879 },
  PE: { fed: 15705 * 0.15, prov: 12000 * 0.096 },
  NL: { fed: 15705 * 0.15, prov: 10818 * 0.087 },
  YT: { fed: 15705 * 0.15, prov: 15705 * 0.064 },
  NT: { fed: 15705 * 0.15, prov: 16593 * 0.059 },
  NU: { fed: 15705 * 0.15, prov: 17925 * 0.04 },
};

const PROVINCES = [
  { code: "QC", name: "Québec" }, { code: "ON", name: "Ontario" },
  { code: "BC", name: "Colombie-Britannique" }, { code: "AB", name: "Alberta" },
  { code: "SK", name: "Saskatchewan" }, { code: "MB", name: "Manitoba" },
  { code: "NB", name: "Nouveau-Brunswick" }, { code: "NS", name: "Nouvelle-Écosse" },
  { code: "PE", name: "Île-du-Prince-Édouard" }, { code: "NL", name: "Terre-Neuve-et-Labrador" },
  { code: "YT", name: "Yukon" }, { code: "NT", name: "Territoires du Nord-Ouest" },
  { code: "NU", name: "Nunavut" },
];

// ─── Social Contributions 2025 ────────────────────────────────────────────────
function calcSocial(revenu, province, situation) {
  if (situation === "independant") {
    // Travailleurs autonomes paient les deux parts
    return { total: 0, items: [{ label: "Travailleur autonome", val: 0, note: "Déduisez vos dépenses d'entreprise" }] };
  }

  const isQC = province === "QC";
  const items = [];

  if (isQC) {
    // RRQ (remplace RPC au Québec)
    const rrqBase = Math.min(Math.max(0, revenu - 3500), 68500 - 3500);
    const rrq = Math.round(rrqBase * 0.064);
    const rrq2 = Math.round(Math.min(Math.max(0, revenu - 68500), 73200 - 68500) * 0.04);
    items.push({ label: "RRQ (retraite Québec)", val: rrq + rrq2 });

    // RQAP
    const rqap = Math.round(Math.min(revenu, 94000) * 0.00494);
    items.push({ label: "RQAP (assurance parentale)", val: rqap });

    // AE taux réduit QC
    const ae = Math.round(Math.min(revenu, 63200) * 0.0131);
    items.push({ label: "Assurance-emploi (taux QC)", val: ae });
  } else {
    // RPC
    const rpcBase = Math.min(Math.max(0, revenu - 3500), 68500 - 3500);
    const rpc = Math.round(rpcBase * 0.0595);
    const rpc2 = Math.round(Math.min(Math.max(0, revenu - 68500), 73200 - 68500) * 0.04);
    items.push({ label: "RPC (retraite Canada)", val: rpc + rpc2 });

    // AE
    const ae = Math.round(Math.min(revenu, 63200) * 0.0166);
    items.push({ label: "Assurance-emploi", val: ae });
  }

  const total = items.reduce((s, i) => s + i.val, 0);
  return { total, items };
}

// ─── Tax Calculation ──────────────────────────────────────────────────────────
function calcTax(income, brackets) {
  let tax = 0;
  for (const b of brackets) {
    if (income <= b.min) break;
    tax += (Math.min(income, b.max) - b.min) * b.rate;
  }
  return tax;
}

function calcNetTax(income, province) {
  const provBrackets = PROVINCIAL_BRACKETS[province] || PROVINCIAL_BRACKETS.ON;
  const credits = BASIC_CREDITS[province] || BASIC_CREDITS.ON;
  const fed = Math.max(0, calcTax(income, FEDERAL_BRACKETS) - credits.fed);
  const prov = Math.max(0, calcTax(income, provBrackets) - credits.prov);
  return { fed, prov, total: fed + prov };
}

function getMarginal(income, province) {
  const provBrackets = PROVINCIAL_BRACKETS[province] || PROVINCIAL_BRACKETS.ON;
  const fedRate = FEDERAL_BRACKETS.findLast(b => income > b.min)?.rate || 0.15;
  const provRate = provBrackets.findLast(b => income > b.min)?.rate || provBrackets[0].rate;
  return fedRate + provRate;
}

const fmt = (n) => "$" + Math.abs(Math.round(n || 0)).toLocaleString("fr-CA");
const pct = (n) => (n * 100).toFixed(1) + "%";

// ─── Slider ───────────────────────────────────────────────────────────────────
function Slider({ label, value, min, max, step, onChange, display }) {
  const [editing, setEditing] = useState(false);
  const [raw, setRaw] = useState("");
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <label className="text-xs text-[#8B949E]">{label}</label>
        {editing ? (
          <input type="number" autoFocus value={raw} min={min} max={max}
            onChange={(e) => setRaw(e.target.value)}
            onBlur={() => { const v = Math.min(max, Math.max(min, Number(raw) || value)); onChange(v); setEditing(false); }}
            onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); if (e.key === "Escape") setEditing(false); }}
            className="w-28 bg-[#0D1117] border rounded px-2 py-0.5 text-xs text-[#E6EDF3] text-right focus:outline-none"
            style={{ borderColor: ACCENT }} />
        ) : (
          <span onClick={() => { setRaw(value); setEditing(true); }}
            className="text-xs font-medium text-[#E6EDF3] tabular-nums cursor-pointer border-b border-dashed border-[#484F58]"
            onMouseEnter={e => e.target.style.color = ACCENT}
            onMouseLeave={e => e.target.style.color = "#E6EDF3"}>
            {display}
          </span>
        )}
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full cursor-pointer"
        style={{ accentColor: ACCENT }} />
      <div className="flex justify-between text-[10px] text-[#484F58] mt-1">
        <span>{typeof min === "number" && min >= 1000 ? fmt(min) : min}</span>
        <span>{typeof max === "number" && max >= 1000 ? fmt(max) : max}</span>
      </div>
    </div>
  );
}

// ─── Number Input ─────────────────────────────────────────────────────────────
function NumInput({ label, value, onChange, placeholder, max, note, highlight }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs text-[#8B949E]">{label}</label>
        {max && <span className="text-[10px] text-[#484F58]">Max: {fmt(max)}</span>}
      </div>
      <input type="number" min="0" max={max} step="100"
        value={value || ""}
        onChange={(e) => onChange(Math.min(Number(e.target.value) || 0, max || Infinity))}
        placeholder={placeholder || "0"}
        className="w-full bg-[#0D1117] border rounded-lg px-3 py-2.5 text-[#E6EDF3] text-sm focus:outline-none placeholder-[#484F58] transition-colors"
        style={{ borderColor: value > 0 ? "#3DDC97" : "#21262D" }} />
      {note && value > 0 && <div className="text-[10px] text-[#3DDC97] mt-1">{note}</div>}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const DEFAULT = { revenu: 75000, province: "QC", situation: "employe", reer: 0, celiapp: 0, syndicat: 0, garde: 0 };

export default function EstimateurImpot() {
  const [revenu, setRevenu] = useState(DEFAULT.revenu);
  const [province, setProvince] = useState(DEFAULT.province);
  const [situation, setSituation] = useState(DEFAULT.situation);
  const [reer, setReer] = useState(DEFAULT.reer);
  const [celiapp, setCeliapp] = useState(DEFAULT.celiapp);
  const [syndicat, setSyndicat] = useState(DEFAULT.syndicat);
  const [garde, setGarde] = useState(DEFAULT.garde);
  const [tab, setTab] = useState("inputs");

  useEffect(() => {
    try {
      const s = localStorage.getItem("impot:params");
      if (s) {
        const p = JSON.parse(s);
        if (p.revenu) setRevenu(p.revenu);
        if (p.province) setProvince(p.province);
        if (p.situation) setSituation(p.situation);
        if (p.reer !== undefined) setReer(p.reer);
        if (p.celiapp !== undefined) setCeliapp(p.celiapp);
        if (p.syndicat !== undefined) setSyndicat(p.syndicat);
        if (p.garde !== undefined) setGarde(p.garde);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem("impot:params", JSON.stringify({ revenu, province, situation, reer, celiapp, syndicat, garde })); } catch {}
  }, [revenu, province, situation, reer, celiapp, syndicat, garde]);

  const result = useMemo(() => {
    // Déductions totales
    const totalDeductions = reer + celiapp + syndicat + garde;
    const revenuImposable = Math.max(0, revenu - totalDeductions);

    // Impôt sans déductions
    const { fed: fedBrut, prov: provBrut, total: totalBrut } = calcNetTax(revenu, province);

    // Impôt avec déductions
    const { fed: fedNet, prov: provNet, total: totalNet } = calcNetTax(revenuImposable, province);

    // Économie totale
    const economieTotale = totalBrut - totalNet;

    // Cotisations sociales
    const social = calcSocial(revenu, province, situation);

    // Taux
    const marginal = getMarginal(revenu, province);
    const tauxEffectif = revenu > 0 ? totalNet / revenu : 0;

    // Take-home pay
    const takeHomeAnnuel = revenu - totalNet - social.total;
    const takeHomeMensuel = takeHomeAnnuel / 12;
    const takeHomeSansDeductions = revenu - totalBrut - social.total;

    return {
      totalBrut: Math.round(totalBrut),
      totalNet: Math.round(totalNet),
      fedBrut: Math.round(fedBrut), provBrut: Math.round(provBrut),
      fedNet: Math.round(fedNet), provNet: Math.round(provNet),
      economieTotale: Math.round(economieTotale),
      social,
      marginal,
      tauxEffectif,
      takeHomeAnnuel: Math.round(takeHomeAnnuel),
      takeHomeMensuel: Math.round(takeHomeMensuel),
      takeHomeSansDeductions: Math.round(takeHomeSansDeductions),
      gainMensuel: Math.round((takeHomeAnnuel - takeHomeSansDeductions) / 12),
      totalDeductions: Math.round(totalDeductions),
      revenuImposable: Math.round(revenuImposable),
    };
  }, [revenu, province, situation, reer, celiapp, syndicat, garde]);

  const maxReer = Math.min(Math.round(revenu * 0.18), 31560);
  const totalDeductions = reer + celiapp + syndicat + garde;

  const tabs = [
    { key: "inputs", label: "Paramètres" },
    { key: "results", label: "Résultats" },
    { key: "info", label: "Optimiser" },
  ];

  return (
    <Layout
      title="Estimateur d'impôt 2025 — Québec et Canada"
      description="Estimez votre impôt fédéral et provincial 2025, calculez vos déductions REER et optimisez votre déclaration. Gratuit pour les résidents du Québec et du Canada."
      canonical="https://monportefeuille.ca/estimateur-impot"
    >
      <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", background: "#0D1117", minHeight: "100vh", padding: "2rem 1rem" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');`}</style>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>

          <div className="mb-6">
            <div className="text-[10px] text-[#484F58] uppercase tracking-widest mb-1">monportefeuille.ca</div>
            <h1 style={{ fontFamily: "'DM Mono', monospace" }} className="text-3xl font-medium text-[#E6EDF3]">Estimateur d'impôt</h1>
            <p className="text-sm text-[#8B949E] mt-1">Votre vrai revenu net et l'économie de vos déductions</p>
          </div>

          {/* Hero */}
          <div className="rounded-2xl p-5 mb-4 relative overflow-hidden" style={{ background: "#161B22", border: "1px solid #21262D" }}>
            <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 80% 50%, ${ACCENT}10 0%, transparent 65%)` }} />
            <div className="relative">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-[10px] text-[#8B949E] uppercase tracking-wide mb-1">Revenu net mensuel</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", color: ACCENT }} className="text-3xl font-medium">{fmt(result.takeHomeMensuel)}</div>
                  <div className="text-[10px] text-[#484F58] mt-0.5">après impôt + cotisations sociales</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#8B949E] uppercase tracking-wide mb-1">Revenu net annuel</div>
                  <div style={{ fontFamily: "'DM Mono', monospace" }} className="text-3xl font-medium text-[#E6EDF3]">{fmt(result.takeHomeAnnuel)}</div>
                  <div className="text-[10px] text-[#484F58] mt-0.5">take-home pay réel</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#21262D]">
                <div>
                  <div className="text-[10px] text-[#8B949E] uppercase tracking-wide mb-1">Taux marginal</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", color: ACCENT }} className="text-base font-medium">{pct(result.marginal)}</div>
                  <div className="text-[10px] text-[#484F58] mt-0.5">fédéral + {province}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#8B949E] uppercase tracking-wide mb-1">Taux effectif</div>
                  <div style={{ fontFamily: "'DM Mono', monospace" }} className="text-base font-medium text-[#E6EDF3]">{pct(result.tauxEffectif)}</div>
                  <div className="text-[10px] text-[#484F58] mt-0.5">taux moyen réel</div>
                </div>
              </div>
              {totalDeductions > 0 && (
                <div className="mt-4 rounded-xl px-4 py-3 flex items-center justify-between" style={{ background: "#3DDC9710", border: "1px solid #3DDC9725" }}>
                  <div>
                    <div className="text-xs text-[#3DDC97] font-medium">✦ Économie grâce à vos déductions ({fmt(totalDeductions)})</div>
                    <div className="text-[10px] text-[#8B949E] mt-0.5">+{fmt(result.gainMensuel)}/mois de revenu net supplémentaire</div>
                  </div>
                  <div style={{ fontFamily: "'DM Mono', monospace" }} className="text-xl text-[#3DDC97] font-medium">{fmt(result.economieTotale)}</div>
                </div>
              )}
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

          {/* Inputs */}
          {tab === "inputs" && (
            <div className="space-y-3">
              {/* Profil */}
              <div className="rounded-2xl p-5 space-y-5" style={{ background: "#161B22", border: "1px solid #21262D" }}>
                <div className="text-xs text-[#8B949E] uppercase tracking-widest">Votre profil</div>

                <div>
                  <label className="text-xs text-[#8B949E] block mb-1.5">Province / Territoire</label>
                  <select value={province} onChange={(e) => setProvince(e.target.value)}
                    className="w-full bg-[#0D1117] border border-[#21262D] rounded-lg px-3 py-2.5 text-[#E6EDF3] text-sm focus:outline-none">
                    {PROVINCES.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-[#8B949E] block mb-2">Type de revenu</label>
                  <div className="flex gap-2">
                    {[{ key: "employe", label: "💼 Salarié" }, { key: "independant", label: "🔧 Travailleur autonome" }].map(({ key, label }) => (
                      <button key={key} onClick={() => setSituation(key)}
                        className="flex-1 py-2.5 rounded-lg text-xs font-medium transition-colors"
                        style={{ background: situation === key ? ACCENT : "#21262D", color: situation === key ? "#0D1117" : "#8B949E" }}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <Slider label="Revenu annuel brut" value={revenu} min={15000} max={300000} step={1000} onChange={setRevenu} display={fmt(revenu)} />
              </div>

              {/* Déductions */}
              <div className="rounded-2xl p-5 space-y-4" style={{ background: "#161B22", border: "1px solid #21262D" }}>
                <div className="text-xs text-[#8B949E] uppercase tracking-widest">Déductions fiscales</div>
                <p className="text-[10px] text-[#484F58]">Ces montants réduisent votre revenu imposable — laissez à 0 si non applicable.</p>

                <NumInput label="Cotisation REER" value={reer} onChange={setReer}
                  placeholder="Ex: 5 000" max={maxReer}
                  note={`Économie estimée: ${fmt(reer * result.marginal)}`} />

                <NumInput label="CELIAPP (premiers acheteurs)" value={celiapp} onChange={setCeliapp}
                  placeholder="Ex: 8 000" max={8000}
                  note={`Économie estimée: ${fmt(celiapp * result.marginal)}`} />

                <NumInput label="Cotisations syndicales / professionnelles" value={syndicat} onChange={setSyndicat}
                  placeholder="Ex: 800"
                  note={`Économie estimée: ${fmt(syndicat * result.marginal)}`} />

                <NumInput label="Frais de garde d'enfants" value={garde} onChange={setGarde}
                  placeholder="Ex: 6 000" max={11000}
                  note={`Économie estimée: ${fmt(garde * result.marginal)}`} />

                {totalDeductions > 0 && (
                  <div className="bg-[#0D1117] rounded-xl p-3 border border-[#21262D]">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#8B949E]">Total déductions</span>
                      <span style={{ fontFamily: "'DM Mono', monospace" }} className="text-[#3DDC97]">{fmt(totalDeductions)}</span>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-[#8B949E]">Économie d'impôt totale</span>
                      <span style={{ fontFamily: "'DM Mono', monospace" }} className="text-[#3DDC97] font-medium">{fmt(result.economieTotale)}</span>
                    </div>
                  </div>
                )}
              </div>

              <button onClick={() => { setTab("results"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="w-full font-bold rounded-xl py-3.5 text-sm tracking-wide transition-colors text-[#0D1117]"
                style={{ background: ACCENT }}>
                Voir mes résultats ↑
              </button>
              <button onClick={() => { setRevenu(DEFAULT.revenu); setProvince(DEFAULT.province); setSituation(DEFAULT.situation); setReer(0); setCeliapp(0); setSyndicat(0); setGarde(0); localStorage.removeItem("impot:params"); }}
                className="w-full border border-[#21262D] text-[#8B949E] rounded-xl py-3 text-sm hover:border-[#484F58] hover:text-[#E6EDF3] transition-colors">
                Réinitialiser
              </button>
            </div>
          )}

          {/* Results */}
          {tab === "results" && (
            <div className="space-y-3">
              {/* Revenu complet */}
              <div className="rounded-2xl p-5" style={{ background: "#161B22", border: "1px solid #21262D" }}>
                <div className="text-xs text-[#8B949E] uppercase tracking-widest mb-4">Résumé complet</div>
                <div className="space-y-3">
                  {[
                    { label: "Revenu brut", val: fmt(revenu), color: "#E6EDF3" },
                    ...(totalDeductions > 0 ? [{ label: "Total déductions", val: "−" + fmt(totalDeductions), color: "#3DDC97" }] : []),
                    ...(totalDeductions > 0 ? [{ label: "Revenu imposable", val: fmt(result.revenuImposable), color: "#E6EDF3" }] : []),
                    { label: `Impôt fédéral`, val: fmt(result.fedNet), color: "#E6EDF3" },
                    { label: `Impôt provincial (${province})`, val: fmt(result.provNet), color: "#E6EDF3" },
                    { label: "Total impôt", val: fmt(result.totalNet), color: ACCENT },
                    ...result.social.items.map(i => ({ label: i.label, val: fmt(i.val), color: "#8B949E" })),
                    { label: "Total cotisations sociales", val: fmt(result.social.total), color: "#8B949E" },
                    { label: "Revenu net annuel (take-home)", val: fmt(result.takeHomeAnnuel), color: ACCENT },
                    { label: "Revenu net mensuel", val: fmt(result.takeHomeMensuel) + " / mois", color: ACCENT },
                  ].map(({ label, val, color }) => (
                    <div key={label} className="flex justify-between items-center py-2 border-b border-[#21262D] last:border-0">
                      <span className="text-xs text-[#8B949E]">{label}</span>
                      <span style={{ fontFamily: "'DM Mono', monospace", color }} className="text-sm font-medium">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Impact déductions */}
              {totalDeductions > 0 && (
                <div className="rounded-2xl p-5" style={{ background: "#161B22", border: "1px solid #21262D" }}>
                  <div className="text-xs text-[#8B949E] uppercase tracking-widest mb-4">Impact de vos déductions</div>
                  <div className="space-y-3">
                    {[
                      { label: "Impôt sans déductions", val: fmt(result.totalBrut), color: "#E6EDF3" },
                      { label: "Impôt avec déductions", val: fmt(result.totalNet), color: "#3DDC97" },
                      { label: "Économie totale", val: fmt(result.economieTotale), color: "#3DDC97" },
                      { label: "Gain mensuel net", val: "+" + fmt(result.gainMensuel) + " / mois", color: "#3DDC97" },
                      ...(reer > 0 ? [{ label: `  REER ${fmt(reer)}`, val: fmt(reer * result.marginal), color: "#3DDC97" }] : []),
                      ...(celiapp > 0 ? [{ label: `  CELIAPP ${fmt(celiapp)}`, val: fmt(celiapp * result.marginal), color: "#3DDC97" }] : []),
                      ...(syndicat > 0 ? [{ label: `  Syndicat/prof. ${fmt(syndicat)}`, val: fmt(syndicat * result.marginal), color: "#3DDC97" }] : []),
                      ...(garde > 0 ? [{ label: `  Frais de garde ${fmt(garde)}`, val: fmt(garde * result.marginal), color: "#3DDC97" }] : []),
                    ].map(({ label, val, color }) => (
                      <div key={label} className="flex justify-between items-center py-2 border-b border-[#21262D] last:border-0">
                        <span className="text-xs text-[#8B949E]">{label}</span>
                        <span style={{ fontFamily: "'DM Mono', monospace", color }} className="text-sm font-medium">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Comparaison provinciale */}
              <div className="rounded-2xl p-5" style={{ background: "#161B22", border: "1px solid #21262D" }}>
                <div className="text-xs text-[#8B949E] uppercase tracking-widest mb-4">Take-home pay selon la province</div>
                {["QC", "ON", "BC", "AB", "SK", "MB"].map(p => {
                  const { total } = calcNetTax(revenu - totalDeductions, p);
                  const social = calcSocial(revenu, p, situation);
                  const takeHome = revenu - total - social.total;
                  const isSelected = p === province;
                  return (
                    <div key={p} className={`flex justify-between items-center py-2 border-b border-[#21262D] last:border-0 ${isSelected ? "" : "opacity-55"}`}>
                      <span className="text-xs text-[#8B949E]">{PROVINCES.find(pr => pr.code === p)?.name}</span>
                      <div className="text-right">
                        <div style={{ fontFamily: "'DM Mono', monospace", color: isSelected ? ACCENT : "#E6EDF3" }} className="text-sm font-medium">{fmt(takeHome / 12)}/mois</div>
                        <div className="text-[10px] text-[#484F58]">{fmt(takeHome)}/an</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Info */}
          {tab === "info" && (
            <div className="rounded-2xl p-5 space-y-4" style={{ background: "#161B22", border: "1px solid #21262D" }}>
              {[
                { icon: "🏠", title: "CELIAPP — pour les premiers acheteurs", text: "Le Compte d'Épargne Libre d'Impôt pour l'Achat d'une Première Propriété permet de cotiser jusqu'à 8 000$/an (max 40 000$ à vie). Comme le REER, les cotisations sont déductibles. Comme le CELI, les retraits pour l'achat sont libres d'impôt. Double avantage unique." },
                { icon: "💡", title: "REER vs CELIAPP — peut-on faire les deux?", text: "Oui! Si vous êtes premier acheteur, maximisez d'abord votre CELIAPP (8 000$) avant le REER — vous bénéficiez des deux avantages fiscaux. Vous pouvez contribuer aux deux dans la même année." },
                { icon: "👷", title: "Cotisations syndicales et professionnelles", text: "Les cotisations à un syndicat, à un ordre professionnel ou à une association professionnelle sont entièrement déductibles. Vérifiez votre T4 ou reçus de fin d'année — ces montants sont souvent oubliés." },
                { icon: "👶", title: "Frais de garde", text: "Les frais de garde d'enfants (garderie, camp de jour, garde à domicile) sont déductibles jusqu'à 8 000$ par enfant de moins de 7 ans, et 5 000$ pour les 7-16 ans. C'est la personne avec le revenu le plus bas qui doit généralement réclamer." },
                { icon: "⚠️", title: "Important", text: "Cet estimateur utilise les taux 2025 et les crédits de base. Votre situation peut inclure d'autres crédits et déductions. Pour les frais de garde, les règles exactes peuvent varier — consultez un comptable." },
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
          <div className="mt-4 bg-[#3B82F6]/06 border border-[#3B82F6]/25 rounded-2xl p-8 text-center">
            <div className="text-3xl mb-3">📋</div>
            <h3 className="text-xl font-bold text-[#E6EDF3] mb-2">Produisez votre déclaration gratuitement</h3>
            <p className="text-sm text-[#8B949E] mb-6 leading-relaxed max-w-sm mx-auto">
              Wealthsimple Impôt est 100% canadien, gratuit pour les déclarations simples, et disponible en français.
            </p>
            <AffiliateLink href="https://www.wealthsimple.com/invite/EDVQ3W" partner="wealthsimple-impot"
              className="inline-block bg-[#3B82F6] text-white font-bold rounded-xl px-8 py-3.5 text-sm tracking-wide hover:bg-[#2563EB] transition-colors no-underline">
              Démarrer avec Wealthsimple Impôt →
            </AffiliateLink>
            <p className="text-xs text-[#484F58] mt-4">✓ Gratuit · ✓ 100% canadien · ✓ Disponible en français · Lien affilié</p>
          </div>

        </div>
      </div>
    </Layout>
  );
}