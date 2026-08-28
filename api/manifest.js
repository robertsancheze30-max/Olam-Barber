module.exports = (req, res) => {
  let barbero = req.query.barbero;

  if (!barbero && req.headers.referer){
    try {
      const refUrl = new URL(req.headers.referer);
      barbero = refUrl.searchParams.get("barbero");
    } catch(e){}
  }

  const manifest = {
    name: barbero ? "Mi Panel - Olam Barber" : "Panel Admin - Olam Barber",
    short_name: barbero ? "Mi Panel" : "Panel Admin",
    start_url: barbero ? `/admin.html?barbero=${encodeURIComponent(barbero)}` : "/admin.html",
    scope: "/",
    display: "standalone",
    background_color: "#0a0906",
    theme_color: "#0a0906",
    icons: [
      { src: "/icon.jpg", sizes: "192x192", type: "image/jpeg" },
      { src: "/icon.jpg", sizes: "512x512", type: "image/jpeg" }
    ]
  };

  res.setHeader("Content-Type", "application/manifest+json");
  res.status(200).send(JSON.stringify(manifest));
};
