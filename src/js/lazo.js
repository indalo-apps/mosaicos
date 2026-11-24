// Shared renderer: builds the lazo SVG as a string (used in the page and with node for the PDFs)
function renderLazo(D, o) {
  const f = n => +n.toFixed(3);
  const u = 'lz' + (renderLazo.n = (renderLazo.n || 0) + 1);
  const W = o.rw + 2 * o.ow;
  const vb = `${o.x0} ${o.y0} ${o.w} ${o.h}`;
  // o.giro=[ángulo,cx,cy]: el dibujo se gira dentro del marco (para enseñar el módulo como en el libro)
  const cb = o.giro ? (() => { const cx = o.x0 + o.w / 2, cy = o.y0 + o.h / 2, r = Math.hypot(o.w, o.h) / 2; return { x0: cx - r, y0: cy - r, w: 2 * r, h: 2 * r }; })() : o;
  const size = o.unitmm ? `width="${f(o.w * o.unitmm)}mm" height="${f(o.h * o.unitmm)}mm"` : `width="100%"`;
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" ${size} preserveAspectRatio="xMidYMid meet">`;
  s += `<defs><clipPath id="${u}clip">${o.clip ? `<polygon points="${o.clip.map(p => p.map(f).join(',')).join(' ')}"/>` : `<rect x="${o.x0}" y="${o.y0}" width="${o.w}" height="${o.h}"/>`}</clipPath>`;
  if (o.wc) {
    s += `<filter id="${u}wc" x="${o.x0}" y="${o.y0}" width="${o.w}" height="${o.h}" filterUnits="userSpaceOnUse">` +
      `<feTurbulence type="fractalNoise" baseFrequency="0.35" numOctaves="4" seed="7" result="n"/>` +
      `<feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0.7 0 0 0 -0.3" result="hi"/>` +
      `<feComposite in="hi" in2="SourceGraphic" operator="in" result="hiIn"/>` +
      `<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="m"/>` +
      `<feColorMatrix in="m" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.55 0 0 0 -0.27" result="lo"/>` +
      `<feComposite in="lo" in2="SourceGraphic" operator="in" result="loIn"/>` +
      `<feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="hiIn"/><feMergeNode in="loIn"/></feMerge></filter>`;
  }
  s += `</defs><g clip-path="url(#${u}clip)">`;
  s += `<rect x="${o.x0}" y="${o.y0}" width="${o.w}" height="${o.h}" fill="${o.ribbon}"/>`;
  if (o.giro) s += `<g transform="rotate(${o.giro.join(' ')})">`;
  // pieces
  s += `<g${o.wc ? ` filter="url(#${u}wc)"` : ''}>`;
  const inView = (pts) => {
    for (let i = 0; i < pts.length; i += 2)
      if (pts[i] > cb.x0 - 1 && pts[i] < cb.x0 + cb.w + 1 && pts[i + 1] > cb.y0 - 1 && pts[i + 1] < cb.y0 + cb.h + 1) return true;
    return false;
  };
  D.F.forEach((fc, i) => {
    const pts = fc[1];
    if (!inView(pts)) return;
    let p = '';
    for (let k = 0; k < pts.length; k += 2) p += pts[k] + ',' + pts[k + 1] + ' ';
    const col = (o.over && o.over[i]) || o.cols[fc[0]];
    let op = '';
    if (o.wc) { const r = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1; op = ` fill-opacity="${f(0.82 + 0.18 * r)}"`; }
    s += `<polygon data-i="${i}" points="${p.trim()}" fill="${col}"${op} stroke="${col}" stroke-width="0.02"/>`;
  });
  s += `</g>`;
  // ribbons
  const paths = D.S.map(([cl, pts]) => {
    let d = 'M' + pts[0] + ',' + pts[1];
    for (let k = 2; k < pts.length; k += 2) d += 'L' + pts[k] + ',' + pts[k + 1];
    return d + (cl ? 'Z' : '');
  });
  const ribbonAttrs = `fill="none" stroke-linejoin="miter" stroke-miterlimit="8"`;
  s += `<g pointer-events="none">`;
  if (o.ow > 0) paths.forEach(d => { s += `<path d="${d}" ${ribbonAttrs} stroke="${o.outline}" stroke-width="${f(W)}"/>`; });
  paths.forEach(d => { s += `<path d="${d}" ${ribbonAttrs} stroke="${o.ribbon}" stroke-width="${f(o.rw)}"/>`; });
  if (o.interlace) {
    D.O.forEach(([x, y, dx, dy, sn]) => {
      if (x < cb.x0 - 2 || x > cb.x0 + cb.w + 2 || y < cb.y0 - 2 || y > cb.y0 + cb.h + 2) return;
      const cs = Math.sqrt(Math.max(0, 1 - sn * sn));
      const L = W / sn + W * cs / sn + 0.02;
      const a = `x1="${f(x - dx * L / 2)}" y1="${f(y - dy * L / 2)}" x2="${f(x + dx * L / 2)}" y2="${f(y + dy * L / 2)}"`;
      if (o.ow > 0) s += `<line ${a} stroke="${o.outline}" stroke-width="${f(W)}"/>`;
      // la cinta clara un poco más larga que su contorno tapa la costura del extremo
      const e = 0.03, a2 = `x1="${f(x - dx * (L / 2 + e))}" y1="${f(y - dy * (L / 2 + e))}" x2="${f(x + dx * (L / 2 + e))}" y2="${f(y + dy * (L / 2 + e))}"`;
      s += `<line ${a2} stroke="${o.ribbon}" stroke-width="${f(o.rw)}"/>`;
    });
  }
  s += `</g>`;
  // construction (book method: 1-unit grid, 5-7-5-7 lines, diagonals of the eight-pointed stars)
  if (o.grid || o.construct) {
    s += `<g pointer-events="none" fill="none">`;
    const xa = Math.floor(o.x0) - 1, xb = Math.ceil(o.x0 + o.w) + 1, ya = Math.floor(o.y0) - 1, yb = Math.ceil(o.y0 + o.h) + 1;
    if (o.grid) {
      for (let x = xa; x <= xb; x++) s += `<line x1="${x}" y1="${ya}" x2="${x}" y2="${yb}" stroke="#7fa6c9" stroke-width="0.025"/>`;
      for (let y = ya; y <= yb; y++) s += `<line x1="${xa}" y1="${y}" x2="${xb}" y2="${y}" stroke="#7fa6c9" stroke-width="0.025"/>`;
    }
    if (o.construct) {
      for (let k = Math.floor(xa / 12) - 1; k <= Math.ceil(xb / 12) + 1; k++) for (const e of [-2.5, 2.5]) {
        const x = 12 * k + e; s += `<line x1="${x}" y1="${ya}" x2="${x}" y2="${yb}" stroke="#2b4f73" stroke-width="0.07"/>`;
      }
      for (let k = Math.floor(ya / 12) - 1; k <= Math.ceil(yb / 12) + 1; k++) for (const e of [-2.5, 2.5]) {
        const y = 12 * k + e; s += `<line x1="${xa}" y1="${y}" x2="${xb}" y2="${y}" stroke="#2b4f73" stroke-width="0.07"/>`;
      }
      const span = (xb - xa) + (yb - ya);
      for (let k = Math.floor((xa + ya) / 12) - 1; k <= Math.ceil((xb + yb) / 12) + 1; k++) for (const e of [-3.5, 3.5]) {
        const c = 12 * k + e; // u+v=c
        s += `<line x1="${xa}" y1="${c - xa}" x2="${xb}" y2="${c - xb}" stroke="#b5444b" stroke-width="0.06" stroke-dasharray="0.35 0.2"/>`;
      }
      for (let k = Math.floor((xa - yb) / 12) - 1; k <= Math.ceil((xb - ya) / 12) + 1; k++) for (const e of [-3.5, 3.5]) {
        const c = 12 * k + e; // u-v=c
        s += `<line x1="${xa}" y1="${xa - c}" x2="${xb}" y2="${xb - c}" stroke="#b5444b" stroke-width="0.06" stroke-dasharray="0.35 0.2"/>`;
      }
    }
    s += `</g>`;
  }
  if (o.giro) s += `</g>`;
  s += `</g>`;
  if (o.frame) s += o.clip ? `<polygon points="${o.clip.map(p => p.map(f).join(',')).join(' ')}" fill="none" stroke="${o.outline}" stroke-width="0.12"/>` : `<rect x="${o.x0}" y="${o.y0}" width="${o.w}" height="${o.h}" fill="none" stroke="${o.outline}" stroke-width="0.08"/>`;
  return s + `</svg>`;
}
if (typeof module !== 'undefined') module.exports = { renderLazo };
