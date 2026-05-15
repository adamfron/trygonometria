import { parseExpr, eq, simplify } from './fractions.js';

export function trigRows(task) {
  const A=task.a.value,B=task.b.value,C=task.c.value;
  return [
    { key:'sinA', label:'sin α', raw:{n:A,d:C} },
    { key:'cosA', label:'cos α', raw:{n:B,d:C} },
    { key:'tanA', label:'tg α', raw:{n:A,d:B} },
    { key:'sinB', label:'sin β', raw:{n:B,d:C} },
    { key:'cosB', label:'cos β', raw:{n:A,d:C} },
    { key:'tanB', label:'tg β', raw:{n:B,d:A} }
  ].map(r=>({...r,simple:simplify(r.raw.n,r.raw.d)}));
}

export function checkRow(row, vals) {
  const rv = parseExpr(vals.rn), rd = parseExpr(vals.rd);
  const okRaw = eq(rv/rd, row.raw.n/row.raw.d);
  if (!row.simple.changed) return okRaw;
  const sv = parseExpr(vals.sn), sd = parseExpr(vals.sd);
  return okRaw && eq(sv/sd, row.simple.num/row.simple.den);
}
