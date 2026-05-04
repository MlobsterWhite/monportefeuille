import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import AffiliateLink from "../components/AffiliateLink";
import ShareButton from "../components/ShareButton";        
import useSharedParams from "../hooks/useSharedParams";

const ACCENT = "#60A5FA";

const PROVINCES = ["QC", "ON", "BC", "AB", "SK", "MB", "NB", "NS", "PE", "NL"];

const BASE_AUTO = { QC: 800, ON: 1600, BC: 1400, AB: 1200, SK: 1100, MB: 1300, NB: 950, NS: 1000, PE: 900, NL: 1050 };
const BASE_HAB = { QC: 700, ON: 1000, BC: 950, AB: 850, SK: 800, MB: 820, NB: 780, NS: 850, PE: 720, NL: 900 };

function calcPrime(type, province, age, annees, franchise) {
  const base = (type === "auto" ? BASE_AUTO : BASE_HAB)[province] || 1000;
  const facteurAge = age < 25 ? 1.5 : age < 35 ? 1.15 : age < 55 ? 1.0 : 1.1;
  const facteurExp = type === "auto" ? (annees < 2 ? 1.3 : annees < 5 ? 1.1 : 1.0) : 1.0;
  const facteurFranchise = franchise === 250 ? 1.15 : franchise === 500 ? 1.0 : franchise === 1000 ? 0.88 : 0.80;
  return {
    min: Math.round((base * facteurAge * facteurExp * facteurFranchise * 0.85) / 12),
    max: Math.round((base * facteurAge * facteurExp * facteurFranchise * 1.15) / 12),
  };
}

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
            className="w-20 bg-[#0D1117] border rounded px-2 py-0.5 text-xs text-[#E6EDF3] text-right focus:outline-none"
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
        <span>{min}</span><span>{max}</span>
      </div>
    </div>
  );
}

const DEFAULT = { type: "auto", province: "QC", age: 35, annees: 5, franchise: 500 };

