const W=420,H=150,l=32,r=12,t=16,b=20;
const xMin=-30,xMax=390,yMin=-1.3,yMax=1.3;
const pxX=d=>l+((d-xMin)/(xMax-xMin))*(W-l-r);
const pxY=v=>t+((yMax-v)/(yMax-yMin))*(H-t-b);
const deg=x=>x*180/Math.PI;

function axes(){
 const xMarks=[0,90,180,270,360], yMarks=[-1,-0.5,0,0.5,1];
 const vx=xMarks.map(x=>`<line x1='${pxX(x)}' y1='${t}' x2='${pxX(x)}' y2='${H-b}' stroke='#eef2f7'/><text x='${pxX(x)-10}' y='${H-4}' font-size='10'>${x}°</text>`).join('');
 const vy=yMarks.map(y=>`<line x1='${l}' y1='${pxY(y)}' x2='${W-r}' y2='${pxY(y)}' stroke='#eef2f7'/><text x='4' y='${pxY(y)+4}' font-size='10'>${y}</text>`).join('');
 return `${vx}${vy}<line x1='${l}' y1='${pxY(0)}' x2='${W-r}' y2='${pxY(0)}' stroke='#c5cfdb'/><line x1='${l}' y1='${t}' x2='${l}' y2='${H-b}' stroke='#c5cfdb'/>`;
}
function path(fn,breakTan=false){let d='',open=false;for(let dg=xMin;dg<=xMax;dg+=1){const x=dg*Math.PI/180;const y=fn(x);const bad=!Number.isFinite(y)||Math.abs(y)>1.25||(breakTan&&(Math.abs((dg-90)%180)<2));if(bad){open=false;continue;}const p=`${pxX(dg)} ${pxY(y)}`;d+=open?` L ${p}`:` M ${p}`;open=true;}return d;}
function markers(a,b,fn,color,name){const points=[['α',a],['β',b]].map(([lab,ang])=>{const y=fn(ang);if(!Number.isFinite(y)||Math.abs(y)>1.25)return '';const xdg=deg(ang);return `<line x1='${pxX(xdg)}' y1='${t}' x2='${pxX(xdg)}' y2='${H-b}' stroke='#cbd5e1' stroke-dasharray='3 3'/><circle cx='${pxX(xdg)}' cy='${pxY(y)}' r='3' fill='${color}'/><text x='${pxX(xdg)+4}' y='${pxY(y)-6}' font-size='10'>${lab}: ${y.toFixed(2)}</text>`;}).join('');
 return points;
}
function draw(svg,fn,color,a,b,name,isTan=false){svg.innerHTML=`<rect width='${W}' height='${H}' fill='#fff'/>${axes()}${isTan?`<line x1='${pxX(90)}' y1='${t}' x2='${pxX(90)}' y2='${H-b}' stroke='#fda4af' stroke-dasharray='4 3'/><line x1='${pxX(270)}' y1='${t}' x2='${pxX(270)}' y2='${H-b}' stroke='#fda4af' stroke-dasharray='4 3'/>`:''}<path d='${path(fn,isTan)}' fill='none' stroke='${color}' stroke-width='2.1'/>${markers(a,b,fn,color,name)}`;}

export function renderGraphs(sinSvg,cosSvg,tanSvg,alpha,beta){
 draw(sinSvg,Math.sin,'#2563eb',alpha,beta,'sin');
 draw(cosSvg,Math.cos,'#059669',alpha,beta,'cos');
 draw(tanSvg,Math.tan,'#dc2626',alpha,beta,'tg',true);
}
