// Prueba de las cotas de «En papel» (v2.16): ningún texto de medida se monta sobre otro ni se sale del dibujo.
// Sale del fallo del 27-11-2026 (A4 vertical, margen 3 cm, 1 columna: «6,15 cm», «3,5 cm», «R 1,75 cm» y «7 cm» encimados).
// Recorre todos los alicatados con varios papeles, orientaciones, márgenes y número de módulos, y mide las cajas reales de los textos.
// Uso: node pruebas/con-servidor.js pruebas/cotas.js
const {chromium}=require('playwright');
const U='http://localhost:8765/index.html';
const PAPELES=[['A4','v',30,1,3],['A4','v',15,2,2],['A4','h',15,3,2],['A5','v',15,1,1],['A3','v',20,2,4],['A4','v',30,1,1],['A5','h',10,4,1],['A4','v',50,2,3]];
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROME||'/usr/bin/google-chrome'});let mal=0,bien=0;
  const pg=await b.newPage({viewport:{width:390,height:844},locale:'es-ES'});pg.on('pageerror',e=>{mal++;console.log('  ✗ error de JavaScript:',e.message);});
  await pg.goto(U+'#inicio');const pats=await pg.evaluate(()=>Object.keys(PATS));
  for(const [p,ori,m,c,r] of PAPELES){
    await pg.evaluate(([p,ori,m,c,r])=>{localStorage.setItem('laceria-papel-v1',JSON.stringify({p,ori,m}));const e=JSON.parse(localStorage.getItem('laceria-export-v1')||'{}');e.c=c;e.r=r;localStorage.setItem('laceria-export-v1',JSON.stringify(e));},[p,ori,m,c,r]);
    for(const id of pats){
      await pg.goto(U+'#inicio');await pg.reload();await pg.goto(U+`#a/${id}/imprimir`);await pg.waitForTimeout(200);
      const res=await pg.evaluate(()=>{const sv=document.querySelector('#pp-vista svg');if(!sv)return null;const S=sv.getBoundingClientRect();
        const T=[...sv.querySelectorAll('text')].map(t=>({t:t.textContent,r:t.getBoundingClientRect()}));const malos=[];
        for(let i=0;i<T.length;i++){const a=T[i].r;
          if(a.left<S.left-1||a.right>S.right+1||a.top<S.top-1||a.bottom>S.bottom+1)malos.push(`«${T[i].t}» se sale`);
          for(let j=i+1;j<T.length;j++){const q=T[j].r,dx=Math.min(a.right,q.right)-Math.max(a.left,q.left),dy=Math.min(a.bottom,q.bottom)-Math.max(a.top,q.top);
            if(dx>1&&dy>1)malos.push(`«${T[i].t}» sobre «${T[j].t}»`);}}
        return {n:T.length,malos};});
      if(!res)continue;
      if(res.malos.length){mal++;console.log(`  ✗ ${id} · ${p} ${ori} margen ${m/10} cm · ${c}×${r}: ${res.malos.join('; ')}`);}else bien++;}}
  await b.close();console.log(`${mal?'✗':'✓'} cotas de «En papel»: ${bien} bien, ${mal} mal`);process.exit(mal?1:0);})();
