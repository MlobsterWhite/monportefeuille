import { useState, useEffect } from "react";
import AffiliateLink from "./AffiliateLink";

// ── Data ────────────────────────────────────────────────────────────────────

const ASSET_GROUPS = [
  { label: "Liquidités",          color: "#60A5FA", keys: ["cash", "savings"] },
  { label: "Comptes enregistrés", color: "#F0A500", keys: ["celi", "reer", "celiapp", "reee", "ferr"] },
  { label: "Investissements",     color: "#3DDC97", keys: ["investments", "crypto"] },
  { label: "Biens",               color: "#FB923C", keys: ["realEstate", "vehicle", "otherAsset"] },
];

const LIABILITY_GROUPS = [
  { label: "Immobilier",       keys: ["mortgage"] },
  { label: "Véhicule",        keys: ["carLoan"] },
  { label: "Dettes courantes", keys: ["creditCards", "ligneCredit", "studentLoan", "otherLiability"] },
];

const ASSET_KEYS     = ASSET_GROUPS.flatMap(g => g.keys);
const LIABILITY_KEYS = LIABILITY_GROUPS.flatMap(g => g.keys);

const LABELS = {
  // Actifs
  cash: "Argent comptant", savings: "Compte épargne",
  celi: "CELI", reer: "REER", celiapp: "CELIAPP", reee: "REEE", ferr: "FERR",
  investments: "Investissements non-enregistrés", crypto: "Cryptomonnaies",
  realEstate: "Immobilier", vehicle: "Véhicule(s)", otherAsset: "Autre actif",
  // Passifs
  mortgage: "Hypothèque", carLoan: "Prêt auto",
  creditCards: "Cartes de crédit", ligneCredit: "Ligne de crédit",
  studentLoan: "Prêt étudiant", otherLiability: "Autre passif",
};

const PLACEHOLDERS = {
  cash: "2 500", savings: "8 000",
  celi: "45 000", reer: "30 000", celiapp: "20 000", reee: "15 000", ferr: "0",
  investments: "15 000", crypto: "5 000",
  realEstate: "350 000", vehicle: "18 000", otherAsset: "5 000",
  mortgage: "280 000", carLoan: "12 000",
  creditCards: "3 500", ligneCredit: "0", studentLoan: "0", otherLiability: "0",
};

// Benchmarks canadiens par ménage — Enquête sur la sécurité financière, Statistique Canada
// Données 2019 ajustées pour tenir compte de l'appréciation immobilière 2019–2023
// Note : ces chiffres représentent la valeur nette PAR MÉNAGE, pas par individu
const BENCHMARKS = {
  25: { median:  28_000, p75:   85_000 },
  30: { median:  68_000, p75:  180_000 },
  35: { median: 200_000, p75:  480_000 },
  40: { median: 350_000, p75:  720_000 },
  45: { median: 520_000, p75: 1_050_000 },
  50: { median: 700_000, p75: 1_350_000 },
  55: { median: 870_000, p75: 1_650_000 },
  60: { median: 980_000, p75: 1_900_000 },
  65: { median: 870_000, p75: 1_700_000 },
};

// Interpolation linéaire entre les paliers pour éviter l'effet d'escalier
function getBenchmark(age) {
  const keys = Object.keys(BENCHMARKS).map(Number).sort((a, b) => a - b);
  const clamped = Math.min(Math.max(age, keys[0]), keys[keys.length - 1]);
  if (clamped <= keys[0]) return BENCHMARKS[keys[0]];
  if (clamped >= keys[keys.length - 1]) return BENCHMARKS[keys[keys.length - 1]];
  const lower = keys.findLast(k => k <= clamped);
  const upper = keys.find(k => k > clamped);
  const t = (clamped - lower) / (upper - lower);
  return {
    median: Math.round(BENCHMARKS[lower].median + t * (BENCHMARKS[upper].median - BENCHMARKS[lower].median)),
    p75:    Math.round(BENCHMARKS[lower].p75    + t * (BENCHMARKS[upper].p75    - BENCHMARKS[lower].p75)),
  };
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n) => {
  const abs = Math.abs(n || 0);
  return (n < 0 ? "-$" : "$") + abs.toLocaleString("fr-CA", { maximumFractionDigits: 0 });
};

