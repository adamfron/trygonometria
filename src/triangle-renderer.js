import {state} from './state.js';
import {rotate,unitVector,pointAlongRay,drawInteriorArc,add,mul} from './geometry.js';
import {symbolic} from './fractions.js';

const W=680,H=440;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));

function fitToView(points,margin=52){
 const xs=points.map(p=>p.x), ys=points.map(p=>p.y);
 const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
 const scale=Math.min((W-2*margin)/Math.max(1,maxX-minX),(H-2*margin)/Math.max(1,maxY-minY));
 const cx=(minX+maxX)/2, cy=(minY+maxY)/2;
 return points.map(p=>({x:(p.x-cx)*scale+W/2,y:(p.y-cy)*scale+H/2}));
}

export function renderTriangle(el,onSideClick){
 const t=state.task;
 let A={x:0,y:1},B={x:t.b,y:1},C={x:0,y:1-t.a}; // C is right angle
 if(state.mode==='random'){
   const cent={x:(A.x+B.x+C.x)/3,y:(A.y+B.y+C.y)/3};
   const ang=Math.random()*Math.PI*2;
   A=rotate(A,ang,cent);B=rotate(B,ang,cent);C=rotate(C,ang,cent);
   if(Math.random()<0.5){A.x=-A.x;B.x=-B.x;C.x=-C.x;}
 }
 [A,B,C]=fitToView([A,B,C]);

 const label=(id,p,q,val,col)=>`<line data-side='${id}' class='side-hot' x1='${p.x}' y1='${p.y}' x2='${q.x}' y2='${q.y}' stroke='${col}' stroke-width='5'/><text x='${(p.x+q.x)/2}' y='${(p.y+q.y)/2-10}'>${id}${val?`=${val}`:''}</text>`;
 const sideVal=(k)=>state.mode==='relation'? (k==='a'?'k·b':k==='b'?'x':'?') : (t.hidden===k?'?':symbolic(t[k]));

 const arcR=24;
 const aArc=drawInteriorArc(A,C,B,arcR);
 const bArc=drawInteriorArc(B,A,C,arcR);

 const uCA=unitVector(C,A), uCB=unitVector(C,B), sq=18;
 const p1=add(C,mul(uCA,sq)), p2=add(C,mul(uCB,sq)), p3=add(p1,mul(uCB,sq));

 const posTxt=(v,u1,u2,d=34)=>add(v,mul(add(u1,u2),d));
 const pAlpha=posTxt(A,unitVector(A,C),unitVector(A,B),22);
 const pBeta=posTxt(B,unitVector(B,A),unitVector(B,C),22);
 const pGamma=posTxt(C,uCA,uCB,28);

 el.innerHTML=`
 <text x='${clamp(A.x+8,6,W-20)}' y='${clamp(A.y+18,18,H-6)}'>A</text>
 <text x='${clamp(B.x+8,6,W-20)}' y='${clamp(B.y+18,18,H-6)}'>B</text>
 <text x='${clamp(C.x+8,6,W-20)}' y='${clamp(C.y+18,18,H-6)}'>C</text>
 ${label('a',B,C,sideVal('a'),'var(--side-a)')}
 ${label('b',A,C,sideVal('b'),'var(--side-b)')}
 ${label('c',A,B,sideVal('c'),'var(--side-c)')}
 <path d='${aArc}' stroke='var(--alpha)' stroke-width='2.2' fill='none'/><text x='${pAlpha.x}' y='${pAlpha.y}' fill='var(--alpha)'>α</text>
 <path d='${bArc}' stroke='var(--beta)' stroke-width='2.2' fill='none'/><text x='${pBeta.x}' y='${pBeta.y}' fill='var(--beta)'>β</text>
 <polyline points='${p1.x},${p1.y} ${p3.x},${p3.y} ${p2.x},${p2.y}' fill='none' stroke='var(--gamma)' stroke-width='2'/>
 <text x='${pGamma.x}' y='${pGamma.y}' fill='var(--gamma)'>γ / 90°</text>`;

 el.querySelectorAll('[data-side]').forEach(n=>{n.onmouseenter=()=>n.classList.add('side-hover');n.onmouseleave=()=>n.classList.remove('side-hover');n.onclick=()=>onSideClick(n.dataset.side);});
}
