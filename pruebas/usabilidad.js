// Prueba de usabilidad en el móvil (v2.15): mide lo que axe no ve. Sale de la revisión del 26-11-2026.
//  · Trazar: «Empezar/Siguiente» se puede tocar (también con el aviso de instalar) y, tras tocarlo, el texto del paso se ve entero
//  · Lo fijo bajo las pestañas (dibujo de Trazar, Teselar y Colorear) ocupa como mucho el 36 % de la pantalla al bajar
//  · Al entrar en un alicatado se ven las etapas en la primera pantalla
//  · Cabecera en una sola fila de botones; nada de menos de 44 px; nada se sale por la derecha (también con letra «Muy grande»)
//  · El aviso de instalar no tapa el final de la página
//  · «Mis dibujos» solo cuenta lo pintado de verdad; el foco va al título al cambiar de pantalla; la fila de vistas avisa de que se desliza
// Uso: node pruebas/con-servidor.js pruebas/usabilidad.js
const {chromium}=require('playwright');
const U='http://localhost:8765/index.html';
const UA='Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
const TAM=[[375,667],[390,844]];
let mal=0,bien=0;const ok=(c,msg)=>{if(c)bien++;else{mal++;console.log('  ✗',msg);}};
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROME||'/usr/bin/google-chrome'});
  const nuevo=async(w,h,o={})=>{const c=await b.newContext({viewport:{width:w,height:h},isMobile:true,hasTouch:true,deviceScaleFactor:2,locale:'es-ES',userAgent:UA,...o});
    const p=await c.newPage();p.on('pageerror',e=>{mal++;console.log('  ✗ error de JavaScript:',e.message);});return [c,p];};
  for(const [w,h] of TAM){console.log(`· ${w}×${h}`);
    const [c,p]=await nuevo(w,h);await p.goto(U+'#inicio');await p.waitForSelector('#ik-banner',{timeout:6000}).catch(()=>{});
    ok(await p.locator('#ik-banner').count()===1,`${w}: debería salir el aviso de instalar (la prueba lo necesita)`);
    const pats=await p.evaluate(()=>Object.keys(PATS));
    for(const id of pats){
      await p.goto(U+`#a/${id}/trazado`);await p.waitForTimeout(350);
      // etapas a la vista al entrar
      const tabs=await p.evaluate(()=>document.getElementById('barra-etapas').getBoundingClientRect().top);
      ok(tabs<=0.72*h,`${id}: las etapas empiezan en ${Math.round(tabs)} px, por debajo del 72 % de la pantalla`);
      for(let k=0;k<2;k++){
        // ¿se puede tocar «Empezar / Siguiente»? (con el aviso de instalar puesto)
        const toca=await p.evaluate(async()=>{const n=document.getElementById('next');n.scrollIntoView({block:'center'});
          const prueba=()=>{const r=n.getBoundingClientRect(),e=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);return !!e&&(e===n||n.contains(e));};
          if(prueba())return true;scrollTo(0,1e6);return prueba();});
        ok(toca,`${id}: no se puede tocar «${k?'Siguiente':'Empezar'}» en ningún sitio`);
        if(!toca)break;
        await p.locator('#next').tap();await p.waitForTimeout(450);
        const r=await p.evaluate(()=>{const se=document.querySelector('#tab-trazado .stage'),st=se.getBoundingClientRect(),t=document.getElementById('steph').getBoundingClientRect(),x=document.getElementById('stept').getBoundingClientRect();
          const ban=document.getElementById('ik-banner'),abajo=ban?ban.getBoundingClientRect().top:innerHeight;
          const tb=document.getElementById('barra-etapas').getBoundingClientRect().bottom;
          return {tit:t.top>=st.bottom-1&&t.bottom<=abajo,fijo:(st.bottom-tb)/innerHeight,stuck:Math.abs(st.top-parseFloat(getComputedStyle(se).top))<2};});
        ok(r.tit,`${id}: tras tocar Siguiente (paso ${k+1}), el título del paso queda tapado`);
        if(r.stuck)ok(r.fijo<=0.36,`${id}: el dibujo fijo de Trazar llega al ${Math.round(r.fijo*100)} % de la pantalla`);}
      // Teselar y Colorear, bajando del todo
      for(const e of ['teselar','colorear']){await p.goto(U+`#a/${id}/${e}`);await p.waitForTimeout(350);await p.evaluate(()=>scrollTo(0,1e6));await p.waitForTimeout(120);
        const f=await p.evaluate(e=>{const st=document.querySelector(e==='colorear'?'#tab-colorear>.stage':'#tab-teselar .stage').getBoundingClientRect(),tb=document.getElementById('barra-etapas').getBoundingClientRect().bottom;return (st.bottom-tb)/innerHeight;},e);
        ok(f<=0.36,`${id}/${e}: lo fijo llega al ${Math.round(f*100)} % de la pantalla`);}
      const d=await p.evaluate(()=>{const b=document.getElementById('deshacer').getBoundingClientRect(),z=document.querySelector('#svg+.zoom-ui').getBoundingClientRect();return {w:b.width,h:b.height,sobre:b.top>=z.top-1&&b.bottom<=z.bottom+1}});
      ok(d.sobre&&d.w>=44&&d.h>=44,`${id}: Deshacer debería ir sobre el dibujo, de 44 px (${Math.round(d.w)}×${Math.round(d.h)})`);}
    // cabecera, toques, desbordes y final de página sobre el aviso
    for(const r of ['#inicio','#alicatados','#alhambra','#aprender','#mis','#c/movimientos','#a/jambas31/trazado','#a/felipe/colorear','#a/felipe/imprimir']){
      await p.goto(U+r);await p.waitForTimeout(350);
      const x=await p.evaluate(()=>{const fila=[...document.querySelectorAll('.cab-top>a,.cab-top>button')].filter(e=>!e.hidden&&e.offsetParent).map(e=>Math.round(e.getBoundingClientRect().top));
        const peq=[...document.querySelectorAll('button,a[href],input,select,summary')].filter(e=>{if(!e.offsetParent||e.closest('.dlg'))return false;let r=e.getBoundingClientRect();const l=e.closest('.row');if(/checkbox|color|range/.test(e.type)&&l)r=l.getBoundingClientRect();return r.width>0&&(r.width<43.5||r.height<43.5);}).map(e=>(e.id||e.className||e.tagName)+' '+(e.innerText||'').trim().slice(0,15));
        scrollTo(0,1e6);const pie=document.querySelector('footer').getBoundingClientRect().bottom,ban=document.getElementById('ik-banner');
        return {filas:new Set(fila).size,peq,ancho:document.documentElement.scrollWidth,tapa:ban?pie>ban.getBoundingClientRect().top+1:false};});
      ok(x.filas===1,`${r}: los botones de la cabecera ocupan ${x.filas} filas`);
      ok(!x.peq.length,`${r}: toques de menos de 44 px: ${x.peq.join(', ')}`);
      ok(x.ancho<=w,`${r}: la página mide ${x.ancho} px de ancho`);
      ok(!x.tapa,`${r}: el aviso de instalar tapa el final de la página`);}
    // la fila de vistas avisa de que hay más
    await p.goto(U+'#a/felipe/colorear');await p.waitForTimeout(400);
    ok(await p.evaluate(()=>{const v=document.querySelector('#tab-colorear .viewbar');return v.scrollWidth<=v.clientWidth||v.classList.contains('mas-dcha');}),'la fila de vistas no avisa de que se desliza');
    // foco al título al cambiar de pantalla
    await p.goto(U+'#inicio');await p.waitForTimeout(300);await p.locator('.monu').first().tap();await p.waitForTimeout(400);
    ok(await p.evaluate(()=>document.activeElement&&document.activeElement.id==='titulo'),'al cambiar de pantalla el foco no va al título');
    await c.close();}
  // «Mis dibujos»: solo lo pintado
  {const [c,p]=await nuevo(390,844);await p.goto(U+'#mis');await p.waitForTimeout(300);
    const n=()=>p.evaluate(()=>document.querySelectorAll('#lista-mis li').length);
    ok(await n()===0,'«Mis dibujos» no está vacío la primera vez');
    for(const r of ['#a/cubos/colorear','#a/toledanos/trazado','#a/felipe/teselar']){await p.goto(U+r);await p.waitForTimeout(400);}
    await p.goto(U+'#mis');await p.waitForTimeout(300);ok(await n()===0,'«Mis dibujos» cuenta dibujos solo por abrirlos');
    await p.goto(U+'#a/cubos/colorear');await p.waitForTimeout(400);await p.evaluate(()=>{const s=document.querySelector('#brush .sw:not(.sel)');s&&s.click();});
    await p.evaluate(()=>{const e=document.querySelector('#svg [data-i],#svg polygon,#svg path');e&&e.dispatchEvent(new MouseEvent('click',{bubbles:true}));});
    const sv=await p.locator('#svg svg').boundingBox();await p.mouse.click(sv.x+sv.width*0.37,sv.y+sv.height*0.41);await p.waitForTimeout(200);
    await p.goto(U+'#mis');await p.waitForTimeout(300);ok(await n()===1,`«Mis dibujos» debería tener 1 dibujo tras pintar (tiene ${await n()})`);
    await c.close();}
  // letra «Muy grande» en un móvil pequeño: nada se sale
  {const [c,p]=await nuevo(375,667);await p.goto(U+'#inicio');await p.waitForTimeout(300);
    await p.evaluate(()=>{try{const k=Object.keys(localStorage).find(k=>/pref/.test(k));}catch(e){}});
    await p.locator('#btn-ajustes').tap();await p.locator('[data-op=letra] [data-val=muy-grande]').tap();await p.keyboard.press('Escape');
    for(const r of ['#inicio','#alicatados','#alhambra','#aprender','#mis','#a/lazo8/trazado','#a/lazo8/teselar','#a/lazo8/colorear','#a/lazo8/imprimir','#c/movimientos']){await p.goto(U+r);await p.waitForTimeout(350);
      const x=await p.evaluate(()=>{const t=document.querySelector('.tabs.etapas');return {ancho:document.documentElement.scrollWidth,tabs:t.offsetParent?t.scrollWidth<=t.clientWidth+1:true,fuera:[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.right>innerWidth+1&&!e.closest('.viewbar,.galeria:not(#galeria),.dlg,#ik-banner')&&getComputedStyle(e).position!=='fixed';}).slice(0,3).map(e=>e.id||String(e.className.baseVal??e.className)||e.tagName)};});
      ok(x.ancho<=375,`Muy grande ${r}: la página mide ${x.ancho} px (${x.fuera.join(', ')})`);ok(x.tabs,`Muy grande ${r}: las etapas no caben`);}
    await c.close();}
  await b.close();console.log(`${mal?'✗':'✓'} usabilidad: ${bien} comprobaciones bien, ${mal} mal`);process.exit(mal?1:0);})();
