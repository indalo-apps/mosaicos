/* ===== Idioma (v1.5): español o inglés. «Automático» sigue al móvil (español, catalán, gallego y vasco → español) ===== */
const IDIOMA=(function(){let p='auto';try{p=(JSON.parse(localStorage.getItem('laceria-pref-v1')||'{}').idioma)||'auto';}catch(e){}
  if(p==='es'||p==='en')return p;const l=(navigator.languages&&navigator.languages[0])||navigator.language||'es';return /^(es|ca|gl|eu)\b/i.test(l)?'es':'en';})();
const EN=IDIOMA==='en',tr=(es,en)=>EN?en:es;
document.documentElement.lang=IDIOMA;
