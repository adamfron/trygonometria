import { state } from './state.js';
const triples = [[3,4,5],[5,12,13],[8,15,17],[7,24,25],[6,8,10],[9,12,15]];
const ri = a => a[Math.floor(Math.random()*a.length)];

export function buildTask(){
 let [a,b,c]=ri(triples); if(Math.random()<.5)[a,b]=[b,a];
 if(state.mode==='radicals'){
  const rs=ri([{a:1,b:1,c:Math.SQRT2},{a:1,b:Math.sqrt(3),c:2},{a:Math.sqrt(3),b:1,c:2}]);
  return {a:rs.a,b:rs.b,c:rs.c,hidden:null,relation:null};
 }
 if(state.mode==='relation'){
  const k=ri([2,3]);
  // Work with normalized symbolic proportions: b = x, a = kx, c = x√(k²+1).
  // This prevents artificial simplification caused only by a random scale factor.
  return {a:k,b:1,c:Math.sqrt(k*k+1),hidden:null,relation:`Przyprostokątna a jest ${k} razy dłuższa od b.`,k};
 }
 const hidden=state.mode==='pyth'?ri(['a','b','c']):null;
 return {a,b,c,hidden};
}
