// Saca una versión nueva cambiando los tres sitios a la vez y reconstruye index.html:
//   node herramientas/version.js 2.17 --es "🔆 Novedad en español" "✅ Otra" --en "🔆 What’s new in English" "✅ Another"
// 1) <meta name="app-version"> en src/plantilla.html   2) CACHE en sw.js
// 3) una entrada al principio de NOVEDADES (src/js/ajustes.js), en español y en inglés (las dos listas, con el mismo número de novedades)
const fs = require("fs"), path = require("path"), { execFileSync } = require("child_process");
const raiz = path.join(__dirname, "..");
const [, , ver, ...resto] = process.argv;
const es = [], en = []; let a = null;
for (const x of resto) { if (x === "--es") a = es; else if (x === "--en") a = en; else if (a) a.push(x); }
if (!/^\d+(\.\d+){1,2}$/.test(ver || "") || !es.length || es.length !== en.length) {
  console.error('Uso: node herramientas/version.js <versión> --es "novedad 1" ["novedad 2" …] --en "what’s new 1" ["what’s new 2" …]\n(el mismo número de novedades en los dos idiomas)'); process.exit(1);
}
const cambiar = (rel, re, por) => {
  const f = path.join(raiz, rel), t = fs.readFileSync(f, "utf8");
  if (!re.test(t)) { console.error("No encuentro dónde cambiar la versión en " + rel); process.exit(1); }
  fs.writeFileSync(f, t.replace(re, por));
};
const entrada = L => `    [${JSON.stringify(ver)},[${L.map(n => JSON.stringify(n)).join(",")}]],\n`;
if (fs.readFileSync(path.join(raiz, "src/js/ajustes.js"), "utf8").includes(`[${JSON.stringify(ver)},[`)) { console.error("La versión " + ver + " ya está en NOVEDADES."); process.exit(1); }
cambiar("src/plantilla.html", /<meta name="app-version" content="[^"]*">/, `<meta name="app-version" content="${ver}">`);
cambiar("sw.js", /const CACHE = "mosaicos-[^"]*";/, `const CACHE = "mosaicos-${ver}";`);
cambiar("src/js/ajustes.js", /(const NOVEDADES=EN\?\[\n)/, (m, c) => c + entrada(en));
cambiar("src/js/ajustes.js", /(\n  \]:\[\n)/, (m, c) => c + entrada(es));
execFileSync("node", [path.join(__dirname, "construir.js")], { stdio: "inherit" });
console.log("Versión " + ver + " lista. Antes de publicar: npm test");
