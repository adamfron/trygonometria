import { state } from './state.js';
import { buildTask } from './tasks.js';
import { renderTriangle } from './triangle-renderer.js';
import { renderGraphs } from './graph-renderer.js';
import { renderModes, renderAnswers, wireFocus } from './ui.js';
import { trigRows, checkRow } from './answer-checker.js';

const els = {
  stats: document.getElementById('stats'), modeMenu: document.getElementById('modeMenu'), taskTitle: document.getElementById('taskTitle'),
  taskSubtitle: document.getElementById('taskSubtitle'), answers: document.getElementById('answers'), triangleSvg: document.getElementById('triangleSvg'),
  message: document.getElementById('message'), checkBtn: document.getElementById('checkBtn'), nextBtn: document.getElementById('nextBtn'),
  sinSvg: document.getElementById('sinSvg'), cosSvg: document.getElementById('cosSvg'), tanSvg: document.getElementById('tanSvg'), sqrtBtn: document.getElementById('sqrtBtn')
};

function setMessage(t){els.message.textContent=t;}
function updateStats(){els.stats.innerHTML=`<span class='pill'>Rozwiązane: <strong>${state.session.solved}</strong></span>`;}
function focusFirst(){const id=(state.mode==='pyth'&&!state.pythSolvedThisTask)?'missingSide':`${trigRows(state.task)[0].key}-rn`;document.getElementById(id)?.focus();}

function render(){
  updateStats();
  renderModes(els.modeMenu, m=>{state.mode=m;newTask();});
  els.taskTitle.textContent='Trójkąt prostokątny';
  els.taskSubtitle.textContent='— uzupełnij wartości funkcji dla kątów ostrych α i β.';
  renderTriangle(els.triangleSvg, side=>{
    const f=state.focusedInput; if(!f||f.disabled||f.id==='missingSide'||f.dataset.role!=='trig')return;
    f.value += state.task[side].display;
  });
  renderAnswers(els.answers); wireFocus(els.answers); focusFirst();
  renderGraphs({sinSvg:els.sinSvg,cosSvg:els.cosSvg,tanSvg:els.tanSvg,alphaDeg:state.task.alphaDeg,betaDeg:state.task.betaDeg});
}

function newTask(){state.task=buildTask();state.trigAttempts=0;state.pythAttempts=0;state.showColorHints=false;state.showSquares=false;state.pythSolvedThisTask=state.mode!=='pyth';render();setMessage(state.mode==='pyth'?'Najpierw znajdź brakujący bok z twierdzenia Pitagorasa.':'Wpisz ułamki wynikające bezpośrednio z długości boków. Jeśli pojawi się znak równości, wpisz też postać skróconą.');els.nextBtn.hidden=true;}

function check(){
  if(state.mode==='pyth'&&!state.pythSolvedThisTask){
    const v=Number(document.getElementById('missingSide')?.value?.replace(',','.')); const exp=state.task[state.task.hidden].value;
    if(v===exp){state.pythSolvedThisTask=true;render();setMessage('Dobrze. Brakujący bok jest już na miejscu — teraz uzupełnij funkcje trygonometryczne.');return;}
    state.pythAttempts++; setMessage(state.pythAttempts===1?'Jeszcze nie. Dorysowałem kwadraty przy bokach: ich pola pomagają zobaczyć sens wzoru Pitagorasa.':'Sprawdź, który bok jest przeciwprostokątną.'); return;
  }
  const bad=[]; trigRows(state.task).forEach(r=>{if(!checkRow(r,{rn:document.getElementById(`${r.key}-rn`)?.value,rd:document.getElementById(`${r.key}-rd`)?.value,sn:document.getElementById(`${r.key}-sn`)?.value,sd:document.getElementById(`${r.key}-sd`)?.value})) bad.push(r.key);});
  if(!bad.length){state.session.solved++;setMessage('Brawo! Wszystko się zgadza. Możesz przejść do następnego zadania.');els.nextBtn.hidden=false;updateStats();return;}
  state.trigAttempts++; setMessage(state.trigAttempts===1?'Jeszcze nie. Sprawdź, który bok jest przeciwległy i przyległy względem danego kąta.':state.trigAttempts===2?'Druga próba nie wyszła. Wyczyściłem błędne pola — spróbuj jeszcze raz spokojnie, kąt po kącie.':'Teraz włączam kolory: licznik i mianownik mają odpowiadać właściwym bokom trójkąta.');
}

els.checkBtn.onclick=check; els.nextBtn.onclick=newTask; els.sqrtBtn.onclick=()=>{const f=state.focusedInput;if(!f||f.disabled)return;const p=f.selectionStart??f.value.length;f.value=f.value.slice(0,p)+'√'+f.value.slice(p);f.focus();};
newTask();
