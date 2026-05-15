export function renderGraphs({sinSvg,cosSvg,tanSvg,alphaDeg,betaDeg}){
  const draw=(svg,fn,yMin,yMax,opt={})=>{const w=420,h=150,p=24,x=d=>p+((d+30)/420)*(w-2*p),y=v=>p+((yMax-v)/(yMax-yMin))*(h-2*p);
    let path='',seg=[];for(let d=-30;d<=390;d++){const r=d*Math.PI/180,v=fn(r,d),br=!Number.isFinite(v)||v<yMin||v>yMax||(opt.breakFn&&opt.breakFn(r));if(br){if(seg.length>1)path+=`M ${seg.join(' L ')}`;seg=[];}else seg.push(`${x(d)} ${y(v)}`);}if(seg.length>1)path+=` M ${seg.join(' L ')}`;
    const marker=(deg,col)=>{const v=fn(deg*Math.PI/180,deg);if(!Number.isFinite(v)||v<yMin||v>yMax)return '';return `<line x1='${x(deg)}' y1='${p}' x2='${x(deg)}' y2='${h-p}' stroke='${col}' stroke-dasharray='4 4'/><circle cx='${x(deg)}' cy='${y(v)}' r='4' fill='${col}'/>`;};
    svg.innerHTML=`<rect width='${w}' height='${h}' fill='#fff' rx='12'/><path d='${path}' fill='none' stroke='#1f2937' stroke-width='2.2'/>${marker(alphaDeg,'#2563eb')}${marker(betaDeg,'#dc2626')}`;
  };
  draw(sinSvg,Math.sin,-1.2,1.2); draw(cosSvg,Math.cos,-1.2,1.2); draw(tanSvg,Math.tan,-4,4,{breakFn:r=>Math.abs(Math.cos(r))<0.04});
}
