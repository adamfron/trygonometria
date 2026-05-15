import {parseExpr,approxEq,simplify} from './fractions.js';
export function rows(t){return [{k:'sinA',n:t.a,d:t.c},{k:'cosA',n:t.b,d:t.c},{k:'tanA',n:t.a,d:t.b},{k:'sinB',n:t.b,d:t.c},{k:'cosB',n:t.a,d:t.c},{k:'tanB',n:t.b,d:t.a}].map(r=>({...r,s:simplify(r.n,r.d)}));}
export function checkAnswer(t,key,rawN,rawD,sN,sD){
 const r=rows(t).find(x=>x.k===key);if(!r)return false;
 const rn=parseExpr(rawN),rd=parseExpr(rawD); if(rn==null||rd==null||rd===0)return false;
 const base=approxEq(rn/rd,r.n/r.d); if(!r.s.changed)return base;
 const sn=parseExpr(sN),sd=parseExpr(sD); if(sn==null||sd==null||sd===0)return false;
 return base&&approxEq(sn/sd,r.s.num/r.s.den);
}
