import { parseExpr, approxEq, simplify, isWhole, denominatorRadicand } from './fractions.js';

function simplifyNumericFraction(n, d) {
  if (!isWhole(n) || !isWhole(d) || approxEq(d, 0)) return null;
  return simplify(Math.round(n), Math.round(d));
}

function normalizeSingleOrFraction(num, den) {
  const s = simplifyNumericFraction(num, den);
  if (s) {
    if (s.den === 1) return { mode: 'single', value: s.num };
    if (s.changed) return { mode: 'fraction', num: s.num, den: s.den };
    return { mode: 'fraction', num: s.num, den: s.den };
  }
  return approxEq(den, 1)
    ? { mode: 'single', value: num }
    : { mode: 'fraction', num, den };
}

export function simplificationPlan(n, d) {
  if (approxEq(d, 0)) return { mode: 'none' };

  // A denominator equal to 1 is visually and mathematically a single value.
  if (approxEq(d, 1)) return { mode: 'single', value: n };

  // Pure integer fractions: reduce only when something really changes.
  const numeric = simplifyNumericFraction(n, d);
  if (numeric) {
    if (numeric.den === 1) return { mode: 'single', value: numeric.num };
    if (numeric.changed) return { mode: 'fraction', num: numeric.num, den: numeric.den };
    return { mode: 'none' };
  }

  // Rationalize denominators of the form √m.
  const m = denominatorRadicand(d);
  if (m) {
    const ratNum = n * d;
    const ratDen = m;
    const result = normalizeSingleOrFraction(ratNum, ratDen);

    // If rationalization gives the same visual form, do not ask for a duplicate.
    if (result.mode === 'fraction' && approxEq(result.num, n) && approxEq(result.den, d)) {
      return { mode: 'none' };
    }
    return result;
  }

  // Values such as √2/2, √3/2, 2√3/3 are already accepted final forms.
  return { mode: 'none' };
}

export function rows(t) {
  return [
    { k: 'sinA', n: t.a, d: t.c },
    { k: 'cosA', n: t.b, d: t.c },
    { k: 'tanA', n: t.a, d: t.b },
    { k: 'sinB', n: t.b, d: t.c },
    { k: 'cosB', n: t.a, d: t.c },
    { k: 'tanB', n: t.b, d: t.a },
  ].map((r) => ({ ...r, s: simplificationPlan(r.n, r.d) }));
}

export function checkAnswer(t, key, rawN, rawD, sN, sD, sSingle) {
  const r = rows(t).find((x) => x.k === key);
  if (!r) return false;

  const rn = parseExpr(rawN);
  const rd = parseExpr(rawD);
  if (rn == null || rd == null || approxEq(rd, 0)) return false;

  const base = approxEq(rn / rd, r.n / r.d);
  if (!base) return false;

  if (r.s.mode === 'none') return true;

  if (r.s.mode === 'single') {
    const sv = parseExpr(sSingle);
    return sv != null && approxEq(sv, r.s.value);
  }

  const sn = parseExpr(sN);
  const sd = parseExpr(sD);
  if (sn == null || sd == null || approxEq(sd, 0)) return false;
  return approxEq(sn / sd, r.s.num / r.s.den);
}
