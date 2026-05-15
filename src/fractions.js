export const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a)||1;
export const simplify=(n,d)=>{const g=gcd(n,d);return{num:n/g,den:d/g,changed:g!==1}};
export function parseExpr(v){if(!v)return null;const s=v.trim().replace(',','.').replace(/√/g,'sqrt');
if(/^\d+(\.\d+)?$/.test(s))return Number(s);
try{const norm=s.replace(/sqrt\(([^)]+)\)/g,'Math.sqrt($1)').replace(/(\d)sqrt/g,'$1*Math.sqrt').replace(/sqrt(\d+)/g,'Math.sqrt($1)');
const x=Function(`return (${norm})`)();return Number.isFinite(x)?x:null;}catch{return null}}
export const approxEq=(a,b)=>a!=null&&b!=null&&Math.abs(a-b)<1e-4;
