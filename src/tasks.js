import { state } from './state.js';

const triples = [[3, 4, 5], [5, 12, 13], [6, 8, 10], [7, 24, 25], [8, 15, 17], [9, 12, 15]];
const ri = (a) => a[Math.floor(Math.random() * a.length)];
const side = (sym, num) => ({ symbol: sym, value: num, display: sym ?? String(num) });

function standardTask() {
  let [a, b, c] = ri(triples);
  if (Math.random() < 0.5) [a, b] = [b, a];
  return { a: side(null, a), b: side(null, b), c: side(null, c), hidden: null, relationText: '' };
}

function radicalsTask() {
  const set = ri([
    { a: side('1',1), b: side('1',1), c: side('√2', Math.SQRT2) },
    { a: side('1',1), b: side('√3', Math.sqrt(3)), c: side('2',2) },
    { a: side('√3',Math.sqrt(3)), b: side('1',1), c: side('2',2) }
  ]);
  return { ...set, hidden: null, relationText: '' };
}

function relationTask() {
  const k = ri([2,3]); const b = ri([2,3,4]); const a = b*k; const c = Math.hypot(a,b);
  return { a: side(null,a), b: side(null,b), c: side(null,c), hidden: null, relationText: `Przyprostokątna a jest ${k} razy dłuższa od b.` };
}

export function buildTask() {
  const base = state.mode === 'radicals' ? radicalsTask() : state.mode === 'relation' ? relationTask() : standardTask();
  if (state.mode === 'pyth') base.hidden = ri(['a','b','c']);
  const alphaDeg = Math.atan2(base.a.value, base.b.value) * 180 / Math.PI;
  return { ...base, alphaDeg, betaDeg: 90 - alphaDeg };
}
