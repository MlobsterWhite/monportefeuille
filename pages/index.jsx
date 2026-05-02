import { useState } from "react";
import Link from "next/link";
import Layout from "../components/Layout";

const partners = [
  { id: "borrowell", name: "Borrowell", tagline: "Vérifiez votre cote de crédit gratuitement", category: "Crédit", badge: "Gratuit", tool: "Estimateur de crédit" },
  { id: "wealthsimple", name: "Wealthsimple", tagline: "Banque, épargne et investissement sans frais", category: "Banque & Investissement", badge: "Populaire", tool: "Calculateur CELI" },
];

const faqs = [
  {
    q: "Est-ce que ces outils sont vraiment gratuits?",
    a: "Oui, tous les outils sur monportefeuille.ca sont 100% gratuits. Le site est financé par des liens affiliés — si vous ouvrez un compte via nos liens, on reçoit une petite commission, sans coût supplémentaire pour vous."
  },
  {
    q: "Vérifier ma cote de crédit avec Borrowell affecte-t-il mon score?",
    a: "Non. Borrowell effectue une vérification douce (soft check) qui n'a aucun impact sur votre cote de crédit. Vous pouvez vérifier aussi souvent que vous voulez."
  },
  {
    q: "Wealthsimple est-il sécuritaire pour mes investissements?",
    a: "Oui. Wealthsimple est membre de l'OCRI (Organisme canadien de réglementation des investissements) et les comptes sont protégés par le FCPE jusqu'à 1 million de dollars."
  },
  {
    q: "Par où commencer si je suis débutant?",
    a: "Commencez par Borrowell pour connaître votre cote de crédit — c'est gratuit et ça prend 2 minutes. Ensuite, ouvrez un CELI chez Wealthsimple et contribuez ce que vous pouvez chaque mois, même 50$."
  },
  {
    q: "Quelle est la différence entre un CELI et un REER?",
    a: "Le CELI (Compte d'épargne libre d'impôt) vous permet de retirer votre argent sans payer d'impôt. Le REER (Régime enregistré d'épargne-retraite) réduit votre revenu imposable maintenant, mais vous payez de l'impôt au retrait. En général, le CELI est recommandé en premier pour la plupart des Canadiens."
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
              { step: "01", title: "Utilisez un outil", desc: "Choisissez un calculateur gratuit adapté à votre situation — crédit, épargne ou investissement.", color: "#3DDC97" },
              { step: "02", title: "Comprenez vos résultats", desc: "L'outil vous explique où vous en êtes et ce que vous pouvez améliorer concrètement.", color: "#3DDC97" },
              { step: "03", title: "Passez à l'action", desc: "On vous recommande les meilleurs produits canadiens pour passer à l'étape suivante.", color: "#3DDC97" },
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {partners.map(p => (
              <Link
                key={p.id}
                href={`/${p.id}`}
                className="bg-[#0E1520] border border-[#21262D] rounded-2xl p-6 flex flex-col gap-4 no-underline hover:bg-[#121B28] hover:border-[#3DDC97]/20 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="w-11 h-11 rounded-xl bg-[#3DDC97]/10 border border-[#3DDC97]/20 flex items-center justify-center">
                    <span className="text-[#3DDC97] font-bold text-lg">{p.name[0]}</span>
                  </div>
                  <span className="text-xs font-medium rounded-full px-3 py-1 text-[#8B949E] bg-white/5 border border-white/[0.06]">
                    {p.badge}
                  </span>
                </div>
                <div>
                  <div className="text-xs text-[#484F58] uppercase tracking-wider mb-1">{p.category}</div>
                  <div className="text-lg font-semibold text-[#E6EDF3] mb-1.5">{p.name}</div>
                  <div className="text-sm text-[#8B949E] leading-relaxed font-light">{p.tagline}</div>
                </div>
                <div>
                  <span className="text-xs text-[#3DDC97]/50 rounded-lg px-2.5 py-1.5 bg-[#3DDC97]/5 border border-[#3DDC97]/10">
                    🛠 {p.tool}
                  </span>
                </div>
              </Link>
            ))}
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