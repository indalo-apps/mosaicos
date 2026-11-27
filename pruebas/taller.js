// Prueba del taller (v2.17 en adelante): lo que acompaña mientras se dibuja en papel.
//  · Progreso: llegar al último paso marca «Trazado completo»; la casilla «Ya lo he dibujado en papel» se guarda,
//    va a la par en Trazar y en Imprimir, y sale en la galería, en la portada del alicatado, en Inicio y en Mis dibujos
//  · Pantalla encendida: la casilla solo sale si el navegador puede, y se recuerda
//  · «Comprueba antes de seguir» (v2.18): cada comprobación escrita apunta a un paso que existe; sale en el paso y no en el objetivo
//  · «Entintar» (v2.18): todos los alicatados enseñan la tinta (gruesa) y el lápiz (a rayas), y cambiar de paso vuelve al trazado
//  · «Recorrido para empezar» (v2.18): sus paradas y sus construcciones existen, y marca la siguiente
// Uso: node pruebas/con-servidor.js pruebas/taller.js       (CAPTURAS=/tmp/capturas para guardar imágenes)
const {chromium}=require('playwright');
const U='http://localhost:8765/index.html',CAP=process.env.CAPTURAS;
let mal=0,bien=0;const ok=(c,msg)=>{if(c)bien++;else{mal++;console.log('  ✗',msg);}};
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROME||'/usr/bin/google-chrome'});
  for(const loc of ['es-ES','en-US']){const EN=loc==='en-US';
    const pg=await b.newPage({viewport:{width:390,height:844},locale:loc});pg.on('pageerror',e=>{mal++;console.log('  ✗ error de JavaScript:',e.message);});
    const ir=async h=>{await pg.goto(U+h);await pg.waitForTimeout(300);};
    // ---- Progreso
    await ir('#alicatados');
    ok(await pg.locator('.pat-hecho').count()===0,`${loc}: sin haber hecho nada, la galería no marca ningún progreso`);
    await ir('#a/toledanos/trazado');
    ok(await pg.locator('#tz-hecho-fila').isHidden(),`${loc}: la casilla de «en papel» no sale hasta el último paso`);
    const N=await pg.evaluate(()=>PATS.toledanos.pasos.length);
    for(let i=0;i<N;i++){await pg.locator('#next').click();await pg.waitForTimeout(120);}
    ok(await pg.locator('#tz-hecho-fila').isVisible(),`${loc}: en el último paso sale «Ya lo he dibujado en papel»`);
    ok(await pg.evaluate(()=>hechoDe(PATS.toledanos).t),`${loc}: llegar al último paso marca el trazado completo`);
    await pg.locator('#tz-hecho').check();
    await ir('#a/toledanos/imprimir');
    ok(await pg.locator('#pp-hecho').isChecked(),`${loc}: la casilla de Imprimir va a la par que la de Trazar`);
    ok((await pg.locator('#ficha').innerText()).includes(EN?'Drawn on paper':'Dibujado en papel')===false,`${loc}: la portada solo sale en Trazar`);
    await ir('#a/toledanos/trazado');
    ok((await pg.locator('#ficha').innerText()).includes(EN?'Drawn on paper':'Dibujado en papel'),`${loc}: la portada del alicatado dice «Dibujado en papel»`);
    await ir('#alicatados');
    const chips=await pg.locator('[data-pat="toledanos"] .pat-hecho').innerText().catch(()=>'');
    ok(chips.includes(EN?'All steps done':'Trazado completo')&&chips.includes(EN?'Drawn on paper':'Dibujado en papel'),`${loc}: la galería marca el progreso con texto («${chips}»)`);
    ok(await pg.locator('[data-pat="toledanos"] .pat-hecho svg').count()===2,`${loc}: cada marca lleva su icono`);
    ok(await pg.locator('.pat-hecho').count()===1,`${loc}: solo se marca el alicatado trabajado`);
    if(CAP)await pg.screenshot({path:`${CAP}/taller_${loc}_galeria.png`});
    await ir('#mis');ok((await pg.locator('#lista-mis').innerText()).includes(EN?'Drawn on paper':'Dibujado en papel'),`${loc}: Mis dibujos recoge lo dibujado en papel`);
    await ir('#inicio');ok((await pg.locator('#n-alcazar').innerText()).includes(EN?'1 on paper':'1 en papel'),`${loc}: Inicio cuenta los dibujados en papel`);
    await ir('#a/toledanos/imprimir');await pg.locator('#pp-hecho').uncheck();
    ok(await pg.evaluate(()=>!hechoDe(PATS.toledanos).p),`${loc}: la casilla se puede quitar`);
    // ---- Pantalla encendida
    await ir('#a/toledanos/trazado');
    const puede=await pg.evaluate(()=>'wakeLock' in navigator);
    ok(await pg.locator('#vela-fila').isVisible()===puede,`${loc}: la casilla de la pantalla sale solo si el navegador puede`);
    if(puede){await pg.locator('#vela').uncheck();await pg.reload();await pg.waitForTimeout(300);
      ok(!(await pg.locator('#vela').isChecked()),`${loc}: se recuerda que no se quiere la pantalla encendida`);
      await pg.locator('#vela').check();}
    // ---- Comprueba antes de seguir
    const malas=await pg.evaluate(()=>{const M=[];for(const [T,met] of [[COMPROBAR,'pasos'],[COMPROBAR_B,'pasosB']])for(const id in T){const p=PATS[id];
        if(!p){M.push(id+': no existe');continue;}const PS=id==='lazo8'?Array(LAZO_PASOS).fill({}):p[met];
        for(const k in T[id]){const s=PS&&PS[k-1];if(!s)M.push(id+' paso '+k+': no existe');else if(s.tipo)M.push(id+' paso '+k+': es de tipo '+s.tipo+', no de construcción');
          if(T[id][k].length!==2||T[id][k].some(t=>!t||t.length<20))M.push(id+' paso '+k+': falta un idioma');}}
      for(const p of Object.values(PATS))for(const PS of [p.pasos,p.pasosB])if(PS)for(let i=1;i<=PS.length;i++){try{comprobaciones(p,i,PS,PS===p.pasosB,'1 cm');}catch(e){M.push(p.id+' paso '+i+': '+e.message);}}
      return M;});
    ok(!malas.length,`${loc}: comprobaciones mal puestas: ${malas.join('; ')}`);
    await ir('#a/taca/trazado');await pg.evaluate(()=>document.querySelector('[data-step="0"]').click());await pg.waitForTimeout(150);
    ok(await pg.locator('#stepok').isHidden(),`${loc}: en el objetivo no hay nada que comprobar`);
    await pg.evaluate(()=>document.querySelector('[data-step="1"]').click());await pg.waitForTimeout(200);
    ok((await pg.locator('#stepok').innerText()).includes(EN?'Check before you go on':'Comprueba antes de seguir'),`${loc}: el paso 1 de la taca trae su comprobación`);
    if(CAP)await pg.screenshot({path:`${CAP}/taller_${loc}_comprueba.png`,fullPage:true});
    for(const [id,paso,txt] of [['barca',8,EN?'equally wide':'mismo ancho'],['barca',9,EN?'alternating':'alternando'],['taca',6,'×'],['lazo8',8,EN?'alternating':'alternando']]){
      await ir(`#a/${id}/trazado`);await pg.evaluate(n=>document.querySelector(`[data-step="${n}"]`).click(),paso);await pg.waitForTimeout(200);
      ok((await pg.locator('#stepok').innerText().catch(()=>'')).includes(txt),`${loc}: ${id} paso ${paso} debería comprobar «${txt}»`);}
    await ir('#c/tri-lado');ok(await pg.locator('#stepok').isHidden()&&await pg.locator('#tinta-on').isHidden(),`${loc}: las construcciones de Aprender no llevan comprobación ni tinta`);
    // ---- Entintar
    const pats=await pg.evaluate(()=>Object.keys(PATS));
    for(const id of pats){await ir(`#a/${id}/trazado`);await pg.evaluate(()=>document.querySelector('[data-step="1"]').click());await pg.locator('#tinta-on').click();await pg.waitForTimeout(150);
      const t=await pg.evaluate(()=>{const sv=document.querySelector('#tzsvg svg'),lz=sv&&sv.querySelector('.tinta-lapiz');
        return {lapiz:lz?lz.querySelectorAll('line,circle,path,polygon,polyline').length:0,tinta:sv?sv.querySelectorAll('.tinta-tinta line, path, polygon').length:0,panel:!document.getElementById('tinta-panel').hidden,ap:document.getElementById('tinta-on').getAttribute('aria-pressed')};});
      ok(t.lapiz>0&&t.tinta>0&&t.panel&&t.ap==='true',`${loc}: ${id} · Entintar debe enseñar lápiz (${t.lapiz}) y tinta (${t.tinta})`);
      if(CAP&&!EN&&['taca','barca','lazo8','felipe','toledanos','arrayanes','jambas31'].includes(id))await pg.locator('#tzsvg').screenshot({path:`${CAP}/tinta_${id}.png`});
      await pg.locator('#next').click();await pg.waitForTimeout(120);
      ok(await pg.locator('#tinta-panel').isHidden()&&await pg.locator('#tinta-on').getAttribute('aria-pressed')==='false',`${loc}: ${id} · al cambiar de paso se vuelve al trazado`);}
    if(CAP){await ir('#a/barca/trazado');await pg.locator('#tinta-on').click();await pg.waitForTimeout(400);await pg.screenshot({path:`${CAP}/taller_${loc}_tinta.png`,fullPage:true});}
    // ---- Recorrido
    await pg.evaluate(()=>localStorage.removeItem('mosaicos-hecho-v1'));await ir('#inicio');await pg.reload();await pg.waitForTimeout(300);
    ok(await pg.locator('a[href="#recorrido"]').isVisible(),`${loc}: Inicio lleva al recorrido`);
    await ir('#recorrido');
    const reco=await pg.evaluate(()=>({n:document.querySelectorAll('#lista-recorrido>li').length,sig:[...document.querySelectorAll('#lista-recorrido>li')].findIndex(l=>l.classList.contains('sig')),
      rotos:[...document.querySelectorAll('#lista-recorrido a')].map(a=>a.getAttribute('href')).filter(h=>{const m=h.match(/^#a\/([\w-]+)\//),c=h.match(/^#c\/([\w-]+)$/);return !(m&&PATS[m[1]])&&!(c&&CONS.L.some(x=>x.id===c[1]));})}));
    ok(reco.n===7&&reco.sig===0&&!reco.rotos.length,`${loc}: el recorrido tiene 7 paradas, marca la primera como siguiente y no tiene enlaces rotos (${JSON.stringify(reco)})`);
    ok((await pg.locator('#lista-recorrido>li.sig').innerText()).includes(EN?'Next':'Siguiente'),`${loc}: la parada siguiente lo dice con texto`);
    if(CAP)await pg.screenshot({path:`${CAP}/taller_${loc}_recorrido.png`,fullPage:true});
    await pg.close();}
  await b.close();console.log(`${mal?'✗':'✓'} taller: ${bien} bien, ${mal} mal`);process.exit(mal?1:0);})();
