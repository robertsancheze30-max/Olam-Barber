module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("Method not allowed");
    return;
  }

  try {
    const { barberoId, subscription } = req.body;
    const key = barberoId || "master";
    const url = `https://olam-barber-default-rtdb.firebaseio.com/pushSubscriptions/${encodeURIComponent(key)}.json`;

    await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription)
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
