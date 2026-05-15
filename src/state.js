export const modes = [
  ['standard', 'Standard'],
  ['random', 'Losowa orientacja'],
  ['pyth', 'Brakujący bok / Pitagoras'],
  ['radicals', 'Radykały / trójkąty specjalne'],
  ['relation', 'Relacja boków']
];

export const state = {
  mode: 'standard',
  task: null,
  focusedInput: null,
  trigAttempts: 0,
  pythAttempts: 0,
  pythSolvedThisTask: true,
  showColorHints: false,
  showSquares: false,
  session: { solved: 0, wrongChecks: 0 }
};
