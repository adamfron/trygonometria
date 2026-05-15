import { state } from './state.js';
import { rotate, angleArc, rightMarker } from './geometry.js';

export function renderTriangle(el, onSideClick) {
  const t = state.task; const s = Math.min(430 / t.b.value, 300 / t.a.value);
  let A={x:120,y:360}, B={x:120+t.b.value*s,y:360}, C={x:120,y:360-t.a.value*s};
  if (state.mode==='random'){const ctr={x:(A.x+B.x+C.x)/3,y:(A.y+B.y+C.y)/3};const ang=Math.random()*Math.PI*2;A=rotate(A,ang,ctr);B=rotate(B,ang,ctr);C=rotate(C,ang,ctr);if(Math.random()<.5){A.x=680-A.x;B.x=680-B.x;C.x=680-C.x;}}
  const hidden=state.mode==='pyth'&&!state.pythSolvedThisTask?t.hidden:null;
  const side=(id,p,q,col,val)=>`<line data-side='${id}' class='side-hot' x1='${p.x}' y1='${p.y}' x2='${q.x}' y2='${q.y}' stroke='${col}' stroke-width='5' stroke-linecap='round'/><text x='${(p.x+q.x)/2}' y='${(p.y+q.y)/2-14}' font-weight='800'>${id} = ${val}</text>`;
  el.innerHTML=`
  <polygon points='${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}' fill='#fff' stroke='#cbd5e1' stroke-width='2'/>
  ${side('a',A,C,'var(--side-a)',hidden==='a'?'?':t.a.display)}
  ${side('b',A,B,'var(--side-b)',hidden==='b'?'?':t.b.display)}
  ${side('c',B,C,'var(--side-c)',hidden==='c'?'?':t.c.display)}
  <path d='${angleArc(B,A,C,44)}' stroke='var(--alpha)' stroke-width='3' fill='none'/>
  <path d='${angleArc(C,A,B,44)}' stroke='var(--beta)' stroke-width='3' fill='none'/>
  <polyline points='${rightMarker(A,B,C,22)}' fill='none' stroke='var(--gamma)' stroke-width='3'/>
  <text x='${B.x-56}' y='${B.y-18}' fill='var(--alpha)' font-size='22' font-weight='900'>α</text>
  <text x='${C.x+22}' y='${C.y+46}' fill='var(--beta)' font-size='22' font-weight='900'>β</text>
  <text x='${A.x+26}' y='${A.y-24}' fill='var(--gamma)' font-size='18' font-weight='900'>γ / 90°</text>
  <text x='${A.x-18}' y='${A.y+22}' font-size='20' font-weight='900'>A</text>
  <text x='${B.x+10}' y='${B.y+22}' font-size='20' font-weight='900'>B</text>
  <text x='${C.x-20}' y='${C.y-10}' font-size='20' font-weight='900'>C</text>`;
  el.querySelectorAll('[data-side]').forEach(n=>{n.onmouseenter=()=>n.classList.add('side-hover');n.onmouseleave=()=>n.classList.remove('side-hover');n.onclick=()=>onSideClick(n.dataset.side);});
}
