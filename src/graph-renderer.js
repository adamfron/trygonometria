function pathFor(fn){
 const pts=[];
 for(let i=0;i<=240;i++){const x=(i/240)*Math.PI*2;const y=fn(x);if(Number.isFinite(y))pts.push(`${20+i*1.6},${75-y*45}`);}
 return pts.join(' ');
}
function draw(svg,fn,color){svg.innerHTML=`<rect width='420' height='150' fill='#fff'/><line x1='20' y1='75' x2='404' y2='75' stroke='#c5cfdb'/><line x1='20' y1='20' x2='20' y2='130' stroke='#c5cfdb'/><polyline fill='none' stroke='${color}' stroke-width='2.2' points='${pathFor(fn)}'/>`;}
export function renderGraphs(sinSvg,cosSvg,tanSvg){draw(sinSvg,Math.sin,'#2563eb');draw(cosSvg,Math.cos,'#059669');draw(tanSvg,x=>Math.max(-1.8,Math.min(1.8,Math.tan(x))),'#dc2626');}
