import Layout from "../components/Layout";

const today = new Date();
const dateStr = today.toLocaleDateString("fr-CA", { year: "numeric", month: "long", day: "numeric" });

export default function MentionsLegales() {
  return (
    <Layout title="Mentions légales">
      <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", background: "#0D1117", minHeight: "100vh", padding: "3rem 1rem" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');`}</style>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>

          <div className="mb-10">
            <div className="text-[10px] text-[#484F58] uppercase tracking-widest mb-2">monportefeuille.ca</div>
            <h1 style={{ fontFamily: "'DM Mono', monospace" }} className="text-3xl font-medium text-[#E6EDF3] mb-2">Mentions légales</h1>
            <p className="text-xs text-[#484F58]">Dernière mise à jour : {dateStr}</p>
          </div>

          <div className="space-y-8 text-sm text-[#8B949E] leading-relaxed">

            <div className="bg-[#161B22] border border-[#21262D] rounded-2xl p-6">
              <p className="text-[#C9D1D9]">
                Le site <strong className="text-[#E6EDF3]">monportefeuille.ca</strong> est un site éducatif destiné à aider les utilisateurs à mieux comprendre certains concepts financiers de base. Les informations et outils fournis sont offerts à titre informatif uniquement.
              </p>
            </div>

            {[
              {
                num: "1",
                titre: "Nature du contenu",
                contenu: (
                  <div>
                    <p className="mb-3">Les informations, calculateurs, simulateurs et outils présentés sur ce site :</p>
                    <ul className="space-y-1.5 pl-4">
                      {[
                        "sont fournis à des fins éducatives uniquement",
                        "ne constituent pas des conseils financiers, fiscaux, juridiques ou d'investissement",
                        "ne tiennent pas compte de la situation personnelle de l'utilisateur",
                        "ne doivent pas être utilisés pour prendre des décisions financières importantes sans consulter un professionnel qualifié",
                      ].map((item) => (
                        <li key={item} className="flex gap-2">
                          <span className="text-[#3DDC97] mt-0.5 flex-shrink-0">·</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ),
              },
              {
                num: "2",
                titre: "Absence de relation conseiller–client",
                contenu: (
                  <div>
                    <p className="mb-3">L'utilisation de ce site <strong className="text-[#E6EDF3]">ne crée aucune relation</strong> de :</p>
                    <ul className="space-y-1.5 pl-4 mb-3">
                      {["conseiller financier", "planificateur financier", "représentant en épargne collective", "fiduciaire", "ou tout autre rôle réglementé"].map((item) => (
                        <li key={item} className="flex gap-2">
                          <span className="text-[#3DDC97] mt-0.5 flex-shrink-0">·</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <p>Aucune recommandation personnalisée n'est fournie.</p>
                  </div>
                ),
              },
              {
                num: "3",
                titre: "Exactitude et mise à jour",
                contenu: (
                  <div>
                    <p className="mb-3">Bien que nous nous efforcions d'assurer l'exactitude des informations :</p>
                    <ul className="space-y-1.5 pl-4">
                      {[
                        "aucune garantie n'est donnée quant à leur exactitude, leur mise à jour ou leur exhaustivité",
                        "les lois fiscales et financières changent régulièrement",
                        "les résultats des simulateurs sont des estimations approximatives",
                      ].map((item) => (
                        <li key={item} className="flex gap-2">
                          <span className="text-[#F0A500] mt-0.5 flex-shrink-0">·</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ),
              },
              {
                num: "4",
                titre: "Limitation de responsabilité",
                contenu: (
                  <div>
                    <p className="mb-3">monportefeuille.ca, ses propriétaires et collaborateurs <strong className="text-[#E6EDF3]">ne peuvent être tenus responsables</strong> de :</p>
                    <ul className="space-y-1.5 pl-4 mb-3">
                      {["pertes financières", "décisions prises", "dommages directs ou indirects", "erreurs ou omissions"].map((item) => (
                        <li key={item} className="flex gap-2">
                          <span className="text-[#f87171] mt-0.5 flex-shrink-0">·</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <p>découlant de l'utilisation du site ou des outils.</p>
                  </div>
                ),
              },
              {
                num: "5",
                titre: "Liens affiliés",
                contenu: <p>Certains liens présents sur le site peuvent être des <strong className="text-[#E6EDF3]">liens affiliés</strong>. Si vous effectuez un achat via ces liens, nous pouvons recevoir une commission, sans frais supplémentaires pour vous. Cela ne modifie en rien nos recommandations éducatives.</p>,
              },
              {
                num: "6",
                titre: "Juridiction",
                contenu: <p>Ce site est destiné aux résidents du <strong className="text-[#E6EDF3]">Canada</strong>. Les lois applicables sont celles de la province de <strong className="text-[#E6EDF3]">Québec</strong>.</p>,
              },
              {
                num: "7",
                titre: "Propriété intellectuelle",
                contenu: <p>Tous les contenus, textes, outils, graphiques et logos sont la propriété de monportefeuille.ca et ne peuvent être reproduits sans autorisation écrite préalable.</p>,
              },
            ].map(({ num, titre, contenu }) => (
              <div key={num} className="rounded-2xl p-6" style={{ background: "#161B22", border: "1px solid #21262D" }}>
                <div className="flex items-baseline gap-3 mb-4">
                  <span style={{ fontFamily: "'DM Mono', monospace" }} className="text-xs text-[#484F58]">{num}.</span>
                  <h2 className="text-base font-medium text-[#E6EDF3]">{titre}</h2>
                </div>
                <div className="text-sm text-[#8B949E] leading-relaxed">{contenu}</div>
              </div>
            ))}

            {/* Conditions d'utilisation */}
            <div className="pt-6 border-t border-[#21262D]">
              <h2 style={{ fontFamily: "'DM Mono', monospace" }} className="text-2xl font-medium text-[#E6EDF3] mb-2">Conditions d'utilisation</h2>
              <p className="text-xs text-[#484F58] mb-8">En utilisant ce site, vous acceptez les présentes conditions.</p>

              <div className="space-y-4">
                {[
                  {
                    titre: "Utilisation permise",
                    permis: ["apprendre", "simuler", "comprendre des concepts financiers"],
                    interdit: ["reproduire ou revendre les outils", "les intégrer dans un produit commercial", "utiliser le site à des fins illégales"],
                  },
                ].map(({ titre, permis, interdit }) => (
                  <div key={titre} className="rounded-2xl p-6" style={{ background: "#161B22", border: "1px solid #21262D" }}>
                    <h3 className="text-sm font-medium text-[#E6EDF3] mb-4">{titre}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-[10px] text-[#3DDC97] uppercase tracking-widest mb-2">Autorisé</div>
                        <ul className="space-y-1.5">
                          {permis.map(i => <li key={i} className="flex gap-2 text-xs text-[#8B949E]"><span className="text-[#3DDC97]">✓</span>{i}</li>)}
                        </ul>
                      </div>
                      <div>
                        <div className="text-[10px] text-[#f87171] uppercase tracking-widest mb-2">Interdit</div>
                        <ul className="space-y-1.5">
                          {interdit.map(i => <li key={i} className="flex gap-2 text-xs text-[#8B949E]"><span className="text-[#f87171]">✗</span>{i}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}

                {[
                  { titre: "Absence de garantie", texte: "Le site est fourni « tel quel », sans garantie de performance, d'exactitude, de disponibilité ou de résultats." },
                  { titre: "Responsabilité de l'utilisateur", texte: "Vous êtes responsable de vérifier vos propres informations financières, de consulter un professionnel avant toute décision importante, et d'utiliser les outils avec discernement." },
                  { titre: "Modifications", texte: "Nous pouvons modifier les outils, les informations ou les conditions d'utilisation à tout moment, sans préavis." },
                ].map(({ titre, texte }) => (
                  <div key={titre} className="rounded-2xl p-6" style={{ background: "#161B22", border: "1px solid #21262D" }}>
                    <h3 className="text-sm font-medium text-[#E6EDF3] mb-2">{titre}</h3>
                    <p className="text-xs text-[#8B949E] leading-relaxed">{texte}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}
