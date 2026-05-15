import {state} from './state.js';
import {rotate,unitVector,drawInteriorArc,add,mul} from './geometry.js';
import {symbolic} from './fractions.js';

const W=680,H=440, M=12;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const sub=(a,b)=>({x:a.x-b.x,y:a.y-b.y});
const len=v=>Math.hypot(v.x,v.y)||1;
const norm=v=>({x:v.x/len(v),y:v.y/len(v)});
const dot=(a,b)=>a.x*b.x+a.y*b.y;

function fitToView(points,margin=60){
 const xs=points.map(p=>p.x), ys=points.map(p=>p.y);
 const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
 const scale=Math.min((W-2*margin)/Math.max(1,maxX-minX),(H-2*margin)/Math.max(1,maxY-minY));
 const cx=(minX+maxX)/2, cy=(minY+maxY)/2;
 return points.map(p=>({x:(p.x-cx)*scale+W/2,y:(p.y-cy)*scale+H/2}));
}

export function renderTriangle(el,onSideClick){
 const t=state.task;
 let C={x:0,y:0},A={x:0,y:t.b},B={x:t.a,y:0};
 if(state.mode==='random'){const cent={x:(A.x+B.x+C.x)/3,y:(A.y+B.y+C.y)/3},ang=Math.random()*Math.PI*2;A=rotate(A,ang,cent);B=rotate(B,ang,cent);C=rotate(C,ang,cent);if(Math.random()<0.5){A.x=-A.x;B.x=-B.x;C.x=-C.x;}}
 [A,B,C]=fitToView([A,B,C]);
 const G={x:(A.x+B.x+C.x)/3,y:(A.y+B.y+C.y)/3};
 const sideVal=(k)=>state.mode==='relation'?(k==='a'?'k·b':k==='b'?'x':'?'):(t.hidden===k?'?':symbolic(t[k]));

 const sideLabel=(id,p,q,val,col,off=20)=>{const m={x:(p.x+q.x)/2,y:(p.y+q.y)/2}; let n=norm({x:-(q.y-p.y),y:q.x-p.x}); if(dot(n,sub(G,m))>0)n=mul(n,-1); const lp=add(m,mul(n,off)); return `<line data-side='${id}' class='side-hot' x1='${p.x}' y1='${p.y}' x2='${q.x}' y2='${q.y}' stroke='${col}' stroke-width='5'/><text x='${clamp(lp.x,M,W-M-70)}' y='${clamp(lp.y,M+10,H-M)}'>${id}${val?`=${val}`:''}</text>`;};
 const vertexLabel=(name,p)=>{const v=norm(sub(p,G));const lp=add(p,mul(v,22));return `<text x='${clamp(lp.x,M,W-M-16)}' y='${clamp(lp.y,M+12,H-M)}'>${name}</text>`;};
 const angleLabel=(v,p1,p2,arcR,text,d=14,color='var(--alpha)')=>{const u1=unitVector(v,p1),u2=unitVector(v,p2);const bis=norm(add(u1,u2));const lp=add(v,mul(bis,arcR+d));return `<text x='${clamp(lp.x,M,W-M-60)}' y='${clamp(lp.y,M+12,H-M)}' fill='${color}'>${text}</text>`;};

 const arcR=24, aArc=drawInteriorArc(A,C,B,arcR), bArc=drawInteriorArc(B,A,C,arcR);
 const uCA=unitVector(C,A),uCB=unitVector(C,B),sq=18,p1=add(C,mul(uCA,sq)),p2=add(C,mul(uCB,sq)),p3=add(p1,mul(uCB,sq));

 el.innerHTML=`
 ${vertexLabel('A',A)}${vertexLabel('B',B)}${vertexLabel('C',C)}
 ${sideLabel('a',B,C,sideVal('a'),'var(--side-a)')}
 ${sideLabel('b',A,C,sideVal('b'),'var(--side-b)')}
 ${sideLabel('c',A,B,sideVal('c'),'var(--side-c)',24)}
 <path d='${aArc}' stroke='var(--alpha)' stroke-width='2.2' fill='none'/>${angleLabel(A,C,B,arcR,'α',14,'var(--alpha)')}
 <path d='${bArc}' stroke='var(--beta)' stroke-width='2.2' fill='none'/>${angleLabel(B,A,C,arcR,'β',14,'var(--beta)')}
 <polyline points='${p1.x},${p1.y} ${p3.x},${p3.y} ${p2.x},${p2.y}' fill='none' stroke='var(--gamma)' stroke-width='2'/>
 ${angleLabel(C,A,B,arcR,'γ / 90°',16,'var(--gamma)')}`;

 el.querySelectorAll('[data-side]').forEach(n=>{n.onmouseenter=()=>n.classList.add('side-hover');n.onmouseleave=()=>n.classList.remove('side-hover');n.onclick=()=>onSideClick(n.dataset.side);});
}
