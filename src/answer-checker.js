import {parseExpr,approxEq,simplify} from './fractions.js';

function isInt(x){return Number.isInteger(x);}

export function simplificationPlan(n,d){
  if(approxEq(d,0)) return {mode:'none'};

  if(isInt(n)&&isInt(d)){
    const s=simplify(n,d);
    if(s.den===1 && !approxEq(d,1)) return {mode:'single',value:s.num};
    if(s.changed) return {mode:'fraction',num:s.num,den:s.den};
    return {mode:'none'};
  }

  if(approxEq(d,1)) return {mode:'single',value:n};

  // rationalization patterns used in special triangles
  if(approxEq(d,Math.SQRT2)){
    const num=n*Math.SQRT2;
    const den=2;
    if(approxEq(num/den,n/d)) return approxEq(den,1)?{mode:'single',value:num}:{mode:'fraction',num,den};
  }
  if(approxEq(d,Math.sqrt(3))){
    const num=n*Math.sqrt(3);
    const den=3;
    if(approxEq(num/den,n/d)) return approxEq(den,1)?{mode:'single',value:num}:{mode:'fraction',num,den};
  }

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
