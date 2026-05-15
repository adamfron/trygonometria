export const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a) || 1);
export const simplify = (n, d) => { const g = gcd(n, d); return { num: n / g, den: d / g, changed: g !== 1 }; };

export function parseExpr(input) {
  if (input == null) return null;
  const s = String(input).trim().replace(/,/g, '.').replace(/√/g, 'sqrt');
  if (!s) return null;
  try {
    const norm = s
      .replace(/(\d)\s*sqrt\(/g, '$1*Math.sqrt(')
      .replace(/sqrt\(([^)]+)\)/g, 'Math.sqrt($1)')
      .replace(/sqrt(\d+)/g, 'Math.sqrt($1)');
    const value = Function(`return (${norm});`)();
    return Number.isFinite(value) ? value : null;
  } catch { return null; }
}

export const eq = (a, b, eps = 1e-4) => a != null && b != null && Math.abs(a - b) <= eps;
