import { useState } from "react";
import Link from "next/link";
import Layout from "../components/Layout";

const tools = [
  {
    id: "estimateur-credit",
    name: "Estimateur de crédit",
    tagline: "Estimez votre profil de crédit et découvrez comment l'améliorer.",
    category: "Crédit",
    ready: true,
  },
  {
    id: "calculateur-celi",
    name: "Calculateur CELI",
    tagline: "Projetez la croissance de votre CELI jusqu'à la retraite.",
    category: "Investissement",
    ready: true,
  },
  {
    id: "calculateur-reer",
    name: "Calculateur REER",
    tagline: "Calculez votre remboursement d'impôt et votre valeur à la retraite.",
    category: "Investissement",
    ready: true,
  },
  {
    id: "valeur-nette",
    name: "Calculateur valeur nette",
    tagline: "Faites le bilan de vos actifs et passifs pour connaître votre valeur nette.",
    category: "Épargne",
    ready: true,
  },
  {
    id: "calculateur-hypotheque",
    name: "Calculateur hypothécaire",
    tagline: "Estimez vos paiements, les intérêts totaux et l'impact de votre mise de fonds.",
    category: "Immobilier",
    ready: true,
  },
  {
    id: "estimateur-assurance",
    name: "Estimateur d'assurance",
    tagline: "Estimez votre prime mensuelle en auto ou habitation selon votre profil.",
    category: "Assurance",
    ready: true,
  },
  {
    id: "estimateur-impot",
    name: "Estimateur d'impôt",
    tagline: "Estimez votre remboursement ou solde dû, et l'impact de votre REER.",
    category: "Fiscal",
    ready: true,
  },
  {
    id: "celi-vs-reer",
    name: "CELI vs REER",
    tagline: "Comparez les deux régimes selon votre situation personnelle.",
    category: "Investissement",
    ready: false,
  },
  {
    id: "dette",
    name: "Calculateur de dette",
    tagline: "Stratégie avalanche ou boule de neige — trouvez la meilleure approche.",
    category: "Crédit",
    ready: false,
  },
  {
    id: "urgence",
    name: "Fonds d'urgence",
    tagline: "Calculez combien vous devriez mettre de côté pour être protégé.",
    category: "Épargne",
    ready: false,
  },
  {
    id: "hypotheque",
    name: "Calculateur hypothécaire",
    tagline: "Simulez vos paiements et comparez les taux disponibles au Canada.",
    category: "Immobilier",
    ready: false,
  },
  {
    id: "inflation",
    name: "Impact de l'inflation",
    tagline: "Voyez comment l'inflation érode votre épargne avec le temps.",
    category: "Épargne",
    ready: false,
  },
  {
    id: "fire",
    name: "Calculateur FIRE",
    tagline: "Estimez à quel âge vous pourriez prendre votre retraite anticipée.",
    category: "Retraite",
    ready: false,
  },
];

const faqs = [
  {
    q: "Est-ce que ces outils sont vraiment gratuits?",
    a: "Oui, tous les outils sur monportefeuille.ca sont 100% gratuits. Le site est financé par des liens affiliés — si vous ouvrez un compte via nos liens, on reçoit une petite commission, sans coût supplémentaire pour vous."
  },
  {
    q: "Vérifier ma cote de crédit affecte-t-il mon score?",
    a: "Non. La vérification est douce (soft check) et n'a aucun impact sur votre cote. Vous pouvez vérifier aussi souvent que vous voulez."
  },
  {
    q: "Wealthsimple est-il sécuritaire?",
    a: "Oui. Wealthsimple est membre de l'OCRI et les comptes sont protégés par le FCPE jusqu'à 1 million de dollars."
  },
  {
    q: "Par où commencer si je suis débutant?",
    a: "Commencez par l'estimateur de crédit — gratuit, 2 minutes. Ensuite ouvrez un CELI et contribuez ce que vous pouvez chaque mois, même 50$."
  },
  {
    q: "Quelle est la différence entre un CELI et un REER?",
    a: "Le CELI vous permet de retirer sans payer d'impôt. Le REER réduit votre revenu imposable maintenant, mais vous payez de l'impôt au retrait. En général, le CELI est recommandé en premier."
  },
];

