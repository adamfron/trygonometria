export const vsub = (a,b)=>({x:a.x-b.x,y:a.y-b.y});
export const norm = (v)=>Math.hypot(v.x,v.y)||1;
export const unit=(a,b)=>{const v=vsub(b,a),n=norm(v);return{x:v.x/n,y:v.y/n};};
export const pointAlongRay=(v,to,d)=>{const u=unit(v,to);return{x:v.x+u.x*d,y:v.y+u.y*d};};
export const rotate=(p,ang,c)=>({x:c.x+(p.x-c.x)*Math.cos(ang)-(p.y-c.y)*Math.sin(ang),y:c.y+(p.x-c.x)*Math.sin(ang)+(p.y-c.y)*Math.cos(ang)});
export function angleArc(vertex,p1,p2,r){const s=pointAlongRay(vertex,p1,r),e=pointAlongRay(vertex,p2,r);return `M ${s.x} ${s.y} A ${r} ${r} 0 0 1 ${e.x} ${e.y}`;}
export function rightMarker(v,p1,p2,size){const u1=unit(v,p1),u2=unit(v,p2);const pA={x:v.x+u1.x*size,y:v.y+u1.y*size};const pB={x:pA.x+u2.x*size,y:pA.y+u2.y*size};const pC={x:v.x+u2.x*size,y:v.y+u2.y*size};return `${pA.x},${pA.y} ${pB.x},${pB.y} ${pC.x},${pC.y}`;}
