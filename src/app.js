import {state} from './state.js';
import {buildTask} from './tasks.js';
import {renderTriangle} from './triangle-renderer.js';
import {renderGraphs} from './graph-renderer.js';
import {renderModes,renderAnswers,wireFocus,checkAll,paintResults} from './ui.js';
import {symbolic} from './fractions.js';

const els={stats:stats,triangleSvg,answers,modeMenu,checkBtn,nextBtn,taskTitle,message,sinSvg,cosSvg,tanSvg,sqrtBtn,answersIntro};
const msgs={intro:'Wpisz ułamki wynikające bezpośrednio z długości boków. Jeśli pojawi się znak równości, wpisz też postać skróconą.',wrong1:'Jeszcze nie. Sprawdź, który bok jest przeciwległy i przyległy względem danego kąta.',wrong2:'Druga próba nie wyszła. Wyczyściłem błędne pola — spróbuj jeszcze raz spokojnie, kąt po kącie.',color:'Teraz włączam kolory: licznik i mianownik mają odpowiadać właściwym bokom trójkąta.',ok:'Brawo! Wszystko się zgadza. Możesz przejść do następnego zadania.',pythOk:'Dobrze. Brakujący bok jest już na miejscu — teraz uzupełnij funkcje trygonometryczne.'};

function msg(t){els.message.textContent=t}
function update(){els.stats.innerHTML=`<span>Rozwiązane: <b>${state.session.solved}</b></span>`}
function render(){
 update();
 renderModes(els.modeMenu,m=>{state.mode=m;newTask();});
 renderTriangle(els.triangleSvg,side=>{
  const i=state.focusedInput; if(!i||i.id==='missingSide'||!/-r[nd]$|-s[nd]$/.test(i.id)) return;
  i.value+=symbolic(state.task[side]); i.focus();
 });
 renderAnswers(els.answers); wireFocus(els.answers);
 const alpha=Math.atan2(state.task.a,state.task.b), beta=Math.atan2(state.task.b,state.task.a);
 renderGraphs(els.sinSvg,els.cosSvg,els.tanSvg,alpha,beta);
 els.taskTitle.textContent=`Trójkąt prostokątny — ${state.task.relation||'uzupełnij wartości funkcji dla α i β.'}`;
 els.answersIntro.textContent=msgs.intro;
}
function clearBad(){document.querySelectorAll('.invalid input').forEach(i=>i.value='');}
function newTask(){state.task=buildTask();state.attempt=0;state.pythSolved=false;els.nextBtn.hidden=true;render();msg(msgs.intro);}

els.sqrtBtn.onmousedown=(e)=>e.preventDefault();
els.sqrtBtn.onclick=()=>{const i=state.focusedInput;if(!i)return;const s=i.selectionStart??i.value.length;const e=i.selectionEnd??i.value.length;i.value=i.value.slice(0,s)+'√'+i.value.slice(e);i.focus();i.setSelectionRange(s+1,s+1);};
els.checkBtn.onclick=()=>{
 const res=checkAll();
 if(res.ok&&state.mode==='pyth'&&state.pythSolved&&els.answers.querySelector('#missingSide')){render();msg(msgs.pythOk);return;}
 if(res.rows.length) paintResults(res.rows);
 if(res.ok){state.session.solved++;els.nextBtn.hidden=false;update();msg(msgs.ok);return;}
 state.attempt++; if(state.attempt===1)msg(msgs.wrong1); else if(state.attempt===2){clearBad(); msg(msgs.wrong2);} else msg(msgs.color);
};
els.nextBtn.onclick=()=>newTask();
newTask();
