// Prueba en el navegador: recorre todas las pantallas (cada alicatado en sus 4 etapas, construcciones, inicio…)
// en español e inglés, claro y oscuro, móvil y ordenador; pasa axe (accesibilidad) y falla si hay errores de JavaScript.
// Necesita Playwright, Chrome y axe-core:  npm i playwright axe-core
// Uso: node pruebas/con-servidor.js pruebas/navegador.js       (CAPTURAS=/tmp/capturas para guardar imágenes)
const {chromium}=require('playwright'),fs=require('fs');
const AX=fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8');
const U='http://localhost:8765/index.html',CAP=process.env.CAPTURAS;
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROME||'/usr/bin/google-chrome'});let fallos=0;
  const casos=[['es-ES','light',390],['en-US','dark',390],['es-ES','dark',1280],['es-ES','light',820]];
  for(const [loc,tema,ancho] of casos){
    const pg=await b.newPage({locale:loc,colorScheme:tema,viewport:{width:ancho,height:900}});const errs=[];pg.on('pageerror',e=>errs.push(e.message));
    await pg.goto(U+'#inicio');await pg.waitForTimeout(400);
    const {pats,cons}=await pg.evaluate(()=>({pats:Object.keys(PATS),cons:CONS.L.map(c=>c.id)}));
    const rutas=['#inicio','#aprender','#alicatados','#alhambra','#mis','#recorrido',...cons.slice(0,4).map(c=>'#c/'+c),
      ...pats.flatMap(p=>['trazado','teselar','colorear','imprimir'].map(e=>`#a/${p}/${e}`))];
    const malas=new Map();
    for(const r of rutas){await pg.goto(U+r);await pg.waitForTimeout(r.startsWith('#a/')?250:150);
      if(CAP&&(r.endsWith('trazado')||!r.startsWith('#a/')))await pg.screenshot({path:`${CAP}/${loc}_${tema}_${ancho}_${r.replace(/\W/g,'_')}.png`});
      await pg.evaluate(AX);const v=await pg.evaluate(async()=>(await axe.run(document,{runOnly:['wcag2a','wcag2aa','best-practice']})).violations.map(v=>v.id+'('+v.nodes.length+')'));
      for(const x of v)malas.set(x,(malas.get(x)||[]).concat(r));}
    const ok=!malas.size&&!errs.length;if(!ok)fallos++;
    console.log(`${ok?'✓':'✗'} ${loc} ${tema} ${ancho}px · ${rutas.length} pantallas`+(malas.size?' · axe: '+[...malas].map(([k,r])=>k+' en '+r.slice(0,3).join(' ')).join('; '):'')+(errs.length?' · errores: '+[...new Set(errs)].join(' | '):''));
    await pg.close();}
  await b.close();process.exit(fallos?1:0);})();