function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <div className="flex flex-col gap-2">
      {faqs.map((item, i) => (
        <div key={i} className="bg-[#0E1520] border border-[#21262D] rounded-xl overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full text-left px-5 py-4 flex justify-between items-center gap-4"
          >
            <span className="text-sm font-medium text-[#E6EDF3]">{item.q}</span>
            <span className="text-[#3DDC97] text-lg flex-shrink-0">{open === i ? "−" : "+"}</span>
          </button>
          {open === i && (
            <div className="px-5 pb-4">
              <p className="text-sm text-[#8B949E] leading-relaxed font-light">{item.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const categoryColors = {
  "Crédit": "#3DDC97",
  "Investissement": "#F0A500",
  "Épargne": "#60A5FA",
  "Immobilier": "#FB923C",
  "Retraite": "#C084FC",
  "Assurance": "#60A5FA",
  "Fiscal": "#C084FC",
};

export default function Home() {
  return (
    <Layout title="Outils financiers canadiens">
      <div className="max-w-5xl mx-auto px-6 pb-24">

        {/* ── Hero ── */}
        <div className="py-16 text-center">
          <div className="inline-block bg-[#3DDC97]/10 border border-[#3DDC97]/20 rounded-full px-4 py-1 text-xs text-[#3DDC97] uppercase tracking-widest mb-5">
            Outils financiers canadiens
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#E6EDF3] mb-4 leading-tight">
            Prenez le contrôle de<br />
            <span className="text-[#3DDC97]">votre portefeuille</span>
          </h1>
          <p className="text-lg text-[#8B949E] max-w-xl mx-auto leading-relaxed font-light">
            Des outils interactifs pour comprendre votre crédit, maximiser votre épargne
            et investir intelligemment — le tout 100% canadien.
          </p>
        </div>

        {/* ── Faits financiers ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-20">
          {[
            { stat: "53%", desc: "des Canadiens vivent à moins de 200$ de ne pas pouvoir payer leurs factures", source: "MNP" },
            { stat: "650", desc: "est la cote de crédit moyenne au Canada — sous le seuil idéal de 720", source: "Equifax" },
            { stat: "32%", desc: "des Canadiens n'ont aucune épargne-retraite à 45 ans", source: "Stats Canada" },
          ].map((item) => (
            <div key={item.stat} className="bg-[#0E1520] border border-[#21262D] rounded-2xl p-6 text-center">
              <div className="text-4xl font-black text-[#3DDC97] mb-3">{item.stat}</div>
              <p className="text-sm text-[#8B949E] leading-relaxed font-light mb-2">{item.desc}</p>
              <span className="text-xs text-[#484F58]">Source: {item.source}</span>
            </div>
          ))}
        </div>

        {/* ── Comment ça marche ── */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-[#E6EDF3] text-center mb-2">Comment ça marche</h2>
          <p className="text-sm text-[#8B949E] text-center mb-10 font-light">Trois étapes pour reprendre le contrôle de vos finances</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Utilisez un outil", desc: "Choisissez un calculateur gratuit adapté à votre situation — crédit, épargne ou investissement." },
              { step: "02", title: "Comprenez vos résultats", desc: "L'outil vous explique où vous en êtes et ce que vous pouvez améliorer concrètement." },
              { step: "03", title: "Passez à l'action", desc: "On vous recommande les meilleurs produits canadiens pour passer à l'étape suivante." },
            ].map((item) => (
              <div key={item.step} className="flex flex-col gap-4">
                <div className="text-5xl font-black text-[#3DDC97]/15">{item.step}</div>
                <div>
                  <h3 className="text-base font-bold text-[#E6EDF3] mb-2">{item.title}</h3>
                  <p className="text-sm text-[#8B949E] leading-relaxed font-light">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Outils ── */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-[#E6EDF3] text-center mb-2">Nos outils</h2>
          <p className="text-sm text-[#8B949E] text-center mb-10 font-light">Gratuits, interactifs, conçus pour les Canadiens</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {tools.map(t => {
              const color = categoryColors[t.category] || "#3DDC97";
              const card = (
                <div className={`rounded-2xl p-5 flex flex-col gap-4 h-full border transition-all ${
                  t.ready
                    ? "bg-[#0E1520] border-[#21262D] hover:bg-[#121B28] cursor-pointer"
                    : "bg-[#0A0E15] border-[#1A1F28] opacity-50 cursor-default"
                }`}
                style={t.ready ? { "--hover-border": `${color}30` } : {}}
                onMouseEnter={t.ready ? (e) => e.currentTarget.style.borderColor = `${color}30` : undefined}
                onMouseLeave={t.ready ? (e) => e.currentTarget.style.borderColor = "#21262D" : undefined}
                >
                  <div className="flex justify-between items-start">
                    <span
                      className="text-xs font-medium rounded-full px-3 py-1 border"
                      style={t.ready
                        ? { color, background: `${color}12`, borderColor: `${color}25` }
                        : { color: "#484F58", background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.05)" }
                      }
                    >
                      {t.category}
                    </span>
                    {!t.ready && (
                      <span className="text-xs text-[#484F58] bg-white/3 border border-white/5 rounded-full px-3 py-1">
                        Prochainement
                      </span>
                    )}
                  </div>
                  <div>
                    <div className={`text-base font-semibold mb-1.5 ${t.ready ? "text-[#E6EDF3]" : "text-[#484F58]"}`}>
                      {t.name}
                    </div>
                    <div className="text-sm text-[#8B949E]/60 leading-relaxed font-light">{t.tagline}</div>
                  </div>
                </div>
              );

              return t.ready
                ? <Link key={t.id} href={`/${t.id}`} className="no-underline">{card}</Link>
                : <div key={t.id}>{card}</div>;
            })}
          </div>
        </div>

        {/* ── Pourquoi ce site ── */}
        <div className="mb-20 bg-[#0E1520] border border-[#21262D] rounded-2xl p-8 md:p-10">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-3xl mb-4">🇨🇦</div>
            <h2 className="text-2xl font-bold text-[#E6EDF3] mb-4">Pourquoi monportefeuille.ca?</h2>
            <p className="text-sm text-[#8B949E] leading-relaxed font-light mb-4">
              J'ai créé ce site parce que la littératie financière au Canada — surtout en français — est souvent inaccessible,
              compliquée ou noyée dans du jargon. Pourtant, quelques décisions simples peuvent faire une énorme différence sur 10 ou 20 ans.
            </p>
            <p className="text-sm text-[#8B949E] leading-relaxed font-light">
              Ici, pas de conseils financiers complexes. Juste des outils clairs, des recommandations honnêtes,
              et les meilleurs produits canadiens pour passer à l'action. Gratuit, toujours.
            </p>
          </div>
        </div>

        {/* ── FAQ ── */}
        <div>
          <h2 className="text-2xl font-bold text-[#E6EDF3] text-center mb-2">Questions fréquentes</h2>
          <p className="text-sm text-[#8B949E] text-center mb-10 font-light">Tout ce que vous voulez savoir avant de commencer</p>
          <div className="max-w-2xl mx-auto">
            <FAQ />
          </div>
        </div>

      </div>
    </Layout>
  );
}
