import {state} from './state.js'; import {buildTask} from './tasks.js'; import {renderTriangle} from './triangle-renderer.js'; import {renderGraphs} from './graph-renderer.js'; import {renderModes,renderAnswers,wireFocus,checkAll} from './ui.js';
const els={stats:stats,triangleSvg,answers,modeMenu,checkBtn,nextBtn,taskTitle,taskSubtitle,message,sinSvg,cosSvg,tanSvg,sqrtBtn};
function msg(t){els.message.textContent=t} function update(){els.stats.innerHTML=`<span>Rozwiązane: <b>${state.session.solved}</b></span>`}
function render(){update(); renderModes(els.modeMenu,m=>{state.mode=m;newTask();}); renderTriangle(els.triangleSvg,side=>{if(state.focusedInput)state.focusedInput.value+=String(state.task[side]);}); renderAnswers(els.answers); wireFocus(els.answers); renderGraphs(els.sinSvg,els.cosSvg,els.tanSvg);}
function newTask(){state.task=buildTask(); render(); msg('Uzupełnij wartości funkcji.');}
els.sqrtBtn.onclick=()=>{if(state.focusedInput)state.focusedInput.value+='√';};
els.checkBtn.onclick=()=>{if(checkAll()){state.session.solved++;msg('Brawo!');els.nextBtn.hidden=false;}else msg('Spróbuj ponownie.');}; els.nextBtn.onclick=()=>{els.nextBtn.hidden=true;newTask();};
newTask();
