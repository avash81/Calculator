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

  test('operator precedence and associativity', () => {
    // Exponentiation is right-associative: 2^(3^2) = 512
    expect(safeEval('2^3^2')).toBe('512');
    expect(safeEval('(2^3)^2')).toBe('64');
  });

  test('factorial and rounding helpers', () => {
    expect(safeEval('factorial(5)')).toBe('120');
    expect(safeEval('fact(0)')).toBe('1');
    expect(safeEval('round(2.6)')).toBe('3');
    expect(safeEval('floor(2.9)')).toBe('2');
    expect(safeEval('ceil(2.1)')).toBe('3');
    expect(safeEval('abs(-7)')).toBe('7');
  });

  test('inverse trig in degrees mode', () => {
    // asin(0.5) = 30 degrees
    expect(safeEval('asin(0.5)', { isDeg: true })).toBe('30');
  });

  test('unicode operator normalization', () => {
    expect(safeEval('2×3')).toBe('6');
    expect(safeEval('5−2')).toBe('3');
  });

  test('unsupported function returns Error', () => {
    expect(safeEval('hack(1)')).toBe('Error');
  });
});
