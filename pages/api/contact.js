// Escape HTML special characters to prevent XSS in email body
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Simple rate-limit store (in-memory, resets on cold start — good enough for low traffic)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 3;

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, start: now };
  if (now - entry.start > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, start: now });
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX) return true;
  rateLimitMap.set(ip, { count: entry.count + 1, start: entry.start });
  return false;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  // Rate limiting
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket?.remoteAddress || "unknown";
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: "Trop de requêtes. Veuillez réessayer dans une minute." });
  }

  const { nom, courriel, sujet, message } = req.body;

  if (!nom || !courriel || !sujet || !message) {
    return res.status(400).json({ error: "Tous les champs sont requis" });
  }

  // Basic email format validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(courriel)) {
    return res.status(400).json({ error: "Adresse courriel invalide" });
  }

  // Sanitize all user inputs before injecting into HTML
  const safeName    = escapeHtml(nom);
  const safeEmail   = escapeHtml(courriel);
  const safeSujet   = escapeHtml(sujet);
  const safeMessage = escapeHtml(message);

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "monportefeuille.ca <no-reply@monportefeuille.ca>",
        to: ["info@monportefeuille.ca"],
        reply_to: safeEmail,
        subject: `[${safeSujet}] Message de ${safeName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
            <h2 style="color: #1a1a1a; margin-bottom: 24px;">Nouveau message — monportefeuille.ca</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; width: 100px;">Nom</td>
                <td style="padding: 8px 0; color: #1a1a1a; font-weight: 500;">${safeName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Courriel</td>
                <td style="padding: 8px 0; color: #1a1a1a; font-weight: 500;">${safeEmail}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Sujet</td>
                <td style="padding: 8px 0; color: #1a1a1a; font-weight: 500;">${safeSujet}</td>
              </tr>
            </table>
            <div style="margin-top: 24px; padding: 16px; background: #f5f5f5; border-radius: 8px;">
              <p style="color: #666; font-size: 12px; margin: 0 0 8px;">Message</p>
              <p style="color: #1a1a1a; margin: 0; white-space: pre-wrap;">${safeMessage}</p>
            </div>
            <p style="color: #999; font-size: 11px; margin-top: 24px;">
              Répondre directement à cet email pour contacter ${safeName} à ${safeEmail}
            </p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Resend error:", error);
      return res.status(500).json({ error: "Erreur lors de l'envoi" });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
