import {state} from './state.js';
import {rotate,arcPath} from './geometry.js';
import {symbolic} from './fractions.js';

export function renderTriangle(el,onSideClick){
 const t=state.task;const s=Math.min(420/t.b,300/t.a);let A={x:120,y:360},B={x:120+t.b*s,y:360},C={x:120,y:360-t.a*s};
 if(state.mode==='random'){const cent={x:(A.x+B.x+C.x)/3,y:(A.y+B.y+C.y)/3},ang=Math.random()*Math.PI*2;A=rotate(A,ang,cent);B=rotate(B,ang,cent);C=rotate(C,ang,cent);if(Math.random()<.5){A.x=680-A.x;B.x=680-B.x;C.x=680-C.x;}}
 const mid=(p,q)=>({x:(p.x+q.x)/2,y:(p.y+q.y)/2});
 const mk=(id,p,q,col,val,dy=0)=>`<line data-side='${id}' class='side-hot' x1='${p.x}' y1='${p.y}' x2='${q.x}' y2='${q.y}' stroke='${col}' stroke-width='5'/><text x='${mid(p,q).x}' y='${mid(p,q).y-10+dy}'>${id}=${val}</text>`;
 const rv=26;
 el.innerHTML=`
 <text x='${A.x-18}' y='${A.y+16}'>A</text><text x='${B.x+8}' y='${B.y+16}'>B</text><text x='${C.x-18}' y='${C.y-8}'>C</text>
 ${mk('a',A,C,'var(--side-a)',t.hidden==='a'?'?':symbolic(t.a))}
 ${mk('b',A,B,'var(--side-b)',t.hidden==='b'?'?':symbolic(t.b),12)}
 ${mk('c',B,C,'var(--side-c)',t.hidden==='c'?'?':symbolic(t.c))}
 <path d='${arcPath([A,C],B,rv)}' stroke='var(--alpha)' fill='none'/><text x='${B.x-40}' y='${B.y-22}' fill='var(--alpha)'>α</text>
 <path d='${arcPath([A,B],C,rv)}' stroke='var(--beta)' fill='none'/><text x='${C.x+16}' y='${C.y+30}' fill='var(--beta)'>β</text>
 <polyline points='${A.x+8},${A.y-22} ${A.x+30},${A.y-22} ${A.x+30},${A.y}' fill='none' stroke='var(--gamma)'/><text x='${A.x+36}' y='${A.y-26}' fill='var(--gamma)'>γ / 90°</text>`;
 el.querySelectorAll('[data-side]').forEach(n=>{n.onmouseenter=()=>n.classList.add('side-hover');n.onmouseleave=()=>n.classList.remove('side-hover');n.onclick=()=>onSideClick(n.dataset.side);});
}