export default function EstimateurAssurance() {
  const [type, setType] = useState(DEFAULT.type);
  const [province, setProvince] = useState(DEFAULT.province);
  const [age, setAge] = useState(DEFAULT.age);
  const [annees, setAnnees] = useState(DEFAULT.annees);
  const [franchise, setFranchise] = useState(DEFAULT.franchise);
  const [tab, setTab] = useState("inputs");

  useSharedParams({
    type: { setter: setType },  // String: 'auto' ou 'habitation'
    province: { setter: setProvince },  // String
    age: { setter: setAge, parser: Number },
    annees: { setter: setAnnees, parser: Number },
    franchise: { setter: setFranchise, parser: Number },
  });

  useEffect(() => {
    try {
      const s = localStorage.getItem("assurance:params");
      if (s) { const p = JSON.parse(s); setType(p.type||"auto"); setProvince(p.province||"QC"); setAge(p.age||35); setAnnees(p.annees||5); setFranchise(p.franchise||500); }
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem("assurance:params", JSON.stringify({ type, province, age, annees, franchise })); } catch {}
  }, [type, province, age, annees, franchise]);

  const { min: estimMin, max: estimMax } = calcPrime(type, province, age, annees, franchise);
  const midEstim = Math.round((estimMin + estimMax) / 2);

  const tabs = [
    { key: "inputs", label: "Paramètres" },
    { key: "results", label: "Résultats" },
    { key: "info", label: "Comment réduire?" },
  ];

  return (
    <Layout
      title="Estimateur d'Assurance Auto et Habitation — Québec et Canada"
      description="Estimez votre prime d'assurance auto ou habitation selon votre profil. Comparez et économisez sur votre assurance au Québec et au Canada."
      canonical="https://monportefeuille.ca/estimateur-assurance"
    >
      <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", background: "#0D1117", minHeight: "100vh", padding: "2rem 1rem" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');`}</style>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>

          <div className="mb-6">
            <div className="text-[10px] text-[#484F58] uppercase tracking-widest mb-1">monportefeuille.ca</div>
            <h1 style={{ fontFamily: "'DM Mono', monospace" }} className="text-3xl font-medium text-[#E6EDF3]">Estimateur d'assurance</h1>
            <p className="text-sm text-[#8B949E] mt-1">Estimez votre prime mensuelle en auto ou habitation selon votre profil</p>
          </div>

          {/* Hero */}
          <div className="rounded-2xl p-5 mb-4 relative overflow-hidden" style={{ background: "#161B22", border: "1px solid #21262D" }}>
            <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 80% 50%, ${ACCENT}10 0%, transparent 65%)` }} />
            <div className="relative">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-[10px] text-[#8B949E] uppercase tracking-wide mb-1">Estimation mensuelle</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", color: ACCENT }} className="text-3xl font-medium">{estimMin}$ – {estimMax}$</div>
                  <div className="text-[10px] text-[#484F58] mt-0.5">par mois · {type === "auto" ? "🚗 Auto" : "🏠 Habitation"}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#8B949E] uppercase tracking-wide mb-1">Estimation annuelle</div>
                  <div style={{ fontFamily: "'DM Mono', monospace" }} className="text-3xl font-medium text-[#E6EDF3]">{estimMin * 12}$ – {estimMax * 12}$</div>
                  <div className="text-[10px] text-[#484F58] mt-0.5">par année</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#21262D]">
                <div>
                  <div className="text-[10px] text-[#8B949E] uppercase tracking-wide mb-1">Province</div>
                  <div style={{ fontFamily: "'DM Mono', monospace" }} className="text-base text-[#E6EDF3] font-medium">{province}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#8B949E] uppercase tracking-wide mb-1">Franchise sélectionnée</div>
                  <div style={{ fontFamily: "'DM Mono', monospace" }} className="text-base text-[#E6EDF3] font-medium">{franchise}$</div>
                </div>
              </div>
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
            <div className="rounded-2xl p-5 space-y-5" style={{ background: "#161B22", border: "1px solid #21262D" }}>

              {/* Type */}
              <div>
                <label className="text-xs text-[#8B949E] block mb-2">Type d'assurance</label>
                <div className="flex gap-2">
                  {[{ key: "auto", label: "🚗 Auto" }, { key: "habitation", label: "🏠 Habitation" }].map(({ key, label }) => (
                    <button key={key} onClick={() => setType(key)}
                      className="flex-1 py-2.5 rounded-lg text-xs font-medium transition-colors"
                      style={{ background: type === key ? ACCENT : "#21262D", color: type === key ? "#0D1117" : "#8B949E" }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Province */}
              <div>
                <label className="text-xs text-[#8B949E] block mb-2">Province</label>
                <select value={province} onChange={(e) => setProvince(e.target.value)}
                  className="w-full bg-[#0D1117] border border-[#21262D] rounded-lg px-3 py-2.5 text-[#E6EDF3] text-sm focus:outline-none transition-colors"
                  style={{ borderColor: undefined }}
                  onFocus={e => e.target.style.borderColor = ACCENT}
                  onBlur={e => e.target.style.borderColor = "#21262D"}>
                  {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <Slider label="Votre âge" value={age} min={16} max={75} step={1} onChange={setAge} display={age + " ans"} />

              {type === "auto" && (
                <Slider label="Années sans réclamation" value={annees} min={0} max={15} step={1} onChange={setAnnees} display={annees + " ans"} />
              )}

              {/* Franchise */}
              <div>
                <label className="text-xs text-[#8B949E] block mb-2">Franchise</label>
                <div className="grid grid-cols-4 gap-2">
                  {[250, 500, 1000, 2000].map(f => (
                    <button key={f} onClick={() => setFranchise(f)}
                      className="py-2 rounded-lg text-xs font-medium transition-colors"
                      style={{ background: franchise === f ? ACCENT : "#21262D", color: franchise === f ? "#0D1117" : "#8B949E" }}>
                      {f}$
                    </button>
                  ))}
                </div>
                <div className="text-[10px] text-[#484F58] mt-1.5">Une franchise plus élevée = prime plus basse</div>
              </div>

              <button onClick={() => { setTab("results"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="w-full font-bold rounded-xl py-3.5 text-sm tracking-wide transition-colors text-white"
                style={{ background: ACCENT }}>
                Voir mes résultats ↑
              </button>
              <button onClick={() => { setType(DEFAULT.type); setProvince(DEFAULT.province); setAge(DEFAULT.age); setAnnees(DEFAULT.annees); setFranchise(DEFAULT.franchise); localStorage.removeItem("assurance:params"); }}
                className="w-full border border-[#21262D] text-[#8B949E] rounded-xl py-3 text-sm hover:border-[#484F58] hover:text-[#E6EDF3] transition-colors">
                Réinitialiser
              </button>
            </div>
          )}

          {/* Results */}
          {tab === "results" && (
            <div className="space-y-3">
              <div className="rounded-2xl p-5" style={{ background: "#161B22", border: "1px solid #21262D" }}>
                <div className="text-xs text-[#8B949E] uppercase tracking-widest mb-4">Estimation détaillée</div>
                <div className="space-y-3">
                  {[
                    { label: "Type", val: type === "auto" ? "Assurance auto" : "Assurance habitation", color: "#E6EDF3" },
                    { label: "Province", val: province, color: "#E6EDF3" },
                    { label: "Âge", val: age + " ans", color: "#E6EDF3" },
                    ...(type === "auto" ? [{ label: "Années sans réclamation", val: annees + " ans", color: "#E6EDF3" }] : []),
                    { label: "Franchise", val: franchise + "$", color: "#E6EDF3" },
                    { label: "Prime mensuelle estimée", val: `${estimMin}$ – ${estimMax}$`, color: ACCENT },
                    { label: "Prime annuelle estimée", val: `${estimMin * 12}$ – ${estimMax * 12}$`, color: ACCENT },
                  ].map(({ label, val, color }) => (
                    <div key={label} className="flex justify-between items-center py-2 border-b border-[#21262D] last:border-0">
                      <span className="text-xs text-[#8B949E]">{label}</span>
                      <span style={{ fontFamily: "'DM Mono', monospace", color }} className="text-sm font-medium">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Impact franchise */}
              <div className="rounded-2xl p-5" style={{ background: "#161B22", border: "1px solid #21262D" }}>
                <div className="text-xs text-[#8B949E] uppercase tracking-widest mb-4">Impact de la franchise</div>
                {[250, 500, 1000, 2000].map(f => {
                  const { min, max } = calcPrime(type, province, age, annees, f);
                  const mid = Math.round((min + max) / 2);
                  const isSelected = f === franchise;
                  return (
                    <div key={f} className={`flex justify-between items-center py-2 border-b border-[#21262D] last:border-0 ${isSelected ? "" : "opacity-60"}`}>
                      <span className="text-xs text-[#8B949E]">Franchise {f}$</span>
                      <span style={{ fontFamily: "'DM Mono', monospace", color: isSelected ? ACCENT : "#E6EDF3" }} className="text-sm font-medium">{min}$ – {max}$/mois</span>
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
                { icon: "🔗", title: "Regrouper auto + habitation", text: "Assurer votre auto et votre logement chez le même assureur peut vous économiser jusqu'à 15% sur vos deux primes. C'est le moyen le plus simple de réduire votre facture." },
                { icon: "💰", title: "Augmenter votre franchise", text: "Passer d'une franchise de 500$ à 1 000$ peut réduire votre prime de 10 à 15%. Bonne stratégie si vous avez un fonds d'urgence solide de 3 à 6 mois de dépenses." },
                { icon: "🚗", title: "Votre dossier de conduite", text: "Zéro réclamation pendant 5+ ans reste le facteur le plus puissant pour réduire votre prime auto. Chaque année sans réclamation compte — surtout après un incident." },
                { icon: "📍", title: "La province fait une grande différence", text: "L'Ontario et la Colombie-Britannique ont les primes auto les plus élevées au Canada. Le Québec bénéficie d'un régime public (SAAQ) qui couvre les dommages corporels, ce qui réduit les primes." },
                { icon: "⚠️", title: "Important", text: "Cette estimation est indicative et basée sur des moyennes provinciales. Votre prime réelle dépend de nombreux facteurs — historique, type de véhicule, localisation précise, couvertures choisies. Obtenez plusieurs soumissions." },
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

          {/* CTA
          <div className="mt-4 bg-[#3B82F6]/06 border border-[#3B82F6]/25 rounded-2xl p-8 text-center">
            <div className="text-3xl mb-3">🛡️</div>
            <h3 className="text-xl font-bold text-[#E6EDF3] mb-2">Obtenez un vrai devis en 5 minutes</h3>
            <p className="text-sm text-[#8B949E] mb-6 leading-relaxed max-w-sm mx-auto">
              100% en ligne, sans agent. Comparez plusieurs assureurs et choisissez la meilleure couverture.
            </p>
            <AffiliateLink href="https://www.sonnet.ca/?utm_source=monportefeuille" partner="sonnet"
              className="inline-block bg-[#3B82F6] text-white font-bold rounded-xl px-8 py-3.5 text-sm tracking-wide hover:bg-[#2563EB] transition-colors no-underline">
              Obtenir mon devis avec Sonnet →
            </AffiliateLink>
            <p className="text-xs text-[#484F58] mt-4">✓ 100% en ligne · ✓ Sans agent · ✓ 5 minutes · Lien affilié</p>
          </div>
          */}
          
          <div className="mt-8 rounded-2xl p-5 bg-[#161B22] border border-[#21262D]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-[#E6EDF3] mb-1">Partagez cette simulation</h3>
                <p className="text-xs text-[#8B949E]">Envoyez le lien à un ami ou sauvegardez vos calculs</p>
              </div>
              <div className="hover:opacity-80 transition-opacity duration-200 cursor-pointer">
                <ShareButton
                  params={{
                    type,
                    province,
                    age,
                    annees,
                    franchise,
                  }}
                  color="#60A5FA"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
