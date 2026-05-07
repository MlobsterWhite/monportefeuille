import Layout from "../components/Layout";
import NetWorthTracker from "../components/NetWorthTracker";
import ToolSchema from "../components/ToolSchema";

export default function ValeurNettePage() {
  return (
    <Layout
      title="Calculateur Valeur Nette Canada"
      description="Calculez votre valeur nette en additionnant vos actifs et passifs. Suivez l'évolution de votre patrimoine dans le temps. Gratuit pour tous les Canadiens."
      canonical="https://monportefeuille.ca/valeur-nette"
    >
      <ToolSchema
        name="Calculateur Valeur Nette Canada"
        description="Calculez votre valeur nette en additionnant vos actifs et passifs. Suivez l'évolution de votre patrimoine dans le temps. Gratuit pour tous les Canadiens."
        url="https://monportefeuille.ca/valeur-nette"
      />
    >
      <NetWorthTracker />
    </Layout>
  );
}