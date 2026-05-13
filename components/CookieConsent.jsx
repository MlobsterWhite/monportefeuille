import { useState, useEffect } from "react";
import Link from "next/link";

const CONSENT_KEY = "mp_cookie_consent"; // "accepted" | "declined"

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  function enableAnalytics() {
    if (typeof window === "undefined" || !window.gtag) return;
    window.gtag("consent", "update", {
      analytics_storage: "granted",
    });
  }

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) {
      // Small delay so it doesn't flash on first paint
      const t = setTimeout(() => setVisible(true), 300);
      return () => clearTimeout(t);
    }
    if (stored === "accepted") enableAnalytics();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleAccept() {
    localStorage.setItem(CONSENT_KEY, "accepted");
    enableAnalytics();
    setVisible(false);
  }

  function handleDecline() {
    localStorage.setItem(CONSENT_KEY, "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[100] px-4 pb-4"
      role="dialog"
      aria-label="Consentement aux cookies"
    >
      <div className="max-w-3xl mx-auto bg-[#161B22] border border-[#30363D] rounded-2xl p-5 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4">

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-[#8B949E] leading-relaxed">
            Nous utilisons Google Analytics pour mesurer l'audience de façon anonyme et améliorer nos outils.
            Aucune donnée financière saisie n'est collectée.{" "}
            <Link href="/confidentialite" className="text-[#3DDC97] underline hover:text-[#3DDC97]/80">
              Politique de confidentialité
            </Link>
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleDecline}
            className="text-xs text-[#8B949E] border border-[#21262D] rounded-lg px-4 py-2 hover:border-[#484F58] hover:text-[#E6EDF3] transition-colors"
          >
            Refuser
          </button>
          <button
            onClick={handleAccept}
            className="text-xs font-semibold bg-[#3DDC97] text-[#0D1117] rounded-lg px-4 py-2 hover:bg-[#34c487] transition-colors"
          >
            Accepter
          </button>
        </div>

      </div>
    </div>
  );
}
