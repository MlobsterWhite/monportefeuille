export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { nom, courriel, sujet, message } = req.body;

  if (!nom || !courriel || !sujet || !message) {
    return res.status(400).json({ error: "Tous les champs sont requis" });
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "monportefeuille.ca <no-reply@monportefeuille.ca>",
        to: ["mleblanc.prod@gmail.com"],
        reply_to: courriel,
        subject: `[${sujet}] Message de ${nom}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
            <h2 style="color: #1a1a1a; margin-bottom: 24px;">Nouveau message — monportefeuille.ca</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; width: 100px;">Nom</td>
                <td style="padding: 8px 0; color: #1a1a1a; font-weight: 500;">${nom}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Courriel</td>
                <td style="padding: 8px 0; color: #1a1a1a; font-weight: 500;">${courriel}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Sujet</td>
                <td style="padding: 8px 0; color: #1a1a1a; font-weight: 500;">${sujet}</td>
              </tr>
            </table>
            <div style="margin-top: 24px; padding: 16px; background: #f5f5f5; border-radius: 8px;">
              <p style="color: #666; font-size: 12px; margin: 0 0 8px;">Message</p>
              <p style="color: #1a1a1a; margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
            <p style="color: #999; font-size: 11px; margin-top: 24px;">
              Répondre directement à cet email pour contacter ${nom} à ${courriel}
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
