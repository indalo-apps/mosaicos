// ===== Motor y patrones nuevos (v1.3) =====
// ---------- Motor de patrones (v1.3) ----------
// Cada patrón da las líneas (ejes de las cintas) de un periodo rectangular W × H.
// El motor corta las líneas en sus cruces, saca las piezas (polígonos entre líneas),
// encadena las cintas y decide en cada cruce qué cinta pasa por encima, alternando.
const MOTOR=(function(){
const R=n=>Math.round(n*1e4)/1e4;
function teselar(segs,W,H,i0,i1,j0,j1){const out=[];
  for(let i=i0;i<=i1;i++)for(let j=j0;j<=j1;j++)for(const s of segs)out.push([s[0]+i*W,s[1]+j*H,s[2]+i*W,s[3]+j*H]);return out;}
// Une los tramos que están sobre la misma recta y se solapan
function fundir(segs){
  const g=new Map();
  for(const s of segs){let dx=s[2]-s[0],dy=s[3]-s[1];const L=Math.hypot(dx,dy);if(L<1e-7)continue;dx/=L;dy/=L;
    if(dx<-1e-9||(Math.abs(dx)<=1e-9&&dy<0)){dx=-dx;dy=-dy;}
    const off=-dy*s[0]+dx*s[1],k=Math.round(Math.atan2(dy,dx)*1e5)+'|'+Math.round(off*1e3);
    let e=g.get(k);if(!e){e={dx,dy,off,iv:[]};g.set(k,e);}
    const t1=dx*s[0]+dy*s[1],t2=dx*s[2]+dy*s[3];e.iv.push([Math.min(t1,t2),Math.max(t1,t2)]);}
  const out=[];
  for(const e of g.values()){e.iv.sort((a,b)=>a[0]-b[0]);let c=null;
    const mk=([a,b])=>[a*e.dx-e.off*e.dy,a*e.dy+e.off*e.dx,b*e.dx-e.off*e.dy,b*e.dy+e.off*e.dx];
    for(const v of e.iv){if(c&&v[0]<=c[1]+1e-6)c[1]=Math.max(c[1],v[1]);else{if(c)out.push(mk(c));c=[v[0],v[1]];}}
    if(c)out.push(mk(c));}
  return out;
}
// Corta todos los tramos en sus cruces
function cortar(segs){
  const n=segs.length,ts=segs.map(()=>[0,1]);
  const bb=segs.map(s=>[Math.min(s[0],s[2])-1e-6,Math.min(s[1],s[3])-1e-6,Math.max(s[0],s[2])+1e-6,Math.max(s[1],s[3])+1e-6]);
  // rejilla para no comparar todos con todos
  const C=4,cel=new Map(),cl=v=>Math.floor(v/C);
  segs.forEach((s,i)=>{const b=bb[i];for(let x=cl(b[0]);x<=cl(b[2]);x++)for(let y=cl(b[1]);y<=cl(b[3]);y++){const k=x+','+y;let l=cel.get(k);if(!l)cel.set(k,l=[]);l.push(i);}});
  const hecho=new Set();
  for(const l of cel.values())for(let a=0;a<l.length;a++)for(let b=a+1;b<l.length;b++){
    const i=Math.min(l[a],l[b]),j=Math.max(l[a],l[b]),k=i*n+j;if(hecho.has(k))continue;hecho.add(k);
    const A=bb[i],B=bb[j];if(A[0]>B[2]||B[0]>A[2]||A[1]>B[3]||B[1]>A[3])continue;
    const s=segs[i],q=segs[j],d1x=s[2]-s[0],d1y=s[3]-s[1],d2x=q[2]-q[0],d2y=q[3]-q[1],den=d1x*d2y-d1y*d2x;
    if(Math.abs(den)<1e-12)continue;
    const ex=q[0]-s[0],ey=q[1]-s[1],t=(ex*d2y-ey*d2x)/den,u=(ex*d1y-ey*d1x)/den,e1=1e-6/Math.hypot(d1x,d1y),e2=1e-6/Math.hypot(d2x,d2y);
    if(t<-e1||t>1+e1||u<-e2||u>1+e2)continue;
    ts[i].push(Math.min(1,Math.max(0,t)));ts[j].push(Math.min(1,Math.max(0,u)));}
  const out=[];
  segs.forEach((s,i)=>{const t=[...new Set(ts[i].map(v=>Math.round(v*1e9)/1e9))].sort((a,b)=>a-b);
    for(let k=0;k+1<t.length;k++){const a=t[k],b=t[k+1];if(b-a<1e-9)continue;
      out.push([s[0]+(s[2]-s[0])*a,s[1]+(s[3]-s[1])*a,s[0]+(s[2]-s[0])*b,s[1]+(s[3]-s[1])*b]);}});
  return out;
}
// Vértices compartidos (con tolerancia)
function grafo(aristas){
  const V=[],idx=new Map(),T=2e-4;
  const id=(x,y)=>{const cx=Math.floor(x/T),cy=Math.floor(y/T);
    for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const l=idx.get((cx+a)+','+(cy+b));if(l)for(const v of l)if(Math.abs(V[v][0]-x)<T&&Math.abs(V[v][1]-y)<T)return v;}
    const v=V.length;V.push([x,y]);const k=cx+','+cy;let l=idx.get(k);if(!l)idx.set(k,l=[]);l.push(v);return v;};
  const E=[],vistos=new Set();
  for(const s of aristas){const a=id(s[0],s[1]),b=id(s[2],s[3]);if(a===b)continue;const k=a<b?a+'-'+b:b+'-'+a;if(vistos.has(k))continue;vistos.add(k);E.push([a,b]);}
  const ady=V.map(()=>[]);E.forEach(([a,b],e)=>{ady[a].push(e);ady[b].push(e);});
  return {V,E,ady};
}
const area=P=>{let a=0;for(let i=0;i<P.length;i++){const p=P[i],q=P[(i+1)%P.length];a+=p[0]*q[1]-q[0]*p[1];}return a/2;};
function limpiar(P){ // quita vértices alineados
  let Q=P.slice(),cambio=true;
  while(cambio&&Q.length>3){cambio=false;
    for(let i=0;i<Q.length;i++){const a=Q[(i+Q.length-1)%Q.length],b=Q[i],c=Q[(i+1)%Q.length];
      const cr=(b[0]-a[0])*(c[1]-b[1])-(b[1]-a[1])*(c[0]-b[0]);
      if(Math.abs(cr)<1e-7*Math.hypot(c[0]-a[0],c[1]-a[1])){Q.splice(i,1);cambio=true;break;}}}
  return Q;
}
// Piezas: recorre las caras del grafo plano
function caras(G){
  const {V,E,ady}=G,ang=(v,e)=>{const [a,b]=E[e],w=a===v?b:a;return Math.atan2(V[w][1]-V[v][1],V[w][0]-V[v][0]);};
  const ord=ady.map((l,v)=>l.slice().sort((p,q)=>ang(v,p)-ang(v,q)));
  const usado=new Set(),F=[];
  for(let e0=0;e0<E.length;e0++)for(const dir of [0,1]){
    if(usado.has(e0*2+dir))continue;
    let e=e0,d=dir,P=[],ok=true,n=0;
    while(!usado.has(e*2+d)){usado.add(e*2+d);const u=E[e][d],v=E[e][1-d];P.push(V[u]);
      const l=ord[v],i=l.indexOf(e),f=l[(i-1+l.length)%l.length];
      d=E[f][0]===v?0:1;e=f;if(++n>4000){ok=false;break;}}
    if(!ok||P.length<3)continue;
    if(area(P)>1e-6)F.push(limpiar(P));}
  return F;
}
function firma(P){const n=P.length;let per=0;const L=[];
  for(let i=0;i<n;i++){const a=P[i],b=P[(i+1)%n];const l=Math.hypot(b[0]-a[0],b[1]-a[1]);per+=l;L.push(l);}
  return n+'|'+Math.abs(area(P)).toFixed(2)+'|'+per.toFixed(2);}
const centro=P=>{let x=0,y=0;for(const p of P){x+=p[0];y+=p[1];}return[x/P.length,y/P.length];};

// Prepara un patrón: aristas y piezas de un periodo
function preparar(pat){
  const {W,H}=pat,base=pat.lineas();
  const todo=cortar(fundir(teselar(base,W,H,-1,1,-1,1)));
  const dentro=(x,y)=>x>=-1e-6&&x<W-1e-6&&y>=-1e-6&&y<H-1e-6;
  const aristas=todo.filter(s=>dentro((s[0]+s[2])/2,(s[1]+s[3])/2));
  const G=grafo(todo),piezas=[];
  for(const P of caras(G)){const c=centro(P);if(!dentro(c[0],c[1]))continue;if(Math.abs(area(P))>W*H*0.9)continue;piezas.push(P);}
  // clases: por la forma, o la que diga el patrón
  const firmas=[...new Set(piezas.map(firma))].sort((a,b)=>parseFloat(b.split('|')[1])-parseFloat(a.split('|')[1]));
  const clase=P=>{const f=firma(P);if(pat.clase){const k=pat.clase(P,centro(P),firmas.indexOf(f),f);if(k!=null)return k;}return firmas.indexOf(f);};
  return {aristas,piezas:piezas.map(P=>[clase(P),P]),firmas};
}
// Datos para dibujar una zona [x0,x1]×[y0,y1]: piezas (F), cintas (S) y cruces (O)
function zona(pat,prep,x0,y0,x1,y1){
  const {W,H}=pat,i0=Math.floor(x0/W)-1,i1=Math.ceil(x1/W)+1,j0=Math.floor(y0/H)-1,j1=Math.ceil(y1/H)+1;
  const F=[];
  for(let i=i0;i<=i1;i++)for(let j=j0;j<=j1;j++)for(const [k,P] of prep.piezas){
    const Q=P.map(p=>[R(p[0]+i*W),R(p[1]+j*H)]);
    if(Q.every(p=>p[0]<x0)||Q.every(p=>p[0]>x1)||Q.every(p=>p[1]<y0)||Q.every(p=>p[1]>y1))continue;
    F.push([k,Q.flat()]);}
  const segs=teselar(prep.aristas,W,H,i0,i1,j0,j1).filter(s=>!(Math.max(s[0],s[2])<x0||Math.min(s[0],s[2])>x1||Math.max(s[1],s[3])<y0||Math.min(s[1],s[3])>y1));
  const G=grafo(segs),{V,E,ady}=G;
  const dirv=(v,e)=>{const [a,b]=E[e],w=a===v?b:a,dx=V[w][0]-V[v][0],dy=V[w][1]-V[v][1],l=Math.hypot(dx,dy);return[dx/l,dy/l];};
  // en cada vértice: qué arista sigue a cuál (rectas que se cruzan siguen rectas; esquinas, de dos en dos)
  const sig=new Map(),cruces=[];
  ady.forEach((l,v)=>{const libres=l.slice(),pares=[];
    for(let a=0;a<libres.length;a++)for(let b=a+1;b<libres.length;b++){const p=dirv(v,libres[a]),q=dirv(v,libres[b]);
      if(p[0]*q[0]+p[1]*q[1]<-0.99999){pares.push([libres[a],libres[b]]);libres.splice(b,1);libres.splice(a,1);a=-1;break;}}
    if(libres.length===2)pares.push([libres[0],libres[1]]);
    for(const [a,b] of pares){sig.set(v+':'+a,b);sig.set(v+':'+b,a);}
    if(l.length===4&&pares.length===2&&!libres.length)cruces.push(v);});
  // cintas: cadenas de aristas
  const enCinta=new Array(E.length).fill(-1),S=[],recorr=[];
  const otro=(e,v)=>E[e][0]===v?E[e][1]:E[e][0];
  E.forEach((_,e0)=>{if(enCinta[e0]>=0)return;const id=S.length;
    // hacia atrás hasta un extremo libre (o hasta dar la vuelta si la cinta es cerrada)
    let e=e0,v=E[e0][0],cl=false,guard=0;
    while(true){const f=sig.get(v+':'+e);if(f==null)break;if(f===e0){cl=true;break;}v=otro(f,v);e=f;if(++guard>1e6)break;}
    // e sale de v: se recorre hacia delante
    const e1=e,vs=[v];
    while(true){enCinta[e]=id;const w=otro(e,v);vs.push(w);const f=sig.get(w+':'+e);if(f==null||f===e1)break;v=w;e=f;}
    if(cl)vs.pop();
    S.push([cl?1:0,vs.map(i=>[R(V[i][0]),R(V[i][1])]).flat()]);recorr.push({vs,cl});});
  // entrelazado: alterna encima/debajo a lo largo de cada cinta
  let O=[];
  if(pat.entrelazar!==false&&cruces.length){
    const esCruce=new Set(cruces),nodo=new Map(),lista=[];
    const nid=(c,s)=>{const k=c+'|'+s;let i=nodo.get(k);if(i==null){i=lista.length;nodo.set(k,i);lista.push([c,s]);}return i;};
    const vec=[];const add=(a,b)=>{(vec[a]=vec[a]||[]).push(b);(vec[b]=vec[b]||[]).push(a);};
    recorr.forEach((r,s)=>{const occ=r.vs.filter(v=>esCruce.has(v)).map(v=>nid(v,s));
      for(let k=0;k+1<occ.length;k++)add(occ[k],occ[k+1]);if(r.cl&&occ.length>1)add(occ[occ.length-1],occ[0]);});
    const porCruce=new Map();lista.forEach(([c],i)=>{(porCruce.get(c)||porCruce.set(c,[]).get(c)).push(i);});
    for(const l of porCruce.values())if(l.length===2)add(l[0],l[1]);
    const val=new Array(lista.length).fill(-1);
    // empieza por el centro de la zona para que la alternancia sea igual en todas las vistas
    const cx=(x0+x1)/2,cy=(y0+y1)/2,orden=lista.map((_,i)=>i).sort((a,b)=>{const p=V[lista[a][0]],q=V[lista[b][0]];return Math.hypot(p[0]-cx,p[1]-cy)-Math.hypot(q[0]-cx,q[1]-cy);});
    for(const s0 of orden){if(val[s0]>=0)continue;val[s0]=pat.paridad?1:0;const cola=[s0];
      while(cola.length){const a=cola.pop();for(const b of vec[a]||[])if(val[b]<0){val[b]=1-val[a];cola.push(b);}}}
    for(const [c,l] of porCruce){if(l.length!==2)continue;const enc=l.find(i=>val[i]===1);if(enc==null)continue;
      const s=lista[enc][1],r=recorr[s],k=r.vs.indexOf(c),a=V[r.vs[(k-1+r.vs.length)%r.vs.length]],b=V[r.vs[(k+1)%r.vs.length]];
      let dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy);dx/=L;dy/=L;
      const otra=recorr[lista[l.find(i=>i!==enc)][1]],k2=otra.vs.indexOf(c),a2=V[otra.vs[(k2-1+otra.vs.length)%otra.vs.length]],b2=V[otra.vs[(k2+1)%otra.vs.length]];
      let ex=b2[0]-a2[0],ey=b2[1]-a2[1];const L2=Math.hypot(ex,ey);ex/=L2;ey/=L2;
      const sn=Math.abs(dx*ey-dy*ex);
      O.push([R(V[c][0]),R(V[c][1]),R(dx),R(dy),R(sn)]);}
  }
  return {F,S,O};
}
return {preparar,zona,area,centro,firma,teselar,fundir,cortar};
})();

