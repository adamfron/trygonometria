export const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a)||1;
export const simplify=(n,d)=>{const g=gcd(Math.round(n*10000),Math.round(d*10000));const nn=Math.round(n*10000)/g;const dd=Math.round(d*10000)/g;return{num:nn,den:dd,changed:Math.abs(nn-n)>1e-6||Math.abs(dd-d)>1e-6}};

function canonical(s){return s.trim().toLowerCase().replace(/,/g,'.').replace(/\s+/g,'').replace(/√/g,'sqrt');}

export function parseExpr(v){if(!v)return null;const s=canonical(v);
if(/^\d+(\.\d+)?$/.test(s))return Number(s);
try{
const norm=s
.replace(/sqrt\(([^)]+)\)/g,'Math.sqrt($1)')
.replace(/sqrt(\d+)/g,'Math.sqrt($1)')
.replace(/(\d)sqrt/g,'$1*Math.sqrt')
.replace(/\)(?=Math\.sqrt)/g,')*');
const x=Function(`return (${norm})`)();
return Number.isFinite(x)?x:null;
}catch{return null;}
}

export const approxEq=(a,b)=>a!=null&&b!=null&&Math.abs(a-b)<1e-4;

export const symbolic=(n)=>{
  if(approxEq(n,Math.SQRT2)) return '√2';
  if(approxEq(n,Math.sqrt(3))) return '√3';
  if(approxEq(n,2*Math.sqrt(3))) return '2√3';
  if(approxEq(n,Math.SQRT2/2)) return '√2/2';
  if(approxEq(n,Math.sqrt(3)/2)) return '√3/2';
  return String(Number(n.toFixed(4)));
};
