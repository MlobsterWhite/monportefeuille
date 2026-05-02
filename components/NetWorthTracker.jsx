import { useState, useEffect } from "react";

const LANG = {
  fr: {
    toggle: "EN", brand: "monportefeuille.ca",
    title: "Valeur Nette", subtitle: "Votre bilan financier personnel",
    netWorth: "Valeur nette totale", totalAssets: "Total actifs", totalLiabilities: "Total passifs",
    assets: "Actifs", liabilities: "Passifs", history: "Historique",
    importCELI: "↓ Importer valeur CELI projetée",
    importedOk: "✓ Valeur CELI importée depuis le calculateur",
    importedFail: "Calculateur CELI non connecté — entrez la valeur manuellement",
    saveTitle: "Sauvegarder un relevé",
    snapshotPlaceholder: "Nom du relevé (ex: Mai 2026)",
    saveBtn: "Sauvegarder",
    savedOk: "✓ Relevé sauvegardé",
    noHistory: "Aucun relevé sauvegardé. Remplissez vos données et sauvegardez votre premier bilan.",
    evolution: "Évolution de la valeur nette",
    cat: {
      celi: "CELI", reer: "REER", savings: "Compte épargne", investments: "Investissements",
      realEstate: "Immobilier", vehicle: "Véhicule(s)", otherAsset: "Autre actif",
      mortgage: "Hypothèque", carLoan: "Prêt auto", creditCards: "Cartes de crédit",
      studentLoan: "Prêt étudiant", otherLiability: "Autre passif",
    },
    ph: {
      celi: "Ex: 45 000", reer: "Ex: 30 000", savings: "Ex: 8 000", investments: "Ex: 15 000",
      realEstate: "Ex: 350 000", vehicle: "Ex: 18 000", otherAsset: "Ex: 5 000",
      mortgage: "Ex: 280 000", carLoan: "Ex: 12 000", creditCards: "Ex: 3 500",
      studentLoan: "Ex: 0", otherLiability: "Ex: 0",
    },
  },
  en: {
    toggle: "FR", brand: "monportefeuille.ca",
    title: "Net Worth", subtitle: "Your personal financial balance sheet",
    netWorth: "Total net worth", totalAssets: "Total assets", totalLiabilities: "Total liabilities",
    assets: "Assets", liabilities: "Liabilities", history: "History",
    importCELI: "↓ Import projected TFSA value",
    importedOk: "✓ TFSA value imported from calculator",
    importedFail: "TFSA calculator not connected — enter value manually",
    saveTitle: "Save a snapshot",
    snapshotPlaceholder: "Snapshot name (e.g. May 2026)",
    saveBtn: "Save",
    savedOk: "✓ Snapshot saved",
    noHistory: "No snapshots yet. Fill in your data and save your first balance sheet.",
    evolution: "Net worth over time",
    cat: {
      celi: "TFSA", reer: "RRSP", savings: "Savings account", investments: "Investments",
      realEstate: "Real estate", vehicle: "Vehicle(s)", otherAsset: "Other asset",
      mortgage: "Mortgage", carLoan: "Car loan", creditCards: "Credit cards",
      studentLoan: "Student loan", otherLiability: "Other liability",
    },
    ph: {
      celi: "e.g. 45,000", reer: "e.g. 30,000", savings: "e.g. 8,000", investments: "e.g. 15,000",
      realEstate: "e.g. 350,000", vehicle: "e.g. 18,000", otherAsset: "e.g. 5,000",
      mortgage: "e.g. 280,000", carLoan: "e.g. 12,000", creditCards: "e.g. 3,500",
      studentLoan: "e.g. 0", otherLiability: "e.g. 0",
    },
  },
};

const ASSET_KEYS = ["celi", "reer", "savings", "investments", "realEstate", "vehicle", "otherAsset"];
const LIABILITY_KEYS = ["mortgage", "carLoan", "creditCards", "studentLoan", "otherLiability"];

const fmt = (n) => {
  const abs = Math.abs(n || 0);
  return (n < 0 ? "-$" : "$") + abs.toLocaleString("fr-CA", { maximumFractionDigits: 0 });
};

