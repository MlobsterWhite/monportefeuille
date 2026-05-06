import { useState } from "react";
import Layout from "../components/Layout";

export default function NousJoindre() {
  const [form, setForm] = useState({ nom: "", courriel: "", sujet: "", message: "" });
  const [statut, setStatut] = useState("idle"); // idle | loading | success | error

  const sujets = [
    "Suggestion d'outil ou de fonctionnalité",
    "Erreur dans un calculateur",
    "Recommandation de partenaire affilié",
    "Question générale",
    "Autre",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatut("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatut("success");
        setForm({ nom: "", courriel: "", sujet: "", message: "" });
      } else {
        setStatut("error");
      }
    } catch {
      setStatut("error");
    }
  };

  return (
    <Layout title="Nous joindre">
      <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", background: "#0D1117", minHeight: "100vh", padding: "3rem 1rem" }}>
        <div style={{ maxWidth: 620, margin: "0 auto" }}>

          <div className="mb-10">
            <div className="text-[10px] text-[#484F58] uppercase tracking-widest mb-2">monportefeuille.ca</div>
            <h1 style={{ fontFamily: "'DM Mono', monospace" }} className="text-3xl font-medium text-[#E6EDF3] mb-2">Nous joindre</h1>
            <p className="text-sm text-[#8B949E]">Une suggestion, une erreur à signaler ou une idée de partenariat? On lit tout.</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { icon: "💡", titre: "Suggestions", desc: "Nouvel outil, nouvelle fonctionnalité" },
              { icon: "🐛", titre: "Erreurs", desc: "Calcul incorrect ou bug" },
              { icon: "🤝", titre: "Partenariats", desc: "Recommandation de produit canadien" },
              { icon: "💬", titre: "Général", desc: "Toute autre question" },
            ].map(({ icon, titre, desc }) => (
              <div key={titre} className="rounded-xl p-4" style={{ background: "#161B22", border: "1px solid #21262D" }}>
                <div className="text-lg mb-1">{icon}</div>
                <div className="text-xs font-medium text-[#E6EDF3]">{titre}</div>
                <div className="text-[10px] text-[#484F58] mt-0.5">{desc}</div>
              </div>
            ))}
          </div>

          {statut === "success" ? (
            <div className="rounded-2xl p-8 text-center" style={{ background: "#161B22", border: "1px solid #21262D" }}>
              <div className="text-4xl mb-4">✅</div>
              <h2 className="text-lg font-medium text-[#E6EDF3] mb-2">Message envoyé!</h2>
              <p className="text-sm text-[#8B949E] mb-6">
                Merci — nous vous répondrons dans les meilleurs délais.
              </p>
              <button onClick={() => setStatut("idle")}
                className="text-xs text-[#484F58] hover:text-[#8B949E] border border-[#21262D] rounded-lg px-4 py-2 transition-colors">
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-2xl p-6 space-y-4" style={{ background: "#161B22", border: "1px solid #21262D" }}>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[#8B949E] block mb-1.5">Nom</label>
                  <input type="text" required value={form.nom}
                    onChange={e => setForm({ ...form, nom: e.target.value })}
                    placeholder="Votre nom"
                    className="w-full bg-[#0D1117] border border-[#21262D] rounded-lg px-3 py-2.5 text-[#E6EDF3] text-sm focus:outline-none focus:border-[#3DDC97] transition-colors placeholder-[#484F58]" />
                </div>
                <div>
                  <label className="text-xs text-[#8B949E] block mb-1.5">Courriel</label>
                  <input type="email" required value={form.courriel}
                    onChange={e => setForm({ ...form, courriel: e.target.value })}
                    placeholder="vous@exemple.com"
                    className="w-full bg-[#0D1117] border border-[#21262D] rounded-lg px-3 py-2.5 text-[#E6EDF3] text-sm focus:outline-none focus:border-[#3DDC97] transition-colors placeholder-[#484F58]" />
                </div>
              </div>

              <div>
                <label className="text-xs text-[#8B949E] block mb-1.5">Sujet</label>
                <select required value={form.sujet}
                  onChange={e => setForm({ ...form, sujet: e.target.value })}
                  className="w-full bg-[#0D1117] border border-[#21262D] rounded-lg px-3 py-2.5 text-[#E6EDF3] text-sm focus:outline-none focus:border-[#3DDC97] transition-colors">
                  <option value="" disabled>Choisir un sujet...</option>
                  {sujets.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs text-[#8B949E] block mb-1.5">Message</label>
                <textarea required value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Décrivez votre suggestion, erreur ou question..."
                  rows={5}
                  className="w-full bg-[#0D1117] border border-[#21262D] rounded-lg px-3 py-2.5 text-[#E6EDF3] text-sm focus:outline-none focus:border-[#3DDC97] transition-colors placeholder-[#484F58] resize-none" />
              </div>

              {statut === "error" && (
                <div className="bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 text-xs text-red-400">
                  Une erreur s'est produite. Réessayez ou écrivez-nous directement à{" "}
                  <a href="mailto:info@monportefeuille.ca" className="underline">info@monportefeuille.ca</a>
                </div>
              )}

              <button type="submit" disabled={statut === "loading"}
                className="w-full font-bold rounded-xl py-3.5 text-sm tracking-wide transition-all disabled:opacity-60 text-[#0D1117]"
                style={{ background: "#3DDC97" }}>
                {statut === "loading" ? "Envoi en cours..." : "Envoyer le message →"}
              </button>
            </form>
          )}

          <div className="mt-4 rounded-xl p-4 flex items-center justify-between" style={{ background: "#161B22", border: "1px solid #21262D" }}>
            <div>
              <div className="text-xs text-[#8B949E]">Contact direct</div>
              <div className="text-sm text-[#E6EDF3] mt-0.5">info@monportefeuille.ca</div>
            </div>
            <a href="mailto:info@monportefeuille.ca" className="text-xs text-[#3DDC97] hover:underline no-underline">
              Écrire →
            </a>
          </div>

        </div>
      </div>
    </Layout>
  );
}