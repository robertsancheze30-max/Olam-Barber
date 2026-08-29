const webpush = require("web-push");

webpush.setVapidDetails(
  "mailto:contacto@olambarber.cl",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("Method not allowed");
    return;
  }

  try {
    const { barberoId, title, body, url } = req.body;
    const targets = new Set();
    targets.add(barberoId || "master");
    targets.add("master");
    targets.add("admin");

    const payload = JSON.stringify({ title, body, url: url || "/admin-src.html" });

    for (const key of targets) {
      const subUrl = `https://olam-barber-default-rtdb.firebaseio.com/pushSubscriptions/${encodeURIComponent(key)}.json`;
      const subRes = await fetch(subUrl);
      const subscription = await subRes.json();
      if (!subscription || !subscription.endpoint) continue;
      try {
        await webpush.sendNotification(subscription, payload);
      } catch (e) {
        // Suscripción vencida o inválida: la ignoramos sin romper el resto.
      }
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
