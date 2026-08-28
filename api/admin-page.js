const fs = require("fs");
const path = require("path");

module.exports = (req, res) => {
  const barbero = req.query.barbero;
  const filePath = path.join(process.cwd(), "admin-src.html");

  let html = fs.readFileSync(filePath, "utf8");

  const manifestHref = barbero
    ? `/api/manifest?barbero=${encodeURIComponent(barbero)}`
    : "/api/manifest";

  html = html.replace(
    /<link rel="manifest" id="manifest-link" href="[^"]*">/,
    `<link rel="manifest" id="manifest-link" href="${manifestHref}">`
  );

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.status(200).send(html);
};