const parse = (v) => Math.max(0, parseFloat(String(v).replace(/[^\d.]/g, "")) || 0);

const EMPTY_ASSETS      = Object.fromEntries(ASSET_KEYS.map(k => [k, ""]));
const EMPTY_LIABILITIES = Object.fromEntries(LIABILITY_KEYS.map(k => [k, ""]));

// ── Sub-components ───────────────────────────────────────────────────────────

function NumberInput({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#484F58] pointer-events-none">$</span>
      <input
        type="number"
        min="0"
        step="100"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#0D1117] border border-[#21262D] rounded-lg pl-7 pr-3 py-2.5 text-[#E6EDF3] text-sm focus:outline-none focus:border-[#3DDC97] transition-colors placeholder-[#484F58]"
      />
    </div>
  );
}

function DistributionBar({ assets }) {
  const groups = ASSET_GROUPS.map(g => ({
    label: g.label,
    color: g.color,
    value: g.keys.reduce((s, k) => s + parse(assets[k]), 0),
  })).filter(g => g.value > 0);

  const total = groups.reduce((s, g) => s + g.value, 0);
  if (total === 0) return null;

  return (
    <div className="mt-4">
      <div className="flex rounded-full overflow-hidden h-1.5" style={{ gap: 2 }}>
        {groups.map(g => (
          <div
            key={g.label}
            style={{ width: `${(g.value / total) * 100}%`, background: g.color, borderRadius: 9999 }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2.5">
        {groups.map(g => (
          <div key={g.label} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: g.color }} />
            <span className="text-[10px] text-[#8B949E]">{g.label}</span>
            <span className="text-[10px] text-[#484F58]">{Math.round((g.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HistoryChart({ snapshots }) {
  if (snapshots.length < 2) return null;
  const values = snapshots.map(s => s.netWorth);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const W = 400, H = 100, PX = 16, PY = 12;
  const iW = W - PX * 2, iH = H - PY * 2;

  const x = (i) => PX + (i / (values.length - 1)) * iW;
  const y = (v) => PY + ((max - v) / range) * iH;

  const pathD = values.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(v)}`).join(" ");
  const areaD = `${pathD} L ${x(values.length - 1)} ${H} L ${PX} ${H} Z`;
  const trend = values[values.length - 1] >= values[0];
  const color = trend ? "#3DDC97" : "#f87171";

  return (
    <div>
      <div className="text-[10px] text-[#8B949E] uppercase tracking-widest mb-3">Évolution dans le temps</div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 90 }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#areaGrad)" />
        <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {values.map((v, i) => (
          <circle key={i} cx={x(i)} cy={y(v)} r="3.5" fill={color} />
        ))}
      </svg>
      <div className="flex justify-between mt-1">
        {snapshots.map(s => (
          <span key={s.id} className="text-[10px] text-[#484F58] truncate max-w-[80px]">{s.name}</span>
        ))}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function NetWorthTracker() {
  const [tab, setTab]               = useState("actifs");
  const [age, setAge]               = useState(35);
  const [assets, setAssets]         = useState(EMPTY_ASSETS);
  const [liabilities, setLiabilities] = useState(EMPTY_LIABILITIES);
  const [snapshots, setSnapshots]   = useState([]);
  const [snapshotName, setSnapshotName] = useState("");
  const [notif, setNotif]           = useState(null);
  const [showBenchmark, setShowBenchmark] = useState(true);

  // ── Persist ──────────────────────────────────────────────────────────────

  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem("networth:params") || "{}");
      if (p.assets)      setAssets(p.assets);
      if (p.liabilities) setLiabilities(p.liabilities);
      if (p.age)         setAge(p.age);
      if (p.showBenchmark === false) setShowBenchmark(false);
      const snaps = JSON.parse(localStorage.getItem("networth:snapshots") || "[]");
      setSnapshots(snaps);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("networth:params", JSON.stringify({ assets, liabilities, age, showBenchmark }));
    } catch {}
  }, [assets, liabilities, age, showBenchmark]);

  // ── Calculations ──────────────────────────────────────────────────────────

  const totalAssets      = ASSET_KEYS.reduce((s, k) => s + parse(assets[k]), 0);
  const totalLiabilities = LIABILITY_KEYS.reduce((s, k) => s + parse(liabilities[k]), 0);
  const netWorth         = totalAssets - totalLiabilities;
  const isPositive       = netWorth >= 0;
  const benchmark        = getBenchmark(age);
  const vsMedian         = netWorth - benchmark.median;

  // ── Actions ───────────────────────────────────────────────────────────────

  const notify = (msg, ok = true) => {
    setNotif({ msg, ok });
    setTimeout(() => setNotif(null), 3500);
  };

  const importValue = (key, storageKey, label) => {
    try {
      const val = localStorage.getItem(storageKey);
      if (val) {
        setAssets(p => ({ ...p, [key]: val }));
        notify(`✓ Valeur ${label} importée depuis le calculateur`, true);
      } else {
        notify(`Calculateur ${label} non connecté — entrez la valeur manuellement`, false);
      }
    } catch {
      notify(`Calculateur ${label} non connecté — entrez la valeur manuellement`, false);
    }
  };

  const saveSnapshot = () => {
    if (!snapshotName.trim()) return;
    const snapshot = {
      id:             Date.now(),
      name:           snapshotName.trim(),
      date:           new Date().toISOString(),
      netWorth,
      totalAssets,
      totalLiabilities,
    };
    const updated = [...snapshots, snapshot];
    setSnapshots(updated);
    localStorage.setItem("networth:snapshots", JSON.stringify(updated));
    setSnapshotName("");
    notify("✓ Relevé sauvegardé", true);
  };

  const deleteSnapshot = (id) => {
    const updated = snapshots.filter(s => s.id !== id);
    setSnapshots(updated);
    localStorage.setItem("networth:snapshots", JSON.stringify(updated));
  };

  const resetAll = () => {
    setAssets(EMPTY_ASSETS);
    setLiabilities(EMPTY_LIABILITIES);
    notify("Données effacées", true);
  };

  const setAsset     = (k) => (v) => setAssets(p => ({ ...p, [k]: v }));
  const setLiability = (k) => (v) => setLiabilities(p => ({ ...p, [k]: v }));

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-2xl mx-auto px-4 pb-24 pt-8">

      {/* Page header */}
      <div className="text-center mb-8">
        <div className="inline-block bg-[#60A5FA]/10 border border-[#60A5FA]/20 rounded-full px-4 py-1 text-xs text-[#60A5FA] uppercase tracking-widest mb-4">
          Bilan financier personnel
        </div>
        <h1 className="text-3xl font-bold text-[#E6EDF3] mb-2">
          Calculateur de valeur nette
        </h1>
        <p className="text-sm text-[#8B949E] font-light">
          Additionnez vos actifs, soustrayez vos dettes — connaissez votre richesse réelle.
        </p>
      </div>

      {/* ── Summary card ── */}
      <div className="rounded-2xl p-6 mb-4 relative overflow-hidden border"
        style={{
          background: "#161B22",
          borderColor: "#21262D",
        }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 75% 40%, ${isPositive ? "rgba(61,220,151,0.06)" : "rgba(248,113,113,0.06)"} 0%, transparent 60%)`,
          }}
        />
        <div className="relative">
          {/* Net worth */}
          <div className="mb-5">
            <div className="text-[10px] text-[#8B949E] uppercase tracking-widest mb-1">Valeur nette totale</div>
            <div
              className={`text-5xl font-semibold tracking-tight ${isPositive ? "text-[#3DDC97]" : "text-red-400"}`}
              style={{ fontFamily: "var(--font-dm-mono, monospace)" }}
            >
              {fmt(netWorth)}
            </div>
          </div>

          {/* Assets / Liabilities split */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#21262D] mb-4">
            <div>
              <div className="text-[10px] text-[#8B949E] uppercase tracking-widest mb-1">Total actifs</div>
              <div className="text-xl text-[#3DDC97] font-medium" style={{ fontFamily: "var(--font-dm-mono, monospace)" }}>
                {fmt(totalAssets)}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-[#8B949E] uppercase tracking-widest mb-1">Total dettes</div>
              <div className="text-xl text-red-400 font-medium" style={{ fontFamily: "var(--font-dm-mono, monospace)" }}>
                {fmt(totalLiabilities)}
              </div>
            </div>
          </div>

          {/* Distribution bar */}
          <DistributionBar assets={assets} />
        </div>
      </div>

      {/* Notification */}
      {notif && (
        <div className={`text-xs rounded-xl px-4 py-2.5 mb-4 border transition-all ${
          notif.ok
            ? "bg-[#3DDC97]/10 border-[#3DDC97]/25 text-[#3DDC97]"
            : "bg-red-500/10 border-red-500/20 text-red-400"
        }`}>
          {notif.msg}
        </div>
      )}

      {/* ── Tab nav ── */}
      <div className="flex gap-1 mb-4 bg-[#161B22] border border-[#21262D] rounded-xl p-1">
        {[
          { key: "actifs",     label: "Actifs" },
          { key: "passifs",    label: "Passifs" },
          { key: "historique", label: "Historique" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 text-xs py-2 rounded-lg transition-all font-medium ${
              tab === key ? "bg-[#21262D] text-[#E6EDF3]" : "text-[#8B949E] hover:text-[#C9D1D9]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Actifs tab ── */}
      {tab === "actifs" && (
        <div className="space-y-3">
          {ASSET_GROUPS.map(group => (
            <div key={group.label} className="bg-[#161B22] border border-[#21262D] rounded-2xl overflow-hidden">
              {/* Group header */}
              <div className="flex items-center gap-2 px-5 py-3 border-b border-[#21262D]">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: group.color }} />
                <span className="text-[10px] uppercase tracking-widest font-medium" style={{ color: group.color }}>
                  {group.label}
                </span>
                <span className="ml-auto text-xs font-medium" style={{ fontFamily: "var(--font-dm-mono, monospace)", color: group.color }}>
                  {fmt(group.keys.reduce((s, k) => s + parse(assets[k]), 0))}
                </span>
              </div>

              {/* Fields */}
              <div className="p-5 space-y-4">
                {group.keys.map(k => (
                  <div key={k}>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs text-[#8B949E]">{LABELS[k]}</label>
                      {/* Import buttons for registered accounts */}
                      {k === "celi" && (
                        <button
                          onClick={() => importValue("celi", "celi:projected", "CELI")}
                          className="text-[10px] text-[#F0A500] hover:text-[#D4940A] transition-colors font-medium"
                        >
                          ↓ Importer du calculateur
                        </button>
                      )}
                      {k === "reer" && (
                        <button
                          onClick={() => importValue("reer", "reer:projected", "REER")}
                          className="text-[10px] text-[#F0A500] hover:text-[#D4940A] transition-colors font-medium"
                        >
                          ↓ Importer du calculateur
                        </button>
                      )}
                      {k === "ferr" && (
                        <span className="text-[10px] text-[#484F58]">Conversion du REER à 71 ans</span>
                      )}
                      {k === "reee" && (
                        <span className="text-[10px] text-[#484F58]">Régime épargne-études</span>
                      )}
                    </div>
                    <NumberInput
                      value={assets[k]}
                      onChange={setAsset(k)}
                      placeholder={PLACEHOLDERS[k]}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Total + reset */}
          <div className="flex justify-between items-center pt-1">
            <button
              onClick={resetAll}
              className="text-xs text-[#484F58] hover:text-red-400 transition-colors"
            >
              Tout effacer
            </button>
            <div className="text-sm text-[#3DDC97] font-medium" style={{ fontFamily: "var(--font-dm-mono, monospace)" }}>
              Total actifs: {fmt(totalAssets)}
            </div>
          </div>
        </div>
      )}

      {/* ── Passifs tab ── */}
      {tab === "passifs" && (
        <div className="space-y-3">
          {LIABILITY_GROUPS.map(group => (
            <div key={group.label} className="bg-[#161B22] border border-[#21262D] rounded-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-[#21262D]">
                <div className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                <span className="text-[10px] uppercase tracking-widest font-medium text-red-400">
                  {group.label}
                </span>
                <span className="ml-auto text-xs font-medium text-red-400" style={{ fontFamily: "var(--font-dm-mono, monospace)" }}>
                  {fmt(group.keys.reduce((s, k) => s + parse(liabilities[k]), 0))}
                </span>
              </div>
              <div className="p-5 space-y-4">
                {group.keys.map(k => (
                  <div key={k}>
                    <label className="text-xs text-[#8B949E] block mb-1.5">{LABELS[k]}</label>
                    <NumberInput
                      value={liabilities[k]}
                      onChange={setLiability(k)}
                      placeholder={PLACEHOLDERS[k]}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-end pt-1">
            <div className="text-sm text-red-400 font-medium" style={{ fontFamily: "var(--font-dm-mono, monospace)" }}>
              Total dettes: {fmt(totalLiabilities)}
            </div>
          </div>
        </div>
      )}

      {/* ── Historique tab ── */}
      {tab === "historique" && (
        <div className="space-y-3">
          {snapshots.length === 0 ? (
            <div className="bg-[#161B22] border border-[#21262D] rounded-2xl p-10 text-center">
              <div className="text-4xl mb-4">📊</div>
              <p className="text-sm text-[#8B949E] leading-relaxed font-light max-w-xs mx-auto">
                Aucun relevé sauvegardé. Remplissez vos données et sauvegardez votre premier bilan.
              </p>
            </div>
          ) : (
            <>
              {snapshots.length >= 2 && (
                <div className="bg-[#161B22] border border-[#21262D] rounded-2xl p-5">
                  <HistoryChart snapshots={snapshots} />
                </div>
              )}
              <div className="space-y-2">
                {[...snapshots].reverse().map(s => (
                  <div
                    key={s.id}
                    className="bg-[#161B22] border border-[#21262D] rounded-xl px-4 py-3.5 flex justify-between items-center"
                  >
                    <div>
                      <div className="text-sm text-[#E6EDF3] font-medium">{s.name}</div>
                      <div className="text-[10px] text-[#484F58] mt-0.5">
                        {new Date(s.date).toLocaleDateString("fr-CA", { day: "numeric", month: "long", year: "numeric" })}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`text-sm font-medium ${s.netWorth >= 0 ? "text-[#3DDC97]" : "text-red-400"}`}
                        style={{ fontFamily: "var(--font-dm-mono, monospace)" }}
                      >
                        {fmt(s.netWorth)}
                      </span>
                      <button
                        onClick={() => deleteSnapshot(s.id)}
                        className="text-[#484F58] hover:text-red-400 transition-colors text-sm"
                        aria-label="Supprimer"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Save snapshot ── */}
      <div className="mt-4 bg-[#161B22] border border-[#21262D] rounded-2xl p-5">
        <div className="text-xs text-[#8B949E] mb-3 font-medium">Sauvegarder un relevé</div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Nom du relevé (ex: Mai 2026)"
            value={snapshotName}
            onChange={(e) => setSnapshotName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && saveSnapshot()}
            className="flex-1 bg-[#0D1117] border border-[#21262D] rounded-lg px-3 py-2.5 text-[#E6EDF3] text-sm focus:outline-none focus:border-[#3DDC97] transition-colors placeholder-[#484F58]"
          />
          <button
            onClick={saveSnapshot}
            className="bg-[#3DDC97] text-[#0D1117] text-xs font-bold rounded-lg px-4 py-2.5 hover:bg-[#2bc47e] transition-colors whitespace-nowrap"
          >
            Sauvegarder
          </button>
        </div>
      </div>

      {/* ── Benchmark ── */}
      {!showBenchmark ? (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setShowBenchmark(true)}
            className="text-xs text-[#484F58] hover:text-[#8B949E] transition-colors underline underline-offset-2"
          >
            Afficher la comparaison avec mon groupe d'âge
          </button>
        </div>
      ) : (
        <div className="mt-4 bg-[#60A5FA]/10 border border-[#60A5FA]/25 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <span className="text-xl mt-0.5">📊</span>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-[#E6EDF3]">Comparez-vous à votre groupe d'âge</h3>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#8B949E]">Âge</span>
                  <input
                    type="number"
                    min="18"
                    max="75"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value) || 35)}
                    className="w-14 bg-[#0D1117] border border-[#21262D] rounded-lg px-2 py-1 text-xs text-[#E6EDF3] text-center focus:outline-none focus:border-[#60A5FA]"
                  />
                </div>
              </div>
              <div className="text-xs text-[#8B949E] space-y-2">
                <div className="flex justify-between items-center">
                  <span>Médiane canadienne ({age} ans, par ménage)</span>
                  <span className="text-[#E6EDF3] font-medium" style={{ fontFamily: "var(--font-dm-mono, monospace)" }}>
                    {fmt(benchmark.median)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Votre valeur nette</span>
                  <span
                    className={`font-medium ${netWorth >= benchmark.median ? "text-[#3DDC97]" : "text-[#F0A500]"}`}
                    style={{ fontFamily: "var(--font-dm-mono, monospace)" }}
                  >
                    {fmt(netWorth)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-[#60A5FA]/20">
                  <span>Différence vs médiane</span>
                  <span
                    className={`font-medium ${vsMedian >= 0 ? "text-[#3DDC97]" : "text-red-400"}`}
                    style={{ fontFamily: "var(--font-dm-mono, monospace)" }}
                  >
                    {vsMedian >= 0 ? "+" : ""}{fmt(vsMedian)}
                  </span>
                </div>
              </div>
              {totalAssets > 0 && (
                <div className="mt-3 pt-3 border-t border-[#60A5FA]/20 text-[10px] text-[#8B949E] leading-relaxed">
                  {vsMedian >= 0
                    ? `✓ Vous êtes au-dessus de la médiane canadienne pour votre groupe d'âge.${netWorth >= benchmark.p75 ? " Vous faites partie du top 25% !" : ""}`
                    : "💡 Augmentez vos actifs enregistrés (CELI, REER) ou réduisez vos dettes pour améliorer votre situation."}
                </div>
              )}
              <div className="mt-4 pt-3 border-t border-[#60A5FA]/20 flex items-center justify-between">
                <p className="text-[10px] text-[#484F58]">
                  Source : Statistique Canada, ESF 2019 (ajusté 2023) · Valeurs par ménage
                </p>
                <button
                  onClick={() => setShowBenchmark(false)}
                  className="text-[10px] text-[#484F58] hover:text-[#8B949E] transition-colors underline underline-offset-2 whitespace-nowrap ml-4"
                >
                  Cela ne m'intéresse pas
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CTA Wealthsimple ── */}
      {netWorth < 100_000 && (
        <div className="mt-4 bg-[#161B22] border border-[#21262D] rounded-2xl p-6">
          <div className="flex items-start gap-3 mb-4">
            <span className="text-xl">💡</span>
            <div>
              <h3 className="text-sm font-medium text-[#E6EDF3] mb-1.5">Augmentez votre valeur nette</h3>
              <p className="text-xs text-[#8B949E] leading-relaxed font-light">
                Commencez à investir avec aussi peu que 1$ dans un CELI chez Wealthsimple Trade — 0$ de commissions sur les FNB canadiens.
                Vos placements croissent à l'abri de l'impôt et augmentent directement votre valeur nette.
              </p>
            </div>
          </div>
          <AffiliateLink href="https://www.wealthsimple.com/invite/EDVQ3W" partner="wealthsimple-networth">
            <button className="w-full bg-[#3DDC97] text-[#0D1117] font-medium rounded-xl py-3 text-sm hover:opacity-90 transition-opacity">
              Ouvrir un compte gratuit →
            </button>
          </AffiliateLink>
          <p className="text-[10px] text-[#484F58] text-center mt-3">
            Lien affilié — monportefeuille.ca reçoit une commission, sans frais pour vous.
          </p>
        </div>
      )}

      {/* Privacy note */}
      <p className="text-[10px] text-[#484F58] text-center mt-6 leading-relaxed">
        Les données sont sauvegardées localement dans votre navigateur.{" "}
        Rien n'est envoyé à nos serveurs.
      </p>
    </div>
  );
}
