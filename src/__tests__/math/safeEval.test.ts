import { safeEval } from '../../utils/math/safeEval';

describe('safeEval', () => {
  test('basic arithmetic', () => {
    expect(safeEval('2 + 3 * 4')).toBe('14');
    expect(safeEval('(2 + 3) * 4')).toBe('20');
    expect(safeEval('10 / 2')).toBe('5');
    expect(safeEval('10 - 2')).toBe('8');
  });

  test('trigonometry', () => {
    expect(safeEval('sin(90)', { isDeg: true })).toBe('1');
    expect(safeEval('cos(0)', { isDeg: true })).toBe('1');
  });

  test('constants', () => {
    expect(parseFloat(safeEval('pi'))).toBeCloseTo(Math.PI, 5);
    expect(parseFloat(safeEval('e'))).toBeCloseTo(Math.E, 5);
  });

  test('security', () => {
    expect(safeEval('console.log("hello")')).toBe('Error');
    expect(safeEval('process.exit()')).toBe('Error');
  });

  test('error handling', () => {
    expect(safeEval('1/0')).toBe('∞');
    expect(safeEval('sqrt(-1)')).toBe('Error');
    expect(safeEval('invalid')).toBe('Error');
  });
});
