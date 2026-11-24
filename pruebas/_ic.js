const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome'});const pg=await b.newPage({viewport:{width:390,height:800},deviceScaleFactor:2,locale:process.env.L||'es-ES'});const errs=[];pg.on('pageerror',e=>errs.push(e.message));
const U='http://localhost:8765/index.html';
await pg.goto(U+'#a/felipe/trazado');await pg.waitForTimeout(700);await pg.screenshot({path:'/tmp/i1.png'});
await pg.goto(U+'#a/felipe/colorear');await pg.waitForTimeout(700);await pg.evaluate(()=>scrollTo(0,250));await pg.screenshot({path:'/tmp/i2.png'});
await pg.goto(U+'#a/felipe/imprimir');await pg.waitForTimeout(700);await pg.evaluate(()=>scrollTo(0,350));await pg.screenshot({path:'/tmp/i3.png'});
await pg.goto(U+'#a/felipe/teselar');await pg.waitForTimeout(700);await pg.click('#ts-tesela summary');await pg.evaluate(()=>document.querySelector('#ts-tesela').scrollIntoView());await pg.waitForTimeout(300);await pg.screenshot({path:'/tmp/i4.png'});
console.log(errs, await pg.evaluate(()=>document.querySelectorAll('svg.ic').length));await b.close();})();
