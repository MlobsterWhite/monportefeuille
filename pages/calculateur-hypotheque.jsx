import { useState, useEffect, useMemo } from "react";
import Layout from "../components/Layout";
import AffiliateLink from "../components/AffiliateLink";
import ToolSchema from "../components/ToolSchema";
import ShareButton from "../components/ShareButton";
import Slider from "../components/Slider";
import useSharedParams from "../hooks/useSharedParams";

const ACCENT = "#FB923C";
const fmt = (n) => "$" + Math.round(n || 0).toLocaleString("fr-CA");
const fmtFull = (n) => n.toLocaleString("fr-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 });


// ─── Fréquences de paiement (identiques à nesto) ──────────────────────────────
const FREQUENCES = [
  { key: "mensuel",        label: "Mensuel",                 nbParAn: 12,  accelere: false },
  { key: "bimensuel",      label: "Bimensuel (2x/mois)",     nbParAn: 24,  accelere: false },
  { key: "bimensuel_bw",   label: "Aux 2 semaines",          nbParAn: 26,  accelere: false },
  { key: "hebdo",          label: "Hebdomadaire",            nbParAn: 52,  accelere: false },
  { key: "bimensuel_acc",  label: "Aux 2 sem. accéléré ⚡",  nbParAn: 26,  accelere: true  },
  { key: "hebdo_acc",      label: "Hebdo accéléré ⚡",       nbParAn: 52,  accelere: true  },
];

const FREQ_LABEL = {
  mensuel:       "par mois",
  bimensuel:     "bimensuel",
  bimensuel_bw:  "aux 2 semaines",
  hebdo:         "par semaine",
  bimensuel_acc: "aux 2 semaines (accéléré)",
  hebdo_acc:     "par semaine (accéléré)",
};

// ─── Calcul du paiement ───────────────────────────────────────────────────────
function calcPaiement(pret, tauxAnnuel, amort, frequenceKey) {
  if (pret <= 0 || tauxAnnuel <= 0) return 0;
  const freq = FREQUENCES.find(f => f.key === frequenceKey);
  const tauxMensuel = tauxAnnuel / 100 / 12;
  const paiementMensuel = (pret * (tauxMensuel * Math.pow(1 + tauxMensuel, amort * 12))) / (Math.pow(1 + tauxMensuel, amort * 12) - 1);

  if (freq.accelere) {
    // Accéléré = paiement mensuel divisé selon fréquence
    return freq.nbParAn === 26 ? paiementMensuel / 2 : paiementMensuel / 4;
  } else {
    // Paiement normal selon fréquence
    const tauxPeriode = tauxAnnuel / 100 / freq.nbParAn;
    const nbPaiements = amort * freq.nbParAn;
    return (pret * (tauxPeriode * Math.pow(1 + tauxPeriode, nbPaiements))) / (Math.pow(1 + tauxPeriode, nbPaiements) - 1);
  }
}

// ─── Simulation réelle pour calculer le vrai total (surtout pour accéléré) ────
function simuler(pret, tauxAnnuel, paiement, nbParAn) {
  if (pret <= 0 || paiement <= 0) return { totalPaye: 0, totalInteret: 0, anneesReelles: 0 };
  const tauxPeriode = tauxAnnuel / 100 / nbParAn;
  let bal = pret;
  let totalPaye = 0;
  let nb = 0;
  const MAX = nbParAn * 50;
  while (bal > 0.01 && nb < MAX) {
    const interet = bal * tauxPeriode;
    const principal = Math.min(paiement - interet, bal);
    if (principal <= 0) break; // taux trop élevé
    bal -= principal;
    totalPaye += paiement;
    nb++;
  }
  return {
    totalPaye,
    totalInteret: totalPaye - pret,
    anneesReelles: nb / nbParAn,
  };
}

// ─── Composants ───────────────────────────────────────────────────────────────
function AmortChart({ principal, tauxAnnuel, amort }) {
  const W = 500, H = 160, PX = 8, PY = 12;
  const r = tauxAnnuel / 100 / 12;
  const n = amort * 12;
  const pmt = (principal * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
  const balances = [];
  let bal = principal;
  for (let m = 0; m <= n; m += 12) {
    balances.push(bal);
    for (let i = 0; i < 12 && bal > 0; i++) {
      const interest = bal * r;
      bal = Math.max(0, bal - Math.min(pmt - interest, bal));
    }
  }
  if (balances.length < 2) return null;
  const maxV = balances[0] || 1;
  const iW = W - PX * 2, iH = H - PY * 2;
  const x = (i) => PX + (i / (balances.length - 1)) * iW;
  const y = (v) => PY + ((maxV - v) / maxV) * iH;
  const path = balances.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(v)}`).join(" ");
  const area = path + ` L ${x(balances.length - 1)} ${H} L ${PX} ${H} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 160 }}>
      <defs>
        <linearGradient id="mortGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={ACCENT} stopOpacity="0.2" />
          <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#mortGrad)" />
      <path d={path} fill="none" stroke={ACCENT} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const DEFAULT = { prix: 400000, mise: 80000, taux: 4.89, amort: 25, frequence: "mensuel" };

