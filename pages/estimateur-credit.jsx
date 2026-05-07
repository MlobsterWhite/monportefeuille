import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import AffiliateLink from "../components/AffiliateLink";
import ToolSchema from "../components/ToolSchema";
import ShareButton from "../components/ShareButton";        
import useSharedParams from "../hooks/useSharedParams";


// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => Math.round(n || 0).toLocaleString("fr-CA");

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

// ─── Score calculation ────────────────────────────────────────────────────────
// Échelle 300–900 (Equifax Canada). Le bonus total maximum = 600 points,
// pondéré selon les vrais facteurs : 35/30/15/10/10.
function calcScore({ payments, utilization, history, inquiries, accounts }) {
  let score = 300;
  // Historique de paiements (35% — max 210)
  const paymentMap = { always: 210, usually: 160, sometimes: 80, often: 20 };
  score += paymentMap[payments] || 0;
  // Utilisation du crédit (30% — max 180)
  const util = Number(utilization);
  if (util <= 10) score += 180;
  else if (util <= 30) score += 150;
  else if (util <= 50) score += 100;
  else if (util <= 75) score += 50;
  else score += 10;
  // Ancienneté du crédit (15% — max 90)
  const histMap = { lt1: 15, "1to3": 40, "3to6": 60, "6to10": 75, gt10: 90 };
  score += histMap[history] || 0;
  // Nouvelles demandes (10% — max 60)
  const inqMap = { 0: 60, 1: 45, "2to3": 25, "4plus": 10 };
  score += inqMap[inquiries] || 0;
  // Variété de comptes (10% — max 60)
  const accMap = { 0: 5, 1: 30, "2to4": 50, "5plus": 60 };
  score += accMap[accounts] || 0;
  return Math.min(900, Math.max(300, Math.round(score)));
}

function getScoreLabel(score) {
  if (score >= 760) return { label: "Excellent", color: "#3DDC97", bg: "bg-[#3DDC97]/10 border-[#3DDC97]/25" };
  if (score >= 725) return { label: "Très bon", color: "#3DDC97", bg: "bg-[#3DDC97]/10 border-[#3DDC97]/25" };
  if (score >= 660) return { label: "Bon", color: "#F0A500", bg: "bg-[#F0A500]/10 border-[#F0A500]/25" };
  if (score >= 560) return { label: "Passable", color: "#F0A500", bg: "bg-[#F0A500]/10 border-[#F0A500]/25" };
  return { label: "À améliorer", color: "#f87171", bg: "bg-red-500/10 border-red-500/25" };
}

