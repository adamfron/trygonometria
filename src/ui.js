import {state,modes} from './state.js';
import {rows,checkAnswer} from './answer-checker.js';

export function renderModes(el,on){el.innerHTML=modes.map(([k,l])=>`<button data-mode='${k}' class='${state.mode===k?'active':''}'>${l}</button>`).join('');el.querySelectorAll('button').forEach(b=>b.onclick=()=>on(b.dataset.mode));}

export function renderAnswers(el){
 const t=state.task;
 let html='';
 if(state.mode==='relation') html+=`<div>1) załóż b=x • 2) a=kx • 3) c=√(a²+b²) • 4) skróć x • 5) wpisz funkcje</div>`;
 if(state.mode==='pyth'&&!state.pythSolved){html+=`<div class='answer-row'><b>Brakujący bok ${t.hidden}</b> <input id='missingSide'></div><div>Wyprowadzenie: ${t.hidden==='c'?'c=√(a²+b²)':t.hidden==='a'?'a=√(c²-b²)':'b=√(c²-a²)'}</div>`;}
 if(state.mode!=='pyth'||state.pythSolved){
  html+=rows(t).map(r=>`<div class='answer-row'><b>${r.k}</b> <span class='fraction'><input id='${r.k}-rn'><span class='bar'></span><input id='${r.k}-rd'></span> ${r.s.changed?`=<span class='fraction'><input id='${r.k}-sn'><span class='bar'></span><input id='${r.k}-sd'></span>`:''}</div>`).join('');
 }
 el.innerHTML=html;
}

export function wireFocus(root){root.querySelectorAll('input').forEach(i=>{i.onfocus=()=>state.focusedInput=i;i.onblur=()=>{if(state.focusedInput===i)state.focusedInput=null;};});
 const first=root.querySelector('#missingSide')||root.querySelector('input'); if(first)first.focus();}

export function checkAll(){
 if(state.mode==='pyth'&&!state.pythSolved){
  const val=document.getElementById('missingSide')?.value;const t=state.task;
  const target=t[t.hidden];
  const ok=val&&Math.abs((Number(val.replace(',','.')))-target)<1e-4;
  if(ok) state.pythSolved=true;
  return ok;
 }
 return rows(state.task).every(r=>checkAnswer(state.task,r.k,document.getElementById(`${r.k}-rn`)?.value,document.getElementById(`${r.k}-rd`)?.value,document.getElementById(`${r.k}-sn`)?.value,document.getElementById(`${r.k}-sd`)?.value));
}