const parse = (v) => parseFloat(String(v).replace(/[^\d.]/g, "")) || 0;

function HistoryChart({ snapshots, lang }) {
  if (snapshots.length < 2) return null;
  const values = snapshots.map((s) => s.netWorth);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const W = 400, H = 100, PX = 16, PY = 12;
  const iW = W - PX * 2, iH = H - PY * 2;

  const x = (i) => PX + (i / (values.length - 1)) * iW;
  const y = (v) => PY + ((max - v) / range) * iH;

  const pathD = values.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(v)}`).join(" ");
  const areaD = pathD + ` L ${x(values.length - 1)} ${H} L ${PX} ${H} Z`;

  const trend = values[values.length - 1] >= values[0];
  const color = trend ? "#3DDC97" : "#f87171";

  return (
    <div>
      <div className="text-xs text-[#8B949E] mb-3 uppercase tracking-widest">
        {lang === "fr" ? "Évolution" : "Timeline"}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 100 }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
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
        {snapshots.map((s) => (
          <span key={s.id} className="text-[10px] text-[#484F58]">{s.name}</span>
        ))}
      </div>
    </div>
  );
}

function NumberInput({ value, onChange, placeholder }) {
  return (
    <input
      type="number"
      min="0"
      step="100"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-[#0D1117] border border-[#21262D] rounded-lg px-3 py-2.5 text-[#E6EDF3] text-sm focus:outline-none focus:border-[#3DDC97] transition-colors placeholder-[#484F58]"
    />
  );
}

export default function NetWorthTracker() {
  const [lang, setLang] = useState("fr");
  const [tab, setTab] = useState("assets");
  const [assets, setAssets] = useState(Object.fromEntries(ASSET_KEYS.map((k) => [k, ""])));
  const [liabilities, setLiabilities] = useState(Object.fromEntries(LIABILITY_KEYS.map((k) => [k, ""])));
  const [snapshots, setSnapshots] = useState([]);
  const [snapshotName, setSnapshotName] = useState("");
  const [notif, setNotif] = useState(null);

  const t = LANG[lang];
  const totalAssets = ASSET_KEYS.reduce((s, k) => s + parse(assets[k]), 0);
  const totalLiabilities = LIABILITY_KEYS.reduce((s, k) => s + parse(liabilities[k]), 0);
  const netWorth = totalAssets - totalLiabilities;
  const isPositive = netWorth >= 0;

  useEffect(() => {
    try {
      const saved = localStorage.getItem("networth:snapshots");
      if (saved) setSnapshots(JSON.parse(saved));
    } catch {}
  }, []);

  const notify = (msg, ok = true) => {
    setNotif({ msg, ok });
    setTimeout(() => setNotif(null), 3500);
  };

  const importCELI = () => {
    try {
      const val = localStorage.getItem("celi:projected");
      if (val) {
        setAssets((p) => ({ ...p, celi: val }));
        notify(t.importedOk, true);
      } else {
        notify(t.importedFail, false);
      }
    } catch {
      notify(t.importedFail, false);
    }
  };

  const saveSnapshot = () => {
    const name =
      snapshotName.trim() ||
      new Date().toLocaleDateString(lang === "fr" ? "fr-CA" : "en-CA", { month: "short", year: "numeric" });
    const snap = { id: Date.now(), date: new Date().toISOString(), name, totalAssets, totalLiabilities, netWorth };
    const updated = [...snapshots, snap];
    try {
      localStorage.setItem("networth:snapshots", JSON.stringify(updated));
      setSnapshots(updated);
      setSnapshotName("");
      notify(t.savedOk, true);
    } catch {}
  };

  const deleteSnapshot = (id) => {
    const updated = snapshots.filter((s) => s.id !== id);
    try {
      localStorage.setItem("networth:snapshots", JSON.stringify(updated));
      setSnapshots(updated);
    } catch {}
  };

  const setAsset = (k) => (v) => setAssets((p) => ({ ...p, [k]: v }));
  const setLiability = (k) => (v) => setLiabilities((p) => ({ ...p, [k]: v }));

  const tabs = [
    { key: "assets", label: t.assets },
    { key: "liabilities", label: t.liabilities },
    { key: "history", label: t.history },
  ];

  return (
    <div
      style={{
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
        background: "#0D1117",
        minHeight: "100vh",
        padding: "1.5rem 1rem",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
      `}</style>

      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="text-[10px] text-[#484F58] tracking-widest uppercase mb-1">{t.brand}</div>
            <h1
              style={{ fontFamily: "'DM Mono', monospace" }}
              className="text-2xl font-medium text-[#E6EDF3] leading-tight"
            >
              {t.title}
            </h1>
            <p className="text-xs text-[#8B949E] mt-0.5">{t.subtitle}</p>
          </div>
          <button
            onClick={() => setLang(lang === "fr" ? "en" : "fr")}
            className="text-xs border border-[#21262D] text-[#8B949E] rounded-lg px-3 py-1.5 hover:border-[#3DDC97] hover:text-[#3DDC97] transition-all mt-1"
          >
            {t.toggle}
          </button>
        </div>

        {/* Hero card */}
        <div
          className="rounded-2xl p-6 mb-4 relative overflow-hidden"
          style={{
            background: "#161B22",
            border: "1px solid #21262D",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at 85% 40%, ${isPositive ? "rgba(61,220,151,0.08)" : "rgba(248,113,113,0.06)"} 0%, transparent 65%)`,
            }}
          />
          <div className="relative">
            <div className="text-[10px] text-[#8B949E] uppercase tracking-widest mb-2">{t.netWorth}</div>
            <div
              style={{ fontFamily: "'DM Mono', monospace" }}
              className={`text-5xl font-medium mb-5 transition-all ${isPositive ? "text-[#3DDC97]" : "text-red-400"}`}
            >
              {fmt(netWorth)}
            </div>
            <div className="flex gap-6">
              <div>
                <div className="text-[10px] text-[#8B949E] uppercase tracking-wide mb-0.5">{t.totalAssets}</div>
                <div style={{ fontFamily: "'DM Mono', monospace" }} className="text-sm text-[#E6EDF3]">
                  {fmt(totalAssets)}
                </div>
              </div>
              <div className="text-[#21262D] self-center text-lg">−</div>
              <div>
                <div className="text-[10px] text-[#8B949E] uppercase tracking-wide mb-0.5">{t.totalLiabilities}</div>
                <div style={{ fontFamily: "'DM Mono', monospace" }} className="text-sm text-red-400">
                  {fmt(totalLiabilities)}
                </div>
              </div>
            </div>

            {/* Progress bar */}
            {totalAssets > 0 && (
              <div className="mt-4">
                <div className="h-1.5 bg-[#21262D] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (totalAssets > 0 ? (netWorth / totalAssets) * 100 : 0))}%`,
                      background: isPositive
                        ? "linear-gradient(90deg, #2bc47e, #3DDC97)"
                        : "linear-gradient(90deg, #ef4444, #f87171)",
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Notification */}
        {notif && (
          <div
            className={`text-xs rounded-xl px-4 py-2.5 mb-4 border transition-all ${
              notif.ok
                ? "bg-[#3DDC97]/10 border-[#3DDC97]/25 text-[#3DDC97]"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {notif.msg}
          </div>
        )}

        {/* Tab nav */}
        <div className="flex gap-1 mb-4 bg-[#161B22] border border-[#21262D] rounded-xl p-1">
          {tabs.map(({ key, label }) => (
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

        {/* Assets tab */}
        {tab === "assets" && (
          <div className="bg-[#161B22] border border-[#21262D] rounded-2xl p-5 space-y-4">
            {/* CELI with import */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-[#8B949E]">{t.cat.celi}</label>
                <button
                  onClick={importCELI}
                  className="text-[10px] text-[#F0A500] hover:text-[#D4940A] transition-colors font-medium"
                >
                  {t.importCELI}
                </button>
              </div>
              <NumberInput value={assets.celi} onChange={setAsset("celi")} placeholder={t.ph.celi} />
            </div>

            {["reer", "savings", "investments", "realEstate", "vehicle", "otherAsset"].map((k) => (
              <div key={k}>
                <label className="text-xs text-[#8B949E] block mb-1">{t.cat[k]}</label>
                <NumberInput value={assets[k]} onChange={setAsset(k)} placeholder={t.ph[k]} />
              </div>
            ))}

            <div className="pt-3 border-t border-[#21262D] flex justify-between items-center">
              <span className="text-xs text-[#8B949E] uppercase tracking-wide">{t.totalAssets}</span>
              <span style={{ fontFamily: "'DM Mono', monospace" }} className="text-base text-[#3DDC97] font-medium">
                {fmt(totalAssets)}
              </span>
            </div>
          </div>
        )}

        {/* Liabilities tab */}
        {tab === "liabilities" && (
          <div className="bg-[#161B22] border border-[#21262D] rounded-2xl p-5 space-y-4">
            {LIABILITY_KEYS.map((k) => (
              <div key={k}>
                <label className="text-xs text-[#8B949E] block mb-1">{t.cat[k]}</label>
                <NumberInput value={liabilities[k]} onChange={setLiability(k)} placeholder={t.ph[k]} />
              </div>
            ))}
            <div className="pt-3 border-t border-[#21262D] flex justify-between items-center">
              <span className="text-xs text-[#8B949E] uppercase tracking-wide">{t.totalLiabilities}</span>
              <span style={{ fontFamily: "'DM Mono', monospace" }} className="text-base text-red-400 font-medium">
                {fmt(totalLiabilities)}
              </span>
            </div>
          </div>
        )}

        {/* History tab */}
        {tab === "history" && (
          <div className="space-y-3">
            {snapshots.length === 0 ? (
              <div className="bg-[#161B22] border border-[#21262D] rounded-2xl p-8 text-center">
                <div className="text-3xl mb-3">📊</div>
                <p className="text-sm text-[#484F58] leading-relaxed">{t.noHistory}</p>
              </div>
            ) : (
              <>
                {snapshots.length >= 2 && (
                  <div className="bg-[#161B22] border border-[#21262D] rounded-2xl p-5">
                    <HistoryChart snapshots={snapshots} lang={lang} />
                  </div>
                )}
                {[...snapshots].reverse().map((s) => (
                  <div
                    key={s.id}
                    className="bg-[#161B22] border border-[#21262D] rounded-xl px-4 py-3.5 flex justify-between items-center"
                  >
                    <div>
                      <div className="text-sm text-[#E6EDF3] font-medium">{s.name}</div>
                      <div className="text-[10px] text-[#484F58] mt-0.5">
                        {new Date(s.date).toLocaleDateString(lang === "fr" ? "fr-CA" : "en-CA", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        style={{ fontFamily: "'DM Mono', monospace" }}
                        className={`text-sm font-medium ${s.netWorth >= 0 ? "text-[#3DDC97]" : "text-red-400"}`}
                      >
                        {fmt(s.netWorth)}
                      </span>
                      <button
                        onClick={() => deleteSnapshot(s.id)}
                        className="text-[#484F58] hover:text-red-400 transition-colors text-sm leading-none"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* Save snapshot */}
        <div className="mt-4 bg-[#161B22] border border-[#21262D] rounded-2xl p-5">
          <div className="text-xs text-[#8B949E] mb-3">{t.saveTitle}</div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={t.snapshotPlaceholder}
              value={snapshotName}
              onChange={(e) => setSnapshotName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && saveSnapshot()}
              className="flex-1 bg-[#0D1117] border border-[#21262D] rounded-lg px-3 py-2.5 text-[#E6EDF3] text-sm focus:outline-none focus:border-[#3DDC97] transition-colors placeholder-[#484F58]"
            />
            <button
              onClick={saveSnapshot}
              className="bg-[#3DDC97] text-[#0D1117] text-xs font-bold rounded-lg px-4 py-2.5 hover:bg-[#2bc47e] transition-colors whitespace-nowrap"
            >
              {t.saveBtn}
            </button>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-[10px] text-[#484F58] text-center mt-6 leading-relaxed">
          {lang === "fr"
            ? "Les données sont sauvegardées localement dans votre navigateur. Rien n'est envoyé à nos serveurs."
            : "Data is saved locally in your browser. Nothing is sent to our servers."}
        </p>
      </div>
    </div>
  );
}