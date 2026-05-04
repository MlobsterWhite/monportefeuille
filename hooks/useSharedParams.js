import { useEffect } from "react";

/**
 * useSharedParams - Hook pour lire les paramètres partagés depuis l'URL
 * et initialiser les états du calculateur
 * 
 * Usage:
 * const [prix, setPrix] = useState(400000);
 * const [taux, setTaux] = useState(4.89);
 * 
 * useSharedParams({
 *   prix: { setter: setPrix, parser: Number },
 *   taux: { setter: setTaux, parser: Number },
 *   amort: { setter: setAmort, parser: Number },
 * });
 */
export default function useSharedParams(paramConfig) {
  useEffect(() => {
    // Lire les paramètres URL seulement au chargement initial
    if (typeof window === "undefined") return;

    const urlParams = new URLSearchParams(window.location.search);
    let hasSharedParams = false;

    Object.entries(paramConfig).forEach(([key, { setter, parser = String }]) => {
      const value = urlParams.get(key);
      if (value !== null) {
        try {
          const parsedValue = parser(value);
          setter(parsedValue);
          hasSharedParams = true;
        } catch (e) {
          console.warn(`Failed to parse shared param ${key}:`, value);
        }
      }
    });

    // Track si des paramètres partagés ont été chargés
    if (hasSharedParams) {
      window.gtag?.("event", "shared_params_loaded", {
        page: window.location.pathname,
      });
    }
  }, []); // Execute seulement au montage
}
