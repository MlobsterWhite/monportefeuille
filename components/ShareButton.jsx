import { useState } from "react";

/**
 * ShareButton - Composant réutilisable pour partager les résultats d'un calculateur
 * 
 * Usage:
 * <ShareButton 
 *   params={{ prix: 400000, taux: 4.89, amort: 25 }}
 *   color="#FB923C"
 * />
 */
export default function ShareButton({ params = {}, color = "#3DDC97" }) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    // Construire l'URL avec les paramètres
    const url = new URL(window.location.href);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });

    // Copier dans le presse-papier
    navigator.clipboard.writeText(url.toString()).then(() => {
      setCopied(true);
      
      // Track dans GA4
      window.gtag?.("event", "share_results", {
        page: window.location.pathname,
        params: JSON.stringify(params),
      });

      // Reset après 2 secondes
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all"
      style={{
        borderColor: copied ? color : "#30363D",
        backgroundColor: copied ? `${color}15` : "#161B22",
        color: copied ? color : "#8B949E",
      }}
    >
      {copied ? (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Lien copié!</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span>Partager mes résultats</span>
        </>
      )}
    </button>
  );
}
