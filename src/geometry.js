export const rotate=(p,ang,c)=>({x:c.x+(p.x-c.x)*Math.cos(ang)-(p.y-c.y)*Math.sin(ang),y:c.y+(p.x-c.x)*Math.sin(ang)+(p.y-c.y)*Math.cos(ang)});
export const sub=(a,b)=>({x:a.x-b.x,y:a.y-b.y});
export const add=(a,b)=>({x:a.x+b.x,y:a.y+b.y});
export const mul=(v,k)=>({x:v.x*k,y:v.y*k});
export const len=v=>Math.hypot(v.x,v.y);
export const unitVector=(from,to)=>{const v=sub(to,from);const l=len(v)||1;return{x:v.x/l,y:v.y/l};};
export const pointAlongRay=(vertex,point,radius)=>add(vertex,mul(unitVector(vertex,point),radius));
export const cross=(a,b)=>a.x*b.y-a.y*b.x;

export function drawInteriorArc(vertex,point1,point2,radius){
 const u1=unitVector(vertex,point1),u2=unitVector(vertex,point2);
 const p1=add(vertex,mul(u1,radius));
 const p2=add(vertex,mul(u2,radius));
 const sweep=cross(u1,u2)>0?1:0;
 return `M ${p1.x} ${p1.y} A ${radius} ${radius} 0 0 ${sweep} ${p2.x} ${p2.y}`;
}
