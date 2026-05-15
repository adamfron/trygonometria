export const gcd = (a, b) => {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) [a, b] = [b, a % b];
  return a || 1;
};

export const approxEq = (a, b, eps = 1e-4) =>
  a != null && b != null && Math.abs(a - b) < eps;

export const isWhole = (x) => Number.isFinite(x) && Math.abs(x - Math.round(x)) < 1e-7;

export const simplify = (n, d) => {
  if (!isWhole(n) || !isWhole(d) || approxEq(d, 0)) {
    return { num: n, den: d, changed: false };
  }
  const g = gcd(n, d);
  const sign = d < 0 ? -1 : 1;
  const num = sign * Math.round(n) / g;
  const den = sign * Math.round(d) / g;
  return { num, den, changed: g !== 1 || d < 0 };
};

function canonical(s) {
  return String(s ?? '')
    .trim()
    .toLowerCase()
    .replace(/,/g, '.')
    .replace(/\s+/g, '')
    .replace(/√/g, 'sqrt');
}

export function parseExpr(v) {
  if (!v && v !== 0) return null;
  const s = canonical(v);
  if (!s) return null;
  if (/^[+-]?\d+(\.\d+)?$/.test(s)) return Number(s);
  try {
    const norm = s
      .replace(/sqrt\(([^)]+)\)/g, 'Math.sqrt($1)')
      .replace(/sqrt(\d+(?:\.\d+)?)/g, 'Math.sqrt($1)')
      .replace(/(\d+(?:\.\d+)?)(?=Math\.sqrt)/g, '$1*')
      .replace(/\)(?=Math\.sqrt)/g, ')*');
    const x = Function(`return (${norm})`)();
    return Number.isFinite(x) ? x : null;
  } catch {
    return null;
  }
}

function sqrtIndex(value) {
  const sq = value * value;
  const n = Math.round(sq);
  if (n > 1 && Math.abs(sq - n) < 1e-6) return n;
  return null;
}

function sqrtCoefficient(value, maxRadicand = 50, maxCoeff = 12) {
  if (!Number.isFinite(value)) return null;
  const sign = value < 0 ? -1 : 1;
  const abs = Math.abs(value);
  if (isWhole(abs)) return { sign, coeff: Math.round(abs), radicand: 1 };
  for (let r = 2; r <= maxRadicand; r++) {
    const root = Math.sqrt(r);
    for (let c = 1; c <= maxCoeff; c++) {
      if (Math.abs(abs - c * root) < 1e-5) return { sign, coeff: c, radicand: r };
    }
  }
  return null;
}

export const symbolic = (n) => {
  if (!Number.isFinite(n)) return String(n);
  if (Math.abs(n) < 1e-8) return '0';
  if (isWhole(n)) return String(Math.round(n));

  const sc = sqrtCoefficient(n);
  if (sc && sc.radicand > 1) {
    const sign = sc.sign < 0 ? '-' : '';
    const coeff = sc.coeff === 1 ? '' : String(sc.coeff);
    return `${sign}${coeff}√${sc.radicand}`;
  }

  // Common exact fractions used by the trainer.
  const common = [
    [Math.SQRT2 / 2, '√2/2'],
    [Math.sqrt(3) / 2, '√3/2'],
    [Math.sqrt(5) / 5, '√5/5'],
    [Math.sqrt(10) / 10, '√10/10'],
  ];
  for (const [v, label] of common) if (approxEq(n, v)) return label;

  return String(Number(n.toFixed(4)));
};

export function denominatorRadicand(d) {
  if (isWhole(d)) return null;
  return sqrtIndex(d);
}

export function isSymbolicInteger(x) {
  return isWhole(x);
}
