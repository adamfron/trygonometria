import {state,modes} from './state.js';
import {rows,checkAnswer} from './answer-checker.js';

const labels={sinA:'sin α',cosA:'cos α',tanA:'tg α',sinB:'sin β',cosB:'cos β',tanB:'tg β'};
const sideMap={sinA:['a','c'],cosA:['b','c'],tanA:['a','b'],sinB:['b','c'],cosB:['a','c'],tanB:['b','a']};
export function renderModes(el,on){el.innerHTML=modes.map(([k,l])=>`<button data-mode='${k}' class='${state.mode===k?'active':''}'>${l}</button>`).join('');el.querySelectorAll('button').forEach(b=>b.onclick=()=>on(b.dataset.mode));}

export function renderAnswers(el){
 const t=state.task; let html='';
 html+=`<p class='gamma-note'>Dla γ = 90°: sin γ = 1, cos γ = 0, tg γ nie istnieje.</p>`;
 if(state.mode==='relation') html+=`<ol class='relation-steps'><li>Przyjmij b = x.</li><li>k to współczynnik skali, czyli informacja, ile razy jeden bok jest dłuższy lub krótszy od drugiego.</li><li>Skoro a = k·b, to a = kx.</li><li>Z twierdzenia Pitagorasa: c = √(a² + b²).</li><li>Po podstawieniu: c = √((kx)² + x²).</li><li>Wyłącz x przed pierwiastek i skróć x w ułamkach.</li><li>Wpisz końcowe wartości funkcji trygonometrycznych.</li></ol>`;
 if(state.mode==='pyth'&&!state.pythSolved) html+=`<div class='answer-row'><b>Brakujący bok ${t.hidden}</b> <input id='missingSide'></div><div>Wyprowadzenie: ${t.hidden==='c'?'c=√(a²+b²)':t.hidden==='a'?'a=√(c²-b²)':'b=√(c²-a²)'}</div>`;
 if(state.mode!=='pyth'||state.pythSolved) html+=rows(t).map(r=>`<div class='answer-row ${state.showColorHints?'show-hints':''}' data-row='${r.k}'><b>${labels[r.k]}</b> <span class='fraction'><input data-side='${sideMap[r.k][0]}' id='${r.k}-rn'><span class='bar'></span><input data-side='${sideMap[r.k][1]}' id='${r.k}-rd'></span> ${r.s.changed?`=<span class='fraction'><input data-side='${sideMap[r.k][0]}' id='${r.k}-sn'><span class='bar'></span><input data-side='${sideMap[r.k][1]}' id='${r.k}-sd'></span>`:''}</div>`).join('');
 el.innerHTML=html;
}

export function wireFocus(root){root.querySelectorAll('input').forEach(i=>{i.onfocus=()=>state.focusedInput=i;});const first=root.querySelector('#missingSide')||root.querySelector('input'); if(first){first.focus(); state.focusedInput=first;}}

export function checkAll(){
 if(state.mode==='pyth'&&!state.pythSolved){const val=document.getElementById('missingSide')?.value;const target=state.task[state.task.hidden];const num=Number((val||'').replace(',','.'));const ok=Number.isFinite(num)&&Math.abs(num-target)<1e-4; if(ok)state.pythSolved=true; return {ok,rows:[]};}
 const result=rows(state.task).map(r=>({k:r.k,ok:checkAnswer(state.task,r.k,document.getElementById(`${r.k}-rn`)?.value,document.getElementById(`${r.k}-rd`)?.value,document.getElementById(`${r.k}-sn`)?.value,document.getElementById(`${r.k}-sd`)?.value)}));
 return {ok:result.every(x=>x.ok),rows:result};
}
export function paintResults(rowsRes){rowsRes.forEach(r=>{const row=document.querySelector(`[data-row='${r.k}']`);if(!row)return;row.classList.remove('correct-soft','invalid');row.classList.add(r.ok?'correct-soft':'invalid');});}
