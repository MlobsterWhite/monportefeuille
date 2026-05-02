import { useState } from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import AffiliateLink from "../components/AffiliateLink";

function CreditEstimator() {
  const [form, setForm] = useState({
    payments: "always",
    utilization: 30,
    age: "3-6",
    inquiries: "0",
    accounts: "2-4",
  });
  const [score, setScore] = useState(null);

  const calculate = () => {
    let s = 650;
    if (form.payments === "always") s += 90;
    else if (form.payments === "usually") s += 30;
    else if (form.payments === "sometimes") s -= 40;
    else s -= 100;

    const util = parseInt(form.utilization);
    if (util <= 10) s += 60;
    else if (util <= 30) s += 30;
    else if (util <= 50) s -= 20;
    else if (util <= 75) s -= 60;
    else s -= 100;

    if (form.age === "10+") s += 50;
    else if (form.age === "6-10") s += 30;
    else if (form.age === "3-6") s += 10;
    else if (form.age === "1-3") s -= 20;
    else s -= 50;

    if (form.inquiries === "0") s += 20;
    else if (form.inquiries === "1-2") s += 0;
    else if (form.inquiries === "3-4") s -= 20;
    else s -= 50;

    if (form.accounts === "5+") s += 20;
    else if (form.accounts === "2-4") s += 10;
    else s -= 10;

    setScore(Math.min(900, Math.max(300, Math.round(s))));
  };

  const getRange = (s) => {
    if (s >= 760) return { label: "Excellent", color: "#3DDC97", tip: "Vous êtes admissible aux meilleures offres de crédit au Canada. Confirmez avec votre vrai score." };
    if (s >= 725) return { label: "Très bien", color: "#60A5FA", tip: "Très bon profil. Quelques améliorations pourraient vous donner accès aux meilleures conditions." };
    if (s >= 660) return { label: "Bien", color: "#F0A500", tip: "Bon profil de crédit. Réduire votre taux d'utilisation pourrait faire une grande différence." };
    if (s >= 560) return { label: "Acceptable", color: "#FB923C", tip: "Il y a de la place à améliorer. Consultez votre vrai score pour identifier les priorités." };
    return { label: "À améliorer", color: "#F87171", tip: "Pas de panique — des ajustements simples peuvent améliorer votre score significativement." };
  };

  const pct = score ? ((score - 300) / 600) * 100 : null;
  const range = score ? getRange(score) : null;
  const fieldClass = "bg-[#0D1117] border border-[#21262D] text-[#E6EDF3] rounded-lg px-3.5 py-2.5 w-full text-sm focus:outline-none focus:border-[#3DDC97]/50 cursor-pointer";

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-[#8B949E] uppercase tracking-wider">Paiements</label>
          <select className={fieldClass} value={form.payments} onChange={e => setForm({ ...form, payments: e.target.value })}>
            <option value="always">Toujours à temps</option>
            <option value="usually">Habituellement</option>
            <option value="sometimes">Parfois en retard</option>
            <option value="often">Souvent en retard</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-[#8B949E] uppercase tracking-wider">Ancienneté du crédit</label>
          <select className={fieldClass} value={form.age} onChange={e => setForm({ ...form, age: e.target.value })}>
            <option value="<1">Moins d'un an</option>
            <option value="1-3">1 à 3 ans</option>
            <option value="3-6">3 à 6 ans</option>
            <option value="6-10">6 à 10 ans</option>
            <option value="10+">10 ans et plus</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-[#8B949E] uppercase tracking-wider">Demandes récentes (12 mois)</label>
          <select className={fieldClass} value={form.inquiries} onChange={e => setForm({ ...form, inquiries: e.target.value })}>
            <option value="0">Aucune</option>
            <option value="1-2">1 à 2</option>
            <option value="3-4">3 à 4</option>
            <option value="5+">5 ou plus</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-[#8B949E] uppercase tracking-wider">Comptes de crédit actifs</label>
          <select className={fieldClass} value={form.accounts} onChange={e => setForm({ ...form, accounts: e.target.value })}>
            <option value="0-1">0 à 1</option>
            <option value="2-4">2 à 4</option>
            <option value="5+">5 ou plus</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <label className="text-xs text-[#8B949E] uppercase tracking-wider">Taux d'utilisation du crédit</label>
          <span className="text-sm font-bold text-[#3DDC97]">{form.utilization}%</span>
        </div>
        <input type="range" min={0} max={100} value={form.utilization}
          onChange={e => setForm({ ...form, utilization: e.target.value })}
          className="w-full accent-[#3DDC97]" />
        <div className="flex justify-between text-xs text-[#484F58]">
          <span>0% (idéal)</span><span>100%</span>
        </div>
      </div>

      <button onClick={calculate}
        className="bg-[#3DDC97] text-[#0D1117] font-bold rounded-xl py-3.5 w-full text-sm tracking-wide hover:bg-[#2EC97F] transition-colors">
        Estimer ma cote →
      </button>

      {score && (
        <div className="bg-[#0D1117] rounded-xl p-6 border" style={{ borderColor: range.color + "30" }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-xs text-[#8B949E] mb-1">Estimation de votre cote</div>
              <div className="text-5xl font-black leading-none" style={{ color: range.color }}>{score}</div>
              <div className="text-xs text-[#8B949E] mt-1">sur 900</div>
            </div>
            <span className="text-sm font-bold rounded-lg px-3 py-1.5 mt-1"
              style={{ color: range.color, background: `${range.color}15`, border: `1px solid ${range.color}30` }}>
              {range.label}
            </span>
          </div>
          <div className="h-2 bg-[#21262D] rounded-full overflow-hidden mb-1.5">
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${pct}%`, background: `linear-gradient(90deg, #F87171, #F0A500, ${range.color})` }} />
          </div>
          <div className="flex justify-between text-xs text-[#484F58] mb-4"><span>300</span><span>900</span></div>
          <p className="text-sm text-[#8B949E] leading-relaxed">{range.tip}</p>
        </div>
      )}
    </div>
  );
}

export default function EstimateurCreditPage() {
  return (
    <Layout title="Estimateur de cote de crédit">
      <div className="max-w-3xl mx-auto px-6 pb-20">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#8B949E] hover:text-[#E6EDF3] no-underline pt-6 pb-8 transition-colors">
          ← Retour aux outils
        </Link>

        <div className="mb-10">
          <div className="inline-block bg-[#3DDC97]/10 border border-[#3DDC97]/20 rounded-full px-3 py-1 text-xs text-[#3DDC97] uppercase tracking-widest mb-4">
            Crédit
          </div>
          <h1 className="text-3xl font-extrabold text-[#E6EDF3] tracking-tight mb-3">Estimateur de cote de crédit</h1>
          <p className="text-base text-[#8B949E] leading-relaxed font-light">
            Répondez à 5 questions pour obtenir une estimation de votre profil de crédit.
            Aucune information personnelle requise — 100% anonyme.
          </p>
        </div>

        <div className="bg-[#161B22] rounded-2xl p-7 border border-[#21262D] mb-7">
          <CreditEstimator />
        </div>

        <div className="bg-[#161B22] rounded-2xl p-7 border border-[#21262D] mb-7">
          <h2 className="text-lg font-bold text-[#E6EDF3] mb-4">Comment est calculée votre cote?</h2>
          <div className="flex flex-col gap-3">
            {[
              { label: "Historique de paiements", pct: "35%", desc: "Le facteur le plus important. Payez toujours à temps.", color: "#3DDC97" },
              { label: "Taux d'utilisation", pct: "30%", desc: "Gardez votre utilisation sous 30% de votre limite.", color: "#F0A500" },
              { label: "Ancienneté du crédit", pct: "15%", desc: "Plus votre historique est long, mieux c'est.", color: "#60A5FA" },
              { label: "Nouveaux comptes", pct: "10%", desc: "Évitez d'ouvrir trop de comptes en peu de temps.", color: "#C084FC" },
              { label: "Diversité du crédit", pct: "10%", desc: "Un mélange sain de cartes, marges et prêts aide.", color: "#FB923C" },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-4">
                <div className="w-12 text-right text-sm font-bold flex-shrink-0" style={{ color: item.color }}>{item.pct}</div>
                <div className="flex-1">
                  <div className="h-1.5 rounded-full mb-1" style={{ width: item.pct, background: item.color, opacity: 0.6 }}></div>
                  <div className="text-sm font-medium text-[#E6EDF3]">{item.label}</div>
                  <div className="text-xs text-[#8B949E] font-light">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#3DDC97]/06 border border-[#3DDC97]/25 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-[#E6EDF3] mb-2">Obtenez votre vrai score</h3>
          <p className="text-sm text-[#8B949E] mb-6 leading-relaxed max-w-sm mx-auto">
            L'estimateur vous donne une idée — Borrowell vous donne votre vraie cote Equifax,
            mise à jour chaque semaine, gratuitement et sans impact sur votre score.
          </p>
          <AffiliateLink
            href="https://borrowell.com/refer-a-friend/free-credit-score?utm_campaign=Refer5&utm_medium=web&utm_source=refer2022-1115247"
            partner="borrowell"
            className="inline-block bg-[#3DDC97] text-[#0D1117] font-bold rounded-xl px-8 py-3.5 text-sm tracking-wide hover:bg-[#2EC97F] transition-colors no-underline"
          >
            Vérifier mon vrai score — Gratuit →
          </AffiliateLink>
          <p className="text-xs text-[#484F58] mt-4">
            ✓ Aucune carte de crédit · ✓ Aucun impact · ✓ 100% gratuit · Lien affilié
          </p>
        </div>
      </div>
    </Layout>
  );
}
