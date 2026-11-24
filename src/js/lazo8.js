
const NAMES=['Estrella de las esquinas','Pieza pequeña junto a la estrella','Alfardón (hexágono alargado)','Pieza en V de los lados','Triángulo junto al alfardón','Triángulo junto a la estrella central','Estrella de los bordes','Pieza en V del centro','Estrella central'];
const PRESETS={
 'Alcázar':{cols:['#161616','#1f5f5b','#161616','#1f5f5b','#161616','#1f5f5b','#1f5f5b','#1f5f5b','#161616'],ribbon:'#fbfaf5',outline:'#1c1c1c'},
 'Melado y cobalto':{cols:['#2f4fa3','#6f8f45','#1d2a55','#c98b2b','#1d2a55','#6f8f45','#c98b2b','#c98b2b','#2f4fa3'],ribbon:'#f7f1e3',outline:'#2a241c'},
 'Terracota':{cols:['#b8694d','#f0cdb8','#d98e6e','#e8b49a','#b8694d','#f0cdb8','#d98e6e','#e8b49a','#b8694d'],ribbon:'#fbf4ec',outline:'#8a4b36'},
 'Azulejo portugués':{cols:['#1e3a78','#dfe8f4','#3d63a8','#9ab6dc','#1e3a78','#dfe8f4','#3d63a8','#9ab6dc','#1e3a78'],ribbon:'#ffffff',outline:'#1e3a78'},
 'Verde y oro':{cols:['#0f3b36','#d4a83c','#0f3b36','#2f7a6d','#d4a83c','#2f7a6d','#d4a83c','#2f7a6d','#0f3b36'],ribbon:'#f8f3e6',outline:'#3a2f1a'},
 'Para colorear':{cols:Array(9).fill('#ffffff'),ribbon:'#ffffff',outline:'#222222'}
};
const BRUSH=['#161616','#1f5f5b','#2f4fa3','#c98b2b','#6f8f45','#b8694d','#e8b49a','#9ab6dc','#d4a83c','#7a2e3a','#ffffff'];
const BRUSH_N=EN?['Black','Green','Cobalt blue','Honey','Olive green','Terracotta','Light pink','Light blue','Gold','Garnet','White']:['Negro','Verde','Azul cobalto','Melado','Verde oliva','Terracota','Rosa claro','Azul claro','Oro','Granate','Blanco'];
