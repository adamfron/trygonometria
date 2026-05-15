import { state, modes } from './state.js';
import { trigRows } from './answer-checker.js';

export function renderModes(el, onSelect){el.innerHTML=modes.map(([k,l])=>`<button class='${state.mode===k?'active':''}' data-mode='${k}'>${l}</button>`).join('');el.querySelectorAll('button').forEach(b=>b.onclick=()=>onSelect(b.dataset.mode));}

export function pythDerivation(t){
  const a=t.a.value,b=t.b.value,c=t.c.value;
  if(t.hidden==='c') return `c² = a² + b², więc c = √(${a}² + ${b}²) = √(${a*a} + ${b*b}) = √${a*a+b*b} = ${c}`;
  if(t.hidden==='a') return `a² = c² − b², więc a = √(${c}² − ${b}²) = √(${c*c} − ${b*b}) = √${c*c-b*b} = ${a}`;
  return `b² = c² − a², więc b = √(${c}² − ${a}²) = √(${c*c} − ${a*a}) = √${c*c-a*a} = ${b}`;
}

export function renderAnswers(el){
  el.innerHTML='';
  const t=state.task;
  if(state.mode==='relation') el.insertAdjacentHTML('beforeend',`<div class='side-task'><b>${t.relationText}</b><div class='formula-note'>1) załóż b = x<br>2) wyraź a<br>3) policz c z Pitagorasa<br>4) skróć x w ilorazach<br>5) podaj końcowe wartości funkcji</div></div>`);
  const locked = state.mode==='pyth' && !state.pythSolvedThisTask;
  if (state.mode==='pyth') el.insertAdjacentHTML('beforeend',`<div class='side-task'><h3>Brakujący bok ${t.hidden}</h3><p class='formula-note'>${pythDerivation(t)}</p><div class='side-input-row'><label><b>${t.hidden} = </b></label><input id='missingSide' /></div></div>`);
  if (locked) return;
  trigRows(t).forEach(r=>{
    el.insertAdjacentHTML('beforeend',`<div class='answer-row' id='row-${r.key}'><div class='answer-label'>${r.label}</div><div class='fraction-line'><div class='fraction'><input data-role='trig' id='${r.key}-rn'><span class='bar'></span><input data-role='trig' id='${r.key}-rd'></div>${r.simple.changed?`<span class='eq'>=</span><div class='fraction'><input data-role='trig' id='${r.key}-sn'><span class='bar'></span><input data-role='trig' id='${r.key}-sd'></div>`:''}</div></div>`);
  });
}

export function wireFocus(root){root.querySelectorAll('input').forEach(i=>{i.onfocus=()=>{state.focusedInput=i;i.classList.add('input-focused');};i.onblur=()=>i.classList.remove('input-focused');});}
