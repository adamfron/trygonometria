import {parseExpr,approxEq,simplify} from './fractions.js';

function simplificationPlan(n,d){
  if(Number.isInteger(n)&&Number.isInteger(d)){
    const s=simplify(n,d);
    if(!s.changed) return {mode:'none'};
    if(s.den===1) return {mode:'single',value:s.num};
    return {mode:'fraction',num:s.num,den:s.den};
  }
  if(approxEq(d,1)) return {mode:'single',value:n};
  if(approxEq(d,Math.sqrt(3))&&approxEq(n,1)) return {mode:'fraction',num:Math.sqrt(3),den:3};
  if(approxEq(d,Math.SQRT2)&&approxEq(n,1)) return {mode:'none'}; // 1/√2 accepted as √2/2 equivalent
  return {mode:'none'};
}

export function rows(t){
  return [{k:'sinA',n:t.a,d:t.c},{k:'cosA',n:t.b,d:t.c},{k:'tanA',n:t.a,d:t.b},{k:'sinB',n:t.b,d:t.c},{k:'cosB',n:t.a,d:t.c},{k:'tanB',n:t.b,d:t.a}]
    .map(r=>({...r,s:simplificationPlan(r.n,r.d)}));
}

export function checkAnswer(t,key,rawN,rawD,sN,sD,sSingle){
 const r=rows(t).find(x=>x.k===key);if(!r)return false;
 const rn=parseExpr(rawN),rd=parseExpr(rawD); if(rn==null||rd==null||rd===0)return false;
 const base=approxEq(rn/rd,r.n/r.d); if(!base) return false;
 if(r.s.mode==='none') return true;
 if(r.s.mode==='single'){const sv=parseExpr(sSingle); return sv!=null&&approxEq(sv,r.s.value);} 
 const sn=parseExpr(sN),sd=parseExpr(sD); if(sn==null||sd==null||sd===0)return false;
 return approxEq(sn/sd,r.s.num/r.s.den);
}
