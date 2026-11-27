// Prueba del taller (v2.17 en adelante): lo que acompaña mientras se dibuja en papel.
//  · Progreso: llegar al último paso marca «Trazado completo»; la casilla «Ya lo he dibujado en papel» se guarda,
//    va a la par en Trazar y en Imprimir, y sale en la galería, en la portada del alicatado, en Inicio y en Mis dibujos
//  · Pantalla encendida: la casilla solo sale si el navegador puede, y se recuerda
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
    await pg.close();}
  await b.close();console.log(`${mal?'✗':'✓'} taller: ${bien} bien, ${mal} mal`);process.exit(mal?1:0);})();