export default function CalculateurHypotheque() {
  const [prix, setPrix] = useState(DEFAULT.prix);
  const [mise, setMise] = useState(DEFAULT.mise);
  const [taux, setTaux] = useState(DEFAULT.taux);
  const [amort, setAmort] = useState(DEFAULT.amort);
  const [frequence, setFrequence] = useState(DEFAULT.frequence);
  const [miseMode, setMiseMode] = useState("$");
  const [tab, setTab] = useState("inputs");

  useSharedParams({
    prix: { setter: setPrix, parser: Number },
    mise: { setter: setMise, parser: Number },
    taux: { setter: setTaux, parser: Number },
    amort: { setter: setAmort, parser: Number },
    frequence: { setter: setFrequence },
  });

  useEffect(() => {
    try {
      const s = localStorage.getItem("hypo:params");
      if (s) {
        const p = JSON.parse(s);
        if (p.prix) setPrix(p.prix);
        if (p.mise) setMise(p.mise);
        if (p.taux) setTaux(p.taux);
        if (p.amort) setAmort(p.amort);
        if (p.frequence) setFrequence(p.frequence);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem("hypo:params", JSON.stringify({ prix, mise, taux, amort, frequence })); } catch {}
  }, [prix, mise, taux, amort, frequence]);

  const pret = Math.max(0, prix - mise);
  const misePct = prix > 0 ? ((mise / prix) * 100).toFixed(1) : 0;
  const schl = mise / prix < 0.2;
  const freqInfo = FREQUENCES.find(f => f.key === frequence) || FREQUENCES[0];
  const paiement = useMemo(() => calcPaiement(pret, taux, amort, frequence), [pret, taux, amort, frequence]);
  const { totalPaye, totalInteret, anneesReelles } = useMemo(() => simuler(pret, taux, paiement, freqInfo.nbParAn), [pret, taux, paiement, freqInfo]);

  // Économie vs mensuel
  const paiementMensuel = useMemo(() => calcPaiement(pret, taux, amort, "mensuel"), [pret, taux, amort]);
  const { totalInteret: totalInteretMensuel } = useMemo(() => simuler(pret, taux, paiementMensuel, 12), [pret, taux, paiementMensuel]);
  const economiAccelere = freqInfo.accelere ? Math.max(0, totalInteretMensuel - totalInteret) : 0;
  const anneesEconomisees = freqInfo.accelere ? Math.max(0, amort - anneesReelles) : 0;

  const tabs = [
    { key: "inputs", label: "Paramètres" },
    { key: "results", label: "Résultats" },
    { key: "info", label: "À savoir" },
  ];

  return (
    <Layout
      title="Calculateur Hypothèque 2026 — Mensualités"
      description="Calculez vos paiements hypothécaires mensuels, comparez taux fixe vs variable et planifiez l'achat de votre propriété au Canada."
      canonical="https://monportefeuille.ca/calculateur-hypotheque"
    >
      <ToolSchema
        name="Calculateur Hypothèque Canada 2026"
        description="Calculez vos paiements hypothécaires mensuels, comparez taux fixe vs variable, visualisez l'amortissement et planifiez l'achat de votre propriété au Canada."
        url="https://monportefeuille.ca/calculateur-hypotheque"
      />
      
      <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", background: "#0D1117", minHeight: "100vh", padding: "2rem 1rem" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>

          <div className="mb-6">
            <div className="text-[10px] text-[#484F58] uppercase tracking-widest mb-1">monportefeuille.ca</div>
            <h1 style={{ fontFamily: "'DM Mono', monospace" }} className="text-3xl font-medium text-[#E6EDF3]">
              Calculateur Hypothèque Canada 2026
            </h1>
            <p className="text-sm text-[#8B949E] leading-relaxed">
              Calculez vos paiements mensuels, comparez taux fixe vs variable et planifiez l'achat de votre propriété
            </p>
          </div>

          {/* Hero */}
          <div className="rounded-2xl p-5 mb-4 relative overflow-hidden" style={{ background: "#161B22", border: "1px solid #21262D" }}>
            <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 80% 50%, ${ACCENT}10 0%, transparent 65%)` }} />
            <div className="relative">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-[10px] text-[#8B949E] uppercase tracking-wide mb-1">Paiement</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", color: ACCENT }} className="text-3xl font-medium">{fmtFull(paiement)}</div>
                  <div className="text-[10px] text-[#484F58] mt-0.5">{FREQ_LABEL[frequence]}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#8B949E] uppercase tracking-wide mb-1">Total intérêts</div>
                  <div style={{ fontFamily: "'DM Mono', monospace" }} className="text-3xl font-medium text-red-400">{fmtFull(totalInteret)}</div>
                  <div className="text-[10px] text-[#484F58] mt-0.5">
                    {freqInfo.accelere ? `sur ${anneesReelles.toFixed(1)} ans` : `sur ${amort} ans`}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#21262D]">
                <div>
                  <div className="text-[10px] text-[#8B949E] uppercase tracking-wide mb-1">Montant emprunté</div>
                  <div style={{ fontFamily: "'DM Mono', monospace" }} className="text-base text-[#E6EDF3] font-medium">{fmtFull(pret)}</div>
                  <div className="text-[10px] text-[#484F58] mt-0.5">Mise de fonds : {misePct}%</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#8B949E] uppercase tracking-wide mb-1">Coût total</div>
                  <div style={{ fontFamily: "'DM Mono', monospace" }} className="text-base text-[#E6EDF3] font-medium">{fmtFull(totalPaye)}</div>
                  <div className="text-[10px] text-[#484F58] mt-0.5">capital + intérêts</div>
                </div>
              </div>
              {schl && (
                <div className="mt-4 bg-orange-500/10 border border-orange-500/25 rounded-xl px-4 py-2.5 text-xs text-orange-400">
                  ⚠️ Mise de fonds sous 20% — assurance SCHL requise (0,6% à 4% du prêt)
                </div>
              )}
              {economiAccelere > 0 && (
                <div className="mt-3 rounded-xl px-4 py-2.5 flex items-center justify-between" style={{ background: "#3DDC9710", border: "1px solid #3DDC9725" }}>
                  <div>
                    <div className="text-xs text-[#3DDC97] font-medium">✦ Économie vs paiement mensuel</div>
                    <div className="text-[10px] text-[#8B949E] mt-0.5">
                      Remboursé {anneesEconomisees.toFixed(1)} ans plus tôt
                    </div>
                  </div>
                  <div style={{ fontFamily: "'DM Mono', monospace" }} className="text-sm text-[#3DDC97] font-medium">{fmtFull(economiAccelere)}</div>
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
            <div className="rounded-2xl p-5 space-y-5" style={{ background: "#161B22", border: "1px solid #21262D" }}>
              <Slider label="Prix d'achat" value={prix} min={100000} max={2000000} step={5000} onChange={setPrix} display={fmtFull(prix)} color={ACCENT} />

              {/* Mise de fonds $ / % */}
              <div className="bg-[#0D1117] rounded-xl p-4 border border-[#21262D] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#8B949E]">Mise de fonds</span>
                  <div className="flex gap-1">
                    <button onClick={() => setMiseMode("$")}
                      className={`text-[10px] px-2 py-0.5 rounded transition-all ${miseMode === "$" ? "bg-[#FB923C] text-[#0D1117] font-bold" : "text-[#8B949E] border border-[#21262D]"}`}>
                      $
                    </button>
                    <button onClick={() => setMiseMode("%")}
                      className={`text-[10px] px-2 py-0.5 rounded transition-all ${miseMode === "%" ? "bg-[#FB923C] text-[#0D1117] font-bold" : "text-[#8B949E] border border-[#21262D]"}`}>
                      %
                    </button>
                  </div>
                </div>
                {miseMode === "$" ? (
                  <Slider label="Montant" value={mise} min={0} max={prix * 0.5} step={1000}
                    onChange={setMise} display={`${fmtFull(mise)} (${misePct}%)`} color={ACCENT} />
                ) : (
                  <Slider label="Pourcentage" value={parseFloat(misePct)} min={0} max={50} step={0.5}
                    onChange={(v) => setMise(Math.round(prix * v / 100))}
                    display={`${parseFloat(misePct).toFixed(1)}% → ${fmtFull(mise)}`} color={ACCENT} />
                )}
              </div>

              <Slider label="Taux d'intérêt" value={taux} min={1} max={12} step={0.05} onChange={setTaux} display={taux.toFixed(2) + "%"} color={ACCENT} />
              <Slider label="Amortissement" value={amort} min={5} max={30} step={1} onChange={setAmort} display={amort + " ans"} color={ACCENT} />

              <div>
                <label className="text-xs text-[#8B949E] block mb-2">Fréquence de paiement</label>
                <div className="grid grid-cols-2 gap-2">
                  {FREQUENCES.map(({ key, label }) => (
                    <button key={key} onClick={() => setFrequence(key)}
                      className="py-2.5 rounded-lg text-xs font-medium transition-colors text-left px-3"
                      style={{ background: frequence === key ? ACCENT : "#21262D", color: frequence === key ? "#0D1117" : "#8B949E" }}>
                      {label}
                    </button>
                  ))}
                </div>
                {freqInfo.accelere && (
                  <div className="text-[10px] text-[#3DDC97] mt-2 bg-[#3DDC9708] rounded-lg px-3 py-2 border border-[#3DDC9720]">
                    ⚡ Paiement = mensuel ÷ {freqInfo.nbParAn === 26 ? "2" : "4"}, versé {freqInfo.nbParAn}x/an — équivaut à un 13e mois de paiement chaque année.
                  </div>
                )}
              </div>

              <button onClick={() => { setTab("results"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="w-full font-bold rounded-xl py-3.5 text-sm tracking-wide transition-colors text-[#0D1117]"
                style={{ background: ACCENT }}>
                Voir mes résultats ↑
              </button>
              <button onClick={() => { setPrix(DEFAULT.prix); setMise(DEFAULT.mise); setTaux(DEFAULT.taux); setAmort(DEFAULT.amort); setFrequence(DEFAULT.frequence); setMiseMode("$"); localStorage.removeItem("hypo:params"); }}
                className="w-full border border-[#21262D] text-[#8B949E] rounded-xl py-3 text-sm hover:border-[#484F58] hover:text-[#E6EDF3] transition-colors">
                Réinitialiser
              </button>
            </div>
          )}

          {/* Results */}
          {tab === "results" && (
            <div className="space-y-3">
              <div className="rounded-2xl p-5" style={{ background: "#161B22", border: "1px solid #21262D" }}>
                <div className="text-xs text-[#8B949E] uppercase tracking-widest mb-4">Détail du prêt</div>
                <div className="space-y-3">
                  {[
                    { label: "Prix d'achat", val: fmtFull(prix), color: "#E6EDF3" },
                    { label: "Mise de fonds", val: `${fmtFull(mise)} (${misePct}%)`, color: "#E6EDF3" },
                    { label: "Montant emprunté", val: fmtFull(pret), color: ACCENT },
                    { label: "Taux d'intérêt", val: taux.toFixed(2) + "%", color: "#E6EDF3" },
                    { label: "Amortissement prévu", val: amort + " ans", color: "#E6EDF3" },
                    { label: "Fréquence", val: freqInfo.label, color: "#E6EDF3" },
                    { label: "Paiement", val: fmtFull(paiement) + " " + FREQ_LABEL[frequence], color: ACCENT },
                    ...(freqInfo.accelere ? [{ label: "Amortissement réel", val: anneesReelles.toFixed(1) + " ans", color: "#3DDC97" }] : []),
                    { label: "Total des intérêts", val: fmtFull(totalInteret), color: "#f87171" },
                    { label: "Coût total", val: fmtFull(totalPaye), color: "#E6EDF3" },
                    ...(economiAccelere > 0 ? [{ label: "Économie vs mensuel", val: fmtFull(economiAccelere), color: "#3DDC97" }] : []),
                  ].map(({ label, val, color }) => (
                    <div key={label} className="flex justify-between items-center py-2 border-b border-[#21262D] last:border-0">
                      <span className="text-xs text-[#8B949E]">{label}</span>
                      <span style={{ fontFamily: "'DM Mono', monospace", color }} className="text-sm font-medium">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl p-5" style={{ background: "#161B22", border: "1px solid #21262D" }}>
                <div className="text-xs text-[#8B949E] uppercase tracking-widest mb-3">Remboursement du capital</div>
                <AmortChart principal={pret} tauxAnnuel={taux} amort={amort} />
                <div className="flex justify-between mt-1 text-[10px] text-[#484F58]">
                  <span>Aujourd'hui</span>
                  <span>{Math.round(amort / 2)} ans</span>
                  <span>{amort} ans</span>
                </div>
              </div>

              {/* Comparaison des 6 fréquences */}
              <div className="rounded-2xl p-5" style={{ background: "#161B22", border: "1px solid #21262D" }}>
                <div className="text-xs text-[#8B949E] uppercase tracking-widest mb-4">Comparaison des fréquences</div>
                {FREQUENCES.map(({ key, label, nbParAn, accelere }) => {
                  const pay = calcPaiement(pret, taux, amort, key);
                  const { totalInteret: ti, anneesReelles: ar } = simuler(pret, taux, pay, nbParAn);
                  const isSelected = key === frequence;
                  return (
                    <div key={key} className={`py-2.5 border-b border-[#21262D] last:border-0 ${isSelected ? "" : "opacity-55"}`}>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-[#8B949E]">{label}</span>
                        <span style={{ fontFamily: "'DM Mono', monospace", color: isSelected ? ACCENT : "#E6EDF3" }} className="text-sm font-medium">{fmtFull(pay)}</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-[#484F58] mt-0.5">
                        <span>Intérêts totaux · {accelere ? ar.toFixed(1) : amort} ans</span>
                        <span style={{ color: isSelected ? "#f87171" : undefined }}>{fmtFull(ti)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Impact mise de fonds */}
              <div className="rounded-2xl p-5" style={{ background: "#161B22", border: "1px solid #21262D" }}>
                <div className="text-xs text-[#8B949E] uppercase tracking-widest mb-4">Impact de la mise de fonds</div>
                {[10, 15, 20, 25].map(pct => {
                  const m = prix * pct / 100;
                  const p = prix - m;
                  const pay = calcPaiement(p, taux, amort, "mensuel");
                  const isSelected = Math.abs(mise / prix * 100 - pct) < 2.5;
                  return (
                    <div key={pct} className={`flex justify-between items-center py-2 border-b border-[#21262D] last:border-0 ${isSelected ? "" : "opacity-55"}`}>
                      <span className="text-xs text-[#8B949E]">Mise {pct}% ({fmtFull(m)})</span>
                      <span style={{ fontFamily: "'DM Mono', monospace", color: isSelected ? ACCENT : "#E6EDF3" }} className="text-sm font-medium">{fmtFull(pay)}/mois</span>
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
                { icon: "⚡", title: "Paiements accélérés — la stratégie gagnante", text: "Les paiements accélérés (aux 2 semaines ou hebdo) équivalent à un 13e mois de paiement par année. Sur un prêt de 400 000$ à 5%, vous pouvez économiser plus de 40 000$ en intérêts et rembourser 3-4 ans plus tôt — sans effort supplémentaire." },
                { icon: "📊", title: "6 fréquences de paiement", text: "Mensuel (12x/an) · Bimensuel (24x/an, soit 2x par mois) · Aux 2 semaines (26x/an) · Hebdomadaire (52x/an) · Aux 2 semaines accéléré (paiement mensuel ÷ 2, 26x/an) · Hebdomadaire accéléré (paiement mensuel ÷ 4, 52x/an)." },
                { icon: "🏠", title: "La règle des 20%", text: "Une mise de fonds d'au moins 20% vous évite l'assurance hypothécaire SCHL, qui peut ajouter entre 0,6% et 4% au montant de votre prêt. Sur une propriété de 500 000$, ça peut représenter jusqu'à 16 000$ de plus." },
                { icon: "📈", title: "Taux fixe vs variable", text: "Un taux fixe garantit le même paiement pour toute la durée du terme (généralement 5 ans). Un taux variable est souvent plus bas au départ mais fluctue avec le taux directeur de la Banque du Canada." },
                { icon: "💡", title: "Magasiner son taux", text: "Les taux hypothécaires varient significativement d'un prêteur à l'autre. Obtenir 2-3 offres avant de signer peut vous économiser des milliers de dollars sur la durée du prêt." },
                { icon: "⚠️", title: "Important", text: "Ce calculateur est éducatif. Les paiements réels peuvent différer selon les conditions exactes de votre prêt, les ajustements de taux et les modalités de remboursement anticipé." },
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

          {/* ─── Guide Hypothèque ─── */}
          <section className="mt-16 max-w-2xl mx-auto px-4 text-justify">
            
            <h2 className="text-2xl font-bold text-[#E6EDF3] mb-6">
              Comment fonctionne un calculateur hypothécaire
            </h2>
            <p className="text-sm text-[#8B949E] leading-relaxed mb-4">
              Un calculateur hypothécaire vous aide à estimer vos paiements mensuels en fonction du prix d'achat, de votre mise de fonds et du taux d'intérêt. Il prend en compte l'amortissement (durée totale du prêt) et calcule la portion qui va vers le capital versus les intérêts. Au Canada, la mise de fonds minimale est de 5% pour un prix jusqu'à 500 000$, mais une mise de fonds de 20% ou plus vous évite l'assurance SCHL, réduisant vos coûts totaux.
            </p>

            <h2 className="text-2xl font-bold text-[#E6EDF3] mb-6 mt-12">
              Taux fixe vs taux variable : lequel choisir en 2026
            </h2>
            <p className="text-sm text-[#8B949E] leading-relaxed mb-4">
              Le taux fixe garantit un paiement stable pendant toute la durée du terme (généralement 5 ans), vous protégeant des hausses de taux. Le taux variable fluctue selon le taux directeur de la Banque du Canada — il peut être plus bas initialement, mais comporte un risque si les taux montent. En 2026, avec les taux qui ont grimpé depuis 2022, plusieurs Canadiens privilégient le fixe pour la prévisibilité budgétaire. Utilisez notre calculateur pour comparer les deux scénarios selon votre tolérance au risque.
            </p>

            <h2 className="text-2xl font-bold text-[#E6EDF3] mb-6 mt-12">
              Impact de la mise de fonds sur vos paiements
            </h2>
            <p className="text-sm text-[#8B949E] leading-relaxed mb-4">
              Plus votre mise de fonds est élevée, plus vos paiements mensuels diminuent — et vous économisez des dizaines de milliers en intérêts sur 25 ans. Avec une mise de fonds de 20% ou plus, vous évitez l'assurance prêt hypothécaire SCHL (2.8% à 4% du montant emprunté). Par exemple, sur une maison de 500 000$ avec 10% de mise de fonds, l'assurance SCHL coûte environ 14 400$ additionnels. Épargner pour atteindre 20% peut sembler long, mais le <a href="/calculateur-celi" className="text-[#3DDC97] underline">CELI</a> ou le nouveau <a href="/calculateur-celi" className="text-[#3DDC97] underline">CELIAPP</a> peuvent accélérer le processus.
            </p>

            <h2 className="text-2xl font-bold text-[#E6EDF3] mb-6 mt-12">
              Questions fréquentes sur l'hypothèque
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#E6EDF3] mb-2">
                  Quelle est la mise de fonds minimale au Canada ?
                </h3>
                <p className="text-sm text-[#8B949E] leading-relaxed">
                  5% pour les premiers 500 000$, puis 10% pour la portion au-dessus de 500 000$. Pour une maison de 700 000$, vous auriez besoin de 5% × 500 000$ (25 000$) + 10% × 200 000$ (20 000$) = 45 000$ minimum. Mais avec 20% de mise de fonds (140 000$), vous évitez l'assurance SCHL.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#E6EDF3] mb-2">
                  C'est quoi l'assurance SCHL et comment l'éviter ?
                </h3>
                <p className="text-sm text-[#8B949E] leading-relaxed">
                  L'assurance prêt hypothécaire SCHL (Société canadienne d'hypothèques et de logement) protège le prêteur si vous faites défaut de paiement. Elle est obligatoire si votre mise de fonds est inférieure à 20%. Le coût varie de 2.8% à 4% du montant emprunté selon votre mise de fonds. Pour l'éviter : épargnez 20% ou utilisez un <a href="/calculateur-celi" className="text-[#3DDC97] underline">CELIAPP</a> pour accélérer.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#E6EDF3] mb-2">
                  Amortissement 25 ans vs 30 ans : quelle différence ?
                </h3>
                <p className="text-sm text-[#8B949E] leading-relaxed">
                  Un amortissement de 30 ans réduit vos paiements mensuels (plus de temps pour rembourser), mais vous payez beaucoup plus d'intérêts au total. Sur un prêt de 400 000$ à 5%, passer de 25 à 30 ans réduit le paiement mensuel d'environ 200$, mais vous coûte 60 000$ de plus en intérêts totaux. Si vous pouvez vous permettre les paiements plus élevés, 25 ans est plus économique.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#E6EDF3] mb-2">
                  Dois-je vérifier ma cote de crédit avant de demander une hypothèque ?
                </h3>
                <p className="text-sm text-[#8B949E] leading-relaxed">
                  Absolument. Les prêteurs utilisent votre cote de crédit pour déterminer votre taux d'intérêt. Une cote de 720+ vous donne accès aux meilleurs taux, tandis qu'une cote sous 650 peut résulter en un taux 1-2% plus élevé — ce qui représente des dizaines de milliers en coûts supplémentaires. Utilisez notre <a href="/estimateur-credit" className="text-[#3DDC97] underline">estimateur de crédit gratuit</a> pour vérifier votre profil sans impact sur votre score.
                </p>
              </div>
            </div>

            <div className="mt-12 p-6 bg-[#161B22] border border-[#21262D] rounded-xl">
              <h3 className="text-base font-bold text-[#E6EDF3] mb-3">
                💡 Outils connexes pour planifier votre achat
              </h3>
              <ul className="text-sm text-[#8B949E] leading-relaxed space-y-2">
                <li>→ <a href="/calculateur-celi" className="text-[#3DDC97] underline">Calculateur CELI</a> : Épargnez pour votre mise de fonds</li>
                <li>→ <a href="/estimateur-credit" className="text-[#3DDC97] underline">Estimateur de crédit</a> : Vérifiez votre profil avant la demande</li>
                <li>→ <a href="/estimateur-impot" className="text-[#3DDC97] underline">Estimateur d'impôt</a> : Calculez votre capacité d'emprunt réelle</li>
              </ul>
            </div>

          </section>

          {/* CTA */}
          <div className="mt-4 bg-[#3B82F6]/06 border border-[#3B82F6]/25 rounded-2xl p-8 text-center">
            <div className="text-3xl mb-3">🏠</div>
            <h3 className="text-xl font-bold text-[#E6EDF3] mb-2">Ouvrez votre CELIAPP avant d'acheter</h3>
            <p className="text-sm text-[#8B949E] mb-6 leading-relaxed max-w-sm mx-auto">
              Le CELIAPP vous permet d'économiser jusqu'à 40 000$ libre d'impôt pour votre première propriété. Cotisez maintenant, déduisez sur vos impôts.
            </p>
            <AffiliateLink href="https://www.wealthsimple.com/invite/EDVQ3W" partner="wealthsimple-celiapp"
              className="inline-block bg-[#3B82F6] text-white font-bold rounded-xl px-8 py-3.5 text-sm tracking-wide hover:bg-[#2563EB] transition-colors no-underline">
              Ouvrir un CELIAPP chez Wealthsimple →
            </AffiliateLink>
            <p className="text-xs text-[#484F58] mt-4">✓ Gratuit · ✓ Déductible d'impôt · ✓ Libre d'impôt au retrait · Lien affilié</p>
          </div>

          <div className="mt-8 rounded-2xl p-5 bg-[#161B22] border border-[#21262D]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-[#E6EDF3] mb-1">Partagez cette simulation</h3>
                <p className="text-xs text-[#8B949E]">Envoyez le lien à un ami ou sauvegardez vos calculs</p>
              </div>
              <div className="hover:opacity-80 transition-opacity duration-200 cursor-pointer">
                <ShareButton params={{ prix, mise, taux, amort, frequence }} color="#FB923C" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}