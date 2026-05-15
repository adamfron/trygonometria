import {state,modes} from './state.js'; import {rows,checkAnswer} from './answer-checker.js';
export function renderModes(el,on){el.innerHTML=modes.map(([k,l])=>`<button data-mode='${k}' class='${state.mode===k?'active':''}'>${l}</button>`).join('');el.querySelectorAll('button').forEach(b=>b.onclick=()=>on(b.dataset.mode));}
export function renderAnswers(el){const t=state.task; if(state.mode==='relation')el.innerHTML=`<div>1) załóż b=x<br>2) a=kx<br>3) c=√(a²+b²)<br>4) skróć x<br>5) wpisz funkcje</div>`;
const pyth=t.hidden?`<div>Brakujący bok ${t.hidden}: <input id='missingSide'></div>`:'';
el.innerHTML+=pyth+rows(t).map(r=>`<div class='answer-row'><b>${r.k}</b> <span class='fraction'><input id='${r.k}-rn'><span class='bar'></span><input id='${r.k}-rd'></span> ${r.s.changed?`=<span class='fraction'><input id='${r.k}-sn'><span class='bar'></span><input id='${r.k}-sd'></span>`:''}</div>`).join('');}
export function wireFocus(root){root.querySelectorAll('input').forEach(i=>{i.onfocus=()=>{state.focusedInput=i;i.classList.add('input-focused');};i.onblur=()=>i.classList.remove('input-focused');});}
export function checkAll(){return rows(state.task).every(r=>checkAnswer(state.task,r.k,document.getElementById(`${r.k}-rn`)?.value,document.getElementById(`${r.k}-rd`)?.value,document.getElementById(`${r.k}-sn`)?.value,document.getElementById(`${r.k}-sd`)?.value));}