// ─── Score gauge ──────────────────────────────────────────────────────────────
function ScoreGauge({ score }) {
  const pct = (score - 300) / 600;
  const W = 300, H = 160, cx = 150, cy = 150, r = 110;
  const startAngle = Math.PI;
  const endAngle = 2 * Math.PI;
  const angleRange = endAngle - startAngle;
  const scoreAngle = startAngle + pct * angleRange;
  const x1 = cx + r * Math.cos(startAngle);
  const y1 = cy + r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(endAngle);
  const y2 = cy + r * Math.sin(endAngle);
  const sx = cx + r * Math.cos(scoreAngle);
  const sy = cy + r * Math.sin(scoreAngle);
  const { color } = getScoreLabel(score);

  const trackD = `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`;
  const fillD = `M ${x1} ${y1} A ${r} ${r} 0 ${pct > 0.5 ? 1 : 0} 1 ${sx} ${sy}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>
      <path d={trackD} fill="none" stroke="#21262D" strokeWidth="14" strokeLinecap="round" />
      <path d={fillD} fill="none" stroke={color} strokeWidth="14" strokeLinecap="round" />
      <circle cx={sx} cy={sy} r="8" fill={color} />
      <text x={cx} y={cy - 10} textAnchor="middle" fontSize="42" fontWeight="600" fill={color} fontFamily="monospace">{score}</text>
      <text x={cx} y={cy + 22} textAnchor="middle" fontSize="13" fill="#8B949E">{getScoreLabel(score).label}</text>
      <text x={cx - r + 4} y={cy + 20} textAnchor="middle" fontSize="10" fill="#484F58">300</text>
      <text x={cx + r - 4} y={cy + 20} textAnchor="middle" fontSize="10" fill="#484F58">900</text>
    </svg>
  );
}

// ─── Select component ─────────────────────────────────────────────────────────
function Select({ label, value, onChange, options, tooltip }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <label className="text-xs text-[#8B949E]">{label}</label>
        {tooltip && (
          <Tooltip text={tooltip}>
            <span className="text-[10px] text-[#484F58] border border-[#484F58] rounded-full w-3.5 h-3.5 inline-flex items-center justify-center cursor-help">?</span>
          </Tooltip>
        )}
      </div>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#0D1117] border border-[#21262D] rounded-lg px-3 py-2.5 text-[#E6EDF3] text-sm focus:outline-none focus:border-[#3DDC97] transition-colors">
        {options.map(({ value: v, label: l }) => <option key={v} value={v}>{l}</option>)}
      </select>
    </div>
  );
}

// ─── Slider ───────────────────────────────────────────────────────────────────
function Slider({ label, value, min, max, step, onChange, display, tooltip }) {
  const [editing, setEditing] = useState(false);
  const [raw, setRaw] = useState("");
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <label className="text-xs text-[#8B949E]">{label}</label>
          {tooltip && (
            <Tooltip text={tooltip}>
              <span className="text-[10px] text-[#484F58] border border-[#484F58] rounded-full w-3.5 h-3.5 inline-flex items-center justify-center cursor-help">?</span>
            </Tooltip>
          )}
        </div>
        {editing ? (
          <input type="number" autoFocus value={raw} min={min} max={max}
            onChange={(e) => setRaw(e.target.value)}
            onBlur={() => { const v = Math.min(max, Math.max(min, Number(raw) || value)); onChange(v); setEditing(false); }}
            onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); if (e.key === "Escape") setEditing(false); }}
            className="w-20 bg-[#0D1117] border border-[#3DDC97] rounded px-2 py-0.5 text-xs text-[#E6EDF3] text-right focus:outline-none" />
        ) : (
          <span onClick={() => { setRaw(value); setEditing(true); }}
            className="text-xs font-medium text-[#E6EDF3] tabular-nums cursor-pointer hover:text-[#3DDC97] transition-colors border-b border-dashed border-[#484F58]">
            {display}
          </span>
        )}
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#3DDC97] h-1.5 rounded-full cursor-pointer" />
      <div className="flex justify-between text-[10px] text-[#484F58] mt-1">
        <span>{min}%</span><span>{max}%</span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const DEFAULT = { payments: "always", utilization: 30, history: "3to6", inquiries: "0", accounts: "2to4" };

export default function EstimateurCredit() {
  const [params, setParams] = useState(DEFAULT);
  const [tab, setTab] = useState("inputs");

  const set = (key) => (val) => setParams(p => ({ ...p, [key]: val }));

  useSharedParams({
    payments: { setter: (v) => setParams(p => ({ ...p, payments: v })) },
    utilization: { setter: (v) => setParams(p => ({ ...p, utilization: v })), parser: Number },
    history: { setter: (v) => setParams(p => ({ ...p, history: v })) },
    inquiries: { setter: (v) => setParams(p => ({ ...p, inquiries: v })) },
    accounts: { setter: (v) => setParams(p => ({ ...p, accounts: v })) },
  });

  // Persist
  useEffect(() => {
    try {
      const saved = localStorage.getItem("credit:params");
      if (saved) setParams(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem("credit:params", JSON.stringify(params)); } catch {}
  }, [params]);

  const score = calcScore(params);
  const { label, color, bg } = getScoreLabel(score);

  const factors = [
    { label: "Historique de paiements", weight: "35%", impact: params.payments === "always" ? "Excellent" : params.payments === "usually" ? "Bon" : params.payments === "sometimes" ? "Passable" : "Faible", color: params.payments === "always" ? "#3DDC97" : params.payments === "usually" ? "#F0A500" : "#f87171" },
    { label: "Utilisation du crédit", weight: "30%", impact: params.utilization <= 10 ? "Excellent" : params.utilization <= 30 ? "Bon" : params.utilization <= 50 ? "Passable" : "Faible", color: params.utilization <= 30 ? "#3DDC97" : params.utilization <= 50 ? "#F0A500" : "#f87171" },
    { label: "Ancienneté du crédit", weight: "15%", impact: params.history === "gt10" ? "Excellent" : params.history === "6to10" ? "Très bon" : params.history === "3to6" ? "Bon" : "Faible", color: ["gt10", "6to10"].includes(params.history) ? "#3DDC97" : params.history === "3to6" ? "#F0A500" : "#f87171" },
    { label: "Nouvelles demandes de crédit", weight: "10%", impact: params.inquiries === "0" ? "Excellent" : params.inquiries === "1" ? "Bon" : params.inquiries === "2to3" ? "Passable" : "Faible", color: params.inquiries === "0" ? "#3DDC97" : params.inquiries === "1" ? "#F0A500" : "#f87171" },
    { label: "Variété de comptes", weight: "10%", impact: params.accounts === "5plus" || params.accounts === "2to4" ? "Bon" : params.accounts === "1" ? "Passable" : "Faible", color: ["5plus", "2to4"].includes(params.accounts) ? "#3DDC97" : "#F0A500" },
  ];

  const tabs = [
    { key: "inputs", label: "Paramètres" },
    { key: "results", label: "Résultats" },
    { key: "info", label: "C'est quoi la cote?" },
  ];

  return (
    <Layout
      title="Estimateur de Cote de Crédit Equifax"
      description="Estimez votre cote de crédit Equifax gratuitement, découvrez comment l'améliorer et accédez aux meilleurs taux au Canada. Sans impact sur votre score."
      canonical="https://monportefeuille.ca/estimateur-credit"
    >
      <ToolSchema
        name="Estimateur de Cote de Crédit Canada"
        description="Estimez votre cote de crédit Equifax gratuitement, découvrez comment l'améliorer et accédez aux meilleurs taux. Vérification douce (soft check) sans impact sur votre score."
        url="https://monportefeuille.ca/estimateur-credit"
      />
      
      <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", background: "#0D1117", minHeight: "100vh", padding: "2rem 1rem" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>

          {/* Header */}
          <div className="mb-6">
            <div className="text-[10px] text-[#484F58] uppercase tracking-widest mb-1">monportefeuille.ca</div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#E6EDF3] mb-2 mt-3">
              Estimateur de Cote de Crédit Canada
            </h1>
            <p className="text-sm text-[#8B949E] leading-relaxed">
              Estimez votre profil de crédit, découvrez comment l'améliorer et accédez aux meilleurs taux
            </p>
          </div>

          {/* Hero */}
          <div className="rounded-2xl p-5 mb-4 relative overflow-hidden" style={{ background: "#161B22", border: "1px solid #21262D" }}>
            <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 80% 50%, ${color}12 0%, transparent 65%)` }} />
            <div className="relative">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-[10px] text-[#8B949E] uppercase tracking-wide mb-1">Cote estimée</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", color }} className="text-3xl font-medium">{score}</div>
                  <div className="text-[10px] text-[#484F58] mt-0.5">sur 900 (Equifax Canada)</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#8B949E] uppercase tracking-wide mb-1">Profil</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", color }} className="text-3xl font-medium">{label}</div>
                  <div className="text-[10px] text-[#484F58] mt-0.5">
                    {score >= 760 ? "Accès aux meilleurs taux" : score >= 660 ? "Admissible à la plupart des produits" : "Amélioration recommandée"}
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-[#21262D]">
                <div className="flex justify-between text-[10px] text-[#484F58] mb-1.5">
                  <span>300 — Mauvais</span>
                  <span>560 — Passable</span>
                  <span>660 — Bon</span>
                  <span>900 — Excellent</span>
                </div>
                <div className="h-2 bg-[#21262D] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${((score - 300) / 600) * 100}%`, background: `linear-gradient(90deg, #f87171, #F0A500, #3DDC97)` }} />
                </div>
                <div className="mt-1.5" style={{ marginLeft: `${Math.max(0, Math.min(95, ((score - 300) / 600) * 100 - 2))}%` }}>
                  <div className="w-0.5 h-2 bg-white mx-auto" />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-4 bg-[#161B22] border border-[#21262D] rounded-xl p-1">
            {tabs.map(({ key, label: l }) => (
              <button key={key} onClick={() => setTab(key)}
                className={`flex-1 text-xs py-2 rounded-lg transition-all font-medium ${tab === key ? "bg-[#21262D] text-[#E6EDF3]" : "text-[#8B949E] hover:text-[#C9D1D9]"}`}>
                {l}
              </button>
            ))}
          </div>

          {/* Inputs Tab */}
          {tab === "inputs" && (
            <div className="rounded-2xl p-5 space-y-5" style={{ background: "#161B22", border: "1px solid #21262D" }}>

              <Select label="Historique de paiements"
                tooltip="Avez-vous toujours payé vos factures à temps? C'est le facteur le plus important — 35% de votre cote."
                value={params.payments} onChange={set("payments")}
                options={[
                  { value: "always", label: "Toujours à temps" },
                  { value: "usually", label: "Généralement à temps" },
                  { value: "sometimes", label: "Parfois en retard" },
                  { value: "often", label: "Souvent en retard" },
                ]} />

              <Slider label="Utilisation du crédit"
                tooltip="Pourcentage de votre limite de crédit utilisée. Idéalement moins de 30%. Ex: 1 500$ sur une limite de 5 000$ = 30%."
                value={params.utilization} min={0} max={100} step={5}
                onChange={set("utilization")} display={`${params.utilization}%`} />

              <Select label="Ancienneté du crédit"
                tooltip="Depuis combien de temps avez-vous votre plus ancien compte de crédit? Plus c'est long, mieux c'est."
                value={params.history} onChange={set("history")}
                options={[
                  { value: "lt1", label: "Moins de 1 an" },
                  { value: "1to3", label: "1 à 3 ans" },
                  { value: "3to6", label: "3 à 6 ans" },
                  { value: "6to10", label: "6 à 10 ans" },
                  { value: "gt10", label: "Plus de 10 ans" },
                ]} />

              <Select label="Nouvelles demandes de crédit (12 mois)"
                tooltip="Combien de fois avez-vous demandé un nouveau crédit (carte, prêt, hypothèque) au cours des 12 derniers mois? Chaque demande laisse une trace."
                value={params.inquiries} onChange={set("inquiries")}
                options={[
                  { value: "0", label: "Aucune" },
                  { value: "1", label: "1 demande" },
                  { value: "2to3", label: "2 à 3 demandes" },
                  { value: "4plus", label: "4 demandes ou plus" },
                ]} />

              <Select label="Comptes de crédit actifs"
                tooltip="Nombre de comptes de crédit ouverts (cartes, marges, prêts auto, hypothèque). Un bon mix de types aide votre cote."
                value={params.accounts} onChange={set("accounts")}
                options={[
                  { value: "0", label: "Aucun" },
                  { value: "1", label: "1 compte" },
                  { value: "2to4", label: "2 à 4 comptes" },
                  { value: "5plus", label: "5 comptes et plus" },
                ]} />

              <button
                onClick={() => { setTab("results"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="w-full bg-[#3DDC97] text-[#0D1117] font-bold rounded-xl py-3.5 text-sm tracking-wide hover:bg-[#2bc47e] transition-colors"
              >
                Voir mes résultats ↑
              </button>
              <button
                onClick={() => { setParams(DEFAULT); localStorage.removeItem("credit:params"); }}
                className="w-full border border-[#21262D] text-[#8B949E] rounded-xl py-3 text-sm hover:border-[#484F58] hover:text-[#E6EDF3] transition-colors"
              >
                Réinitialiser
              </button>
            </div>
          )}

          {/* Results Tab */}
          {tab === "results" && (
            <div className="space-y-3">
              {/* Gauge */}
              <div className="rounded-2xl p-5" style={{ background: "#161B22", border: "1px solid #21262D" }}>
                <div className="text-xs text-[#8B949E] uppercase tracking-widest mb-2">Votre cote estimée</div>
                <ScoreGauge score={score} />
              </div>

              {/* Factors */}
              <div className="rounded-2xl p-5" style={{ background: "#161B22", border: "1px solid #21262D" }}>
                <div className="text-xs text-[#8B949E] uppercase tracking-widest mb-4">Analyse par facteur</div>
                <div className="space-y-3">
                  {factors.map(({ label: l, weight, impact, color: c }) => (
                    <div key={l} className="flex items-center justify-between py-2 border-b border-[#21262D] last:border-0">
                      <div>
                        <div className="text-xs text-[#E6EDF3]">{l}</div>
                        <div className="text-[10px] text-[#484F58]">{weight} de votre cote</div>
                      </div>
                      <span style={{ color: c, fontFamily: "'DM Mono', monospace" }} className="text-xs font-medium">{impact}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="rounded-2xl p-5" style={{ background: "#161B22", border: "1px solid #21262D" }}>
                <div className="text-xs text-[#8B949E] uppercase tracking-widest mb-4">Comment améliorer votre cote</div>
                <div className="space-y-3">
                  {params.utilization > 30 && (
                    <div className="flex gap-3 p-3 bg-[#0D1117] rounded-xl border border-[#21262D]">
                      <span className="text-base">💳</span>
                      <div>
                        <div className="text-xs font-medium text-[#E6EDF3]">Réduire l'utilisation du crédit</div>
                        <div className="text-[10px] text-[#8B949E] mt-0.5">Visez moins de 30% d'utilisation. Rembourser {Math.round((params.utilization - 30) / 100 * 5000)}$ sur une limite de 5 000$ vous mettrait en zone optimale.</div>
                      </div>
                    </div>
                  )}
                  {(params.payments === "sometimes" || params.payments === "often") && (
                    <div className="flex gap-3 p-3 bg-[#0D1117] rounded-xl border border-[#21262D]">
                      <span className="text-base">📅</span>
                      <div>
                        <div className="text-xs font-medium text-[#E6EDF3]">Automatiser vos paiements</div>
                        <div className="text-[10px] text-[#8B949E] mt-0.5">Configurez des paiements automatiques pour ne plus jamais manquer une échéance. C'est le facteur #1 de votre cote.</div>
                      </div>
                    </div>
                  )}
                  {params.inquiries === "4plus" && (
                    <div className="flex gap-3 p-3 bg-[#0D1117] rounded-xl border border-[#21262D]">
                      <span className="text-base">🔍</span>
                      <div>
                        <div className="text-xs font-medium text-[#E6EDF3]">Limiter les nouvelles demandes</div>
                        <div className="text-[10px] text-[#8B949E] mt-0.5">Évitez de demander plusieurs crédits à la fois. Les traces de vérification disparaissent après 2 ans.</div>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-3 p-3 bg-[#0D1117] rounded-xl border border-[#21262D]">
                    <span className="text-base">📊</span>
                    <div>
                      <div className="text-xs font-medium text-[#E6EDF3]">Connaître votre vraie cote</div>
                      <div className="text-[10px] text-[#8B949E] mt-0.5">Ceci est une estimation éducative. Borrowell vous donne votre vraie cote Equifax — gratuit, sans impact sur votre crédit, mis à jour chaque semaine.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Info Tab */}
          {tab === "info" && (
            <div className="rounded-2xl p-5 space-y-4" style={{ background: "#161B22", border: "1px solid #21262D" }}>
              {[
                { icon: "📊", title: "C'est quoi une cote de crédit?", text: "La cote de crédit (ou score de crédit) est un nombre entre 300 et 900 qui résume votre historique financier. Les prêteurs l'utilisent pour décider si vous êtes admissible à un prêt et à quel taux d'intérêt." },
                { icon: "🏦", title: "Equifax vs TransUnion", text: "Au Canada, deux agences compilent votre dossier de crédit : Equifax et TransUnion. Leurs cotes peuvent légèrement différer. Borrowell utilise Equifax, qui est la plus utilisée par les prêteurs canadiens." },
                { icon: "📈", title: "Les 5 facteurs", text: "Historique de paiements (35%), utilisation du crédit (30%), ancienneté du crédit (15%), nouvelles demandes (10%), variété de comptes (10%). Les paiements à temps et une faible utilisation sont de loin les plus importants." },
                { icon: "✅", title: "Vérification douce vs dure", text: "Vérifier vous-même votre cote (comme avec Borrowell) est une vérification douce — elle n'affecte pas votre score. Une demande de crédit officielle est une vérification dure — elle peut réduire temporairement votre cote de quelques points." },
                { icon: "⚠️", title: "Important", text: "Cet estimateur est un outil éducatif basé sur des approximations. Votre vraie cote peut différer selon votre historique détaillé. Consultez Borrowell ou votre institution financière pour votre cote officielle." },
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

          {/* ─── Guide Crédit ─── */}
          <section className="mt-16 max-w-2xl mx-auto px-4 text-justify">
            
            <h2 className="text-2xl font-bold text-[#E6EDF3] mb-6">
              Comment fonctionne la cote de crédit au Canada
            </h2>
            <p className="text-sm text-[#8B949E] leading-relaxed mb-4">
              Votre cote de crédit (entre 300 et 900) reflète votre fiabilité financière selon les agences Equifax et TransUnion. Elle est calculée à partir de votre historique de paiement (35%), utilisation du crédit (30%), ancienneté des comptes (15%), types de crédit (10%) et nouvelles demandes (10%). Une cote de 720+ vous donne accès aux meilleurs taux hypothécaires et cartes de crédit premium. Une cote sous 650 peut entraîner des refus ou des taux d'intérêt beaucoup plus élevés. La bonne nouvelle : vous pouvez améliorer votre cote en 6-12 mois avec les bonnes stratégies.
            </p>

            <h2 className="text-2xl font-bold text-[#E6EDF3] mb-6 mt-12">
              Comment améliorer votre cote de crédit rapidement
            </h2>
            <p className="text-sm text-[#8B949E] leading-relaxed mb-4">
              Payez TOUTES vos factures à temps — même un seul retard de 30+ jours peut faire chuter votre cote de 50-100 points. Gardez votre utilisation de crédit sous 30% de votre limite (idéalement sous 10%) — si votre limite totale est 10 000$, ne dépassez jamais 3 000$ de solde. Ne fermez pas vos vieilles cartes même si vous ne les utilisez plus (l'ancienneté aide). Évitez de demander trop de nouveaux crédits en peu de temps. Si vous avez des dettes, priorisez celles à taux d'intérêt élevé (cartes de crédit à 19-22%) avec la méthode avalanche, ou commencez par les plus petits soldes pour un effet de motivation rapide avec la méthode boule de neige.
            </p>

            <h2 className="text-2xl font-bold text-[#E6EDF3] mb-6 mt-12">
              Vérifier votre cote gratuitement sans impact
            </h2>
            <p className="text-sm text-[#8B949E] leading-relaxed mb-4">
              Il existe deux types de vérifications : soft check (aucun impact) et hard check (baisse temporaire de 5-10 points). Quand VOUS vérifiez votre propre cote via Borrowell, Equifax ou TransUnion, c'est un soft check — vous pouvez vérifier aussi souvent que vous voulez. Quand un prêteur vérifie avant de vous accorder un crédit (hypothèque, carte de crédit, prêt auto), c'est un hard check qui apparaît dans votre dossier. Vérifiez votre cote au moins une fois par trimestre pour détecter les erreurs ou activités suspectes. C'est gratuit et ne nuit jamais à votre score.
            </p>

            <h2 className="text-2xl font-bold text-[#E6EDF3] mb-6 mt-12">
              Questions fréquentes sur la cote de crédit
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#E6EDF3] mb-2">
                  Quelle est une bonne cote de crédit au Canada ?
                </h3>
                <p className="text-sm text-[#8B949E] leading-relaxed">
                  300-579 : Très faible (refus fréquents) • 580-669 : Acceptable (taux élevés) • 670-739 : Bon (taux moyens) • 740-799 : Très bon (bons taux) • 800-900 : Excellent (meilleurs taux). La moyenne canadienne est environ 650. Pour les meilleurs taux hypothécaires et cartes premium, visez 720+.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#E6EDF3] mb-2">
                  Combien de temps faut-il pour reconstruire une mauvaise cote ?
                </h3>
                <p className="text-sm text-[#8B949E] leading-relaxed">
                  Si votre cote a chuté à cause de retards de paiement ou dettes envoyées aux collections, comptez 6-12 mois pour voir une amélioration significative (+50-100 points) si vous adoptez de bonnes habitudes immédiatement. Les éléments négatifs restent dans votre dossier 6-7 ans, mais leur impact diminue avec le temps. Une faillite reste 6-7 ans selon la province. La clé : commencer maintenant et être patient.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#E6EDF3] mb-2">
                  Fermer une carte de crédit nuit-il à ma cote ?
                </h3>
                <p className="text-sm text-[#8B949E] leading-relaxed">
                  Oui, surtout si c'est une vieille carte. Fermer un compte réduit votre crédit disponible total (augmente votre taux d'utilisation) et peut réduire l'ancienneté moyenne de vos comptes. Exemple : si vous avez 10 000$ de limite totale et fermez une carte de 3 000$, vos autres soldes représentent maintenant un pourcentage plus élevé de votre nouveau total (7 000$). Gardez vos vieilles cartes ouvertes même si vous ne les utilisez plus, ou utilisez-les pour un petit achat mensuel automatique.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#E6EDF3] mb-2">
                  Ma cote est basse, puis-je quand même obtenir une hypothèque ?
                </h3>
                <p className="text-sm text-[#8B949E] leading-relaxed">
                  Oui, mais vos options sont limitées et les taux seront plus élevés. Avec une cote sous 650, les prêteurs traditionnels (banques) peuvent refuser ou exiger une mise de fonds plus élevée (20%+). Vous pourriez vous tourner vers les prêteurs B ou privés qui acceptent des cotes plus basses, mais avec des taux 2-4% plus élevés. Sur un prêt de 400 000$, ça représente 600-800$/mois de plus. Mieux vaut prendre 6-12 mois pour améliorer votre cote AVANT de demander une hypothèque — utilisez notre <a href="/calculateur-hypotheque" className="text-[#3DDC97] underline">calculateur hypothécaire</a> pour voir l'impact du taux sur vos paiements.
                </p>
              </div>
            </div>

            <div className="mt-12 p-6 bg-[#161B22] border border-[#21262D] rounded-xl">
              <h3 className="text-base font-bold text-[#E6EDF3] mb-3">
                💡 Outils connexes pour améliorer vos finances
              </h3>
              <ul className="text-sm text-[#8B949E] leading-relaxed space-y-2">
                <li>→ <a href="/calculateur-hypotheque" className="text-[#3DDC97] underline">Calculateur hypothèque</a> : Voir l'impact de votre cote sur vos paiements</li>
                <li>→ <a href="/valeur-nette" className="text-[#3DDC97] underline">Calculateur valeur nette</a> : Portrait financier complet</li>
                <li>→ <a href="/calculateur-reer" className="text-[#3DDC97] underline">Calculateur REER</a> : Épargne automatique améliore crédit</li>
              </ul>
            </div>

          </section>

          {/* CTA */}
          <div className="mt-4 bg-[#3B82F6]/06 border border-[#3B82F6]/25 rounded-2xl p-8 text-center">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-xl font-bold text-[#E6EDF3] mb-2">Obtenez votre vraie cote Equifax</h3>
            <p className="text-sm text-[#8B949E] mb-6 leading-relaxed max-w-sm mx-auto">
              Gratuit, sans impact sur votre crédit. Mis à jour chaque semaine. Plus de 3 millions de Canadiens l'utilisent.
            </p>
            <AffiliateLink
              href="https://borrowell.com/refer-a-friend/free-credit-score?utm_campaign=Refer5&utm_medium=web&utm_source=refer2022-1115247"
              partner="borrowell"
              className="inline-block bg-[#3B82F6] text-white font-bold rounded-xl px-8 py-3.5 text-sm tracking-wide hover:bg-[#2563EB] transition-colors no-underline"
            >
              Vérifier ma vraie cote — Gratuit →
            </AffiliateLink>
            <p className="text-xs text-[#484F58] mt-4">✓ Aucune carte de crédit · ✓ Aucun impact · ✓ Données sécurisées · Lien affilié</p>
          </div>

          <div className="mt-8 rounded-2xl p-5 bg-[#161B22] border border-[#21262D]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-[#E6EDF3] mb-1">Partagez cette simulation</h3>
                <p className="text-xs text-[#8B949E]">Envoyez le lien à un ami ou sauvegardez vos calculs</p>
              </div>
              <div className="hover:opacity-80 transition-opacity duration-200 cursor-pointer">
                <ShareButton params={params} color="#3DDC97" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}