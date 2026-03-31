/**
 * @fileoverview safeEval — Safe math expression evaluator for CalcPro.NP
 *
 * Replaces the dangerous eval() function with a safe, sandboxed
 * math expression parser. Supports:
 *   - Basic arithmetic: +, -, *, /, %, ^
 *   - Parentheses grouping
 *   - Trigonometry: sin, cos, tan, asin, acos, atan, sinh, cosh, tanh
 *   - Additional trig: csc, sec, cot
 *   - Logarithms: log (base-10), ln (natural), log2
 *   - Powers: sqrt, cbrt, pow
 *   - Constants: pi (π), e
 *   - Rounding: round, floor, ceil, abs
 *   - Factorial: factorial(n)
 *   - Deg/Rad mode via isDeg flag
 *
 * Security: Uses no eval(), no Function(), no new Function().
 * All tokens are whitelisted before evaluation.
 *
 * @module utils/math/safeEval
 */

/** Options for expression evaluation */
export interface EvalOptions {
  /** If true, trig functions expect degrees; if false, radians (default: true) */
  isDeg?: boolean;
}

/**
 * Safely evaluates a mathematical expression string.
 *
 * @param expression - Math expression (e.g. "2 + sin(30)", "sqrt(16) * pi")
 * @param options    - Evaluation options (deg/rad mode)
 * @returns Numeric result as string, or 'Error' if expression is invalid
 *
 * @example
 * safeEval('2 + 3 * 4')        // '14'
 * safeEval('sin(90)', {isDeg: true})  // '1'
 * safeEval('sqrt(16)')         // '4'
 * safeEval('pi * 2')           // '6.283185307179586'
 */
export function safeEval(
  expression: string,
  options: EvalOptions = {}
): string {
  const { isDeg = true } = options;

  if (!expression || expression.trim() === '') return '0';

  try {
    // Normalize display symbols to standard operators
    let expr = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/π/g, 'pi')
      .replace(/\s+/g, '')
      .toLowerCase();

    // Validate: only allow safe characters
    // Whitelist: digits, operators, parens, dot, function names, variable names
    if (!/^[0-9+\-*/^%().a-z_,]+$/.test(expr)) {
      return 'Error';
    }

    // Convert to evaluatable JS
    const result = evalExpression(expr, isDeg);

    if (!isFinite(result)) return result === Infinity ? '∞' : 'Error';
    if (isNaN(result)) return 'Error';

    // Round to avoid floating point artifacts
    const rounded = parseFloat(result.toPrecision(10));
    return String(rounded);
  } catch {
    return 'Error';
  }
}

/**
 * Converts degrees to radians.
 * @param deg - Angle in degrees
 * @returns Angle in radians
 */
const toRad = (deg: number): number => (deg * Math.PI) / 180;

/**
 * Converts radians to degrees.
 * @param rad - Angle in radians
 * @returns Angle in degrees
 */
const toDeg = (rad: number): number => (rad * 180) / Math.PI;

/**
 * Computes factorial of n (n!).
 * @param n - Non-negative integer
 * @returns n! or NaN if n < 0 or not integer
 */
function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

/**
 * Core expression evaluator using recursive descent parsing.
 * Handles operator precedence correctly without eval().
 *
 * @param expr  - Preprocessed expression string
 * @param isDeg - Whether trig functions use degrees
 * @returns Numeric result
 */
function evalExpression(expr: string, isDeg: boolean): number {
  let pos = 0;

  /** Parse addition and subtraction (lowest precedence) */
  function parseAddSub(): number {
    let left = parseMulDiv();
    while (pos < expr.length && (expr[pos] === '+' || expr[pos] === '-')) {
      const op = expr[pos++];
      const right = parseMulDiv();
      left = op === '+' ? left + right : left - right;
    }
    return left;
  }

  /** Parse multiplication, division, modulo */
  function parseMulDiv(): number {
    let left = parsePow();
    while (pos < expr.length && (expr[pos] === '*' || expr[pos] === '/' || expr[pos] === '%')) {
      const op = expr[pos++];
      const right = parsePow();
      if (op === '*') left *= right;
      else if (op === '/') left /= right;
      else left %= right;
    }
    return left;
  }

  /** Parse exponentiation (right-associative) */
  function parsePow(): number {
    const base = parseUnary();
    if (pos < expr.length && expr[pos] === '^') {
      pos++;
      const exp = parsePow(); // right-associative
      return Math.pow(base, exp);
    }
    return base;
  }

  /** Parse unary minus */
  function parseUnary(): number {
    if (pos < expr.length && expr[pos] === '-') {
      pos++;
      return -parsePrimary();
    }
    return parsePrimary();
  }

  /** Parse primary: number, parenthesized expression, function call, constant */
  function parsePrimary(): number {
    // Parenthesized expression
    if (pos < expr.length && expr[pos] === '(') {
      pos++; // consume '('
      const val = parseAddSub();
      if (pos < expr.length && expr[pos] === ')') pos++; // consume ')'
      return val;
    }

    // Number literal
    if (pos < expr.length && (expr[pos] >= '0' && expr[pos] <= '9' || expr[pos] === '.')) {
      let numStr = '';
      while (pos < expr.length && (expr[pos] >= '0' && expr[pos] <= '9' || expr[pos] === '.')) {
        numStr += expr[pos++];
      }
      return parseFloat(numStr);
    }

    // Function or constant name
    let name = '';
    while (pos < expr.length && expr[pos] >= 'a' && expr[pos] <= 'z' || expr[pos] === '_') {
      name += expr[pos++];
    }

    // Constants
    if (name === 'pi') return Math.PI;
    if (name === 'e') return Math.E;
    if (name === 'inf' || name === 'infinity') return Infinity;

    // Function calls: name(arg) or name(arg1, arg2)
    if (pos < expr.length && expr[pos] === '(') {
      pos++; // consume '('
      const arg1 = parseAddSub();
      let arg2: number | undefined;
      if (pos < expr.length && expr[pos] === ',') {
        pos++; // consume ','
        arg2 = parseAddSub();
      }
      if (pos < expr.length && expr[pos] === ')') pos++; // consume ')'

      // Trig functions — apply deg/rad conversion
      const a = isDeg ? toRad(arg1) : arg1;
      switch (name) {
        case 'sin':   return Math.sin(a);
        case 'cos':   return Math.cos(a);
        case 'tan':   return Math.tan(a);
        case 'csc':   return 1 / Math.sin(a);
        case 'sec':   return 1 / Math.cos(a);
        case 'cot':   return 1 / Math.tan(a);
        case 'sinh':  return Math.sinh(arg1);
        case 'cosh':  return Math.cosh(arg1);
        case 'tanh':  return Math.tanh(arg1);
        case 'asin':  return isDeg ? toDeg(Math.asin(arg1)) : Math.asin(arg1);
        case 'acos':  return isDeg ? toDeg(Math.acos(arg1)) : Math.acos(arg1);
        case 'atan':  return isDeg ? toDeg(Math.atan(arg1)) : Math.atan(arg1);
        case 'arcsin': return isDeg ? toDeg(Math.asin(arg1)) : Math.asin(arg1);
        case 'arccos': return isDeg ? toDeg(Math.acos(arg1)) : Math.acos(arg1);
        case 'arctan': return isDeg ? toDeg(Math.atan(arg1)) : Math.atan(arg1);
        // Logarithms
        case 'log':   return arg2 !== undefined
          ? Math.log(arg1) / Math.log(arg2)  // log(x, base)
          : Math.log10(arg1);                 // log(x) = log10
        case 'log10': return Math.log10(arg1);
        case 'log2':  return Math.log2(arg1);
        case 'ln':    return Math.log(arg1);
        // Powers & roots
        case 'sqrt':  return Math.sqrt(arg1);
        case 'cbrt':  return Math.cbrt(arg1);
        case 'pow':   return Math.pow(arg1, arg2 ?? 2);
        case 'exp':   return Math.exp(arg1);
        case 'inv':   return 1 / arg1;
        // Rounding
        case 'abs':   return Math.abs(arg1);
        case 'round': return Math.round(arg1);
        case 'floor': return Math.floor(arg1);
        case 'ceil':  return Math.ceil(arg1);
        // Special
        case 'factorial': return factorial(arg1);
        case 'fact':      return factorial(arg1);
        case 'nrt':   return Math.pow(arg1, 1 / (arg2 ?? 2));
        case 'min':   return Math.min(arg1, arg2 ?? arg1);
        case 'max':   return Math.max(arg1, arg2 ?? arg1);
        case 'gcd': {
          let a = Math.abs(Math.round(arg1));
          let b = Math.abs(Math.round(arg2 ?? 0));
          while (b) { [a, b] = [b, a % b]; }
          return a;
        }
        case 'hcf': {
          let a = Math.abs(Math.round(arg1));
          let b = Math.abs(Math.round(arg2 ?? 0));
          while (b) { [a, b] = [b, a % b]; }
          return a;
        }
        case 'lcm': {
          let a = Math.abs(Math.round(arg1));
          let b = Math.abs(Math.round(arg2 ?? 0));
          if (a === 0 || b === 0) return 0;
          let gcdVal = a;
          let tempB = b;
          while (tempB) { [gcdVal, tempB] = [tempB, gcdVal % tempB]; }
          return Math.abs(a * b) / gcdVal;
        }
        case 'npr': return factorial(arg1) / factorial(arg1 - (arg2 ?? 0));
        case 'ncr': return factorial(arg1) / (factorial(arg2 ?? 0) * factorial(arg1 - (arg2 ?? 0)));
        default: return NaN;
      }
    }

    return NaN;
  }

  const result = parseAddSub();
  return result;
}
