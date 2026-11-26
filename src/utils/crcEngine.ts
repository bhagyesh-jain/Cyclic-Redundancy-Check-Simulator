/**
 * CRC (Cyclic Redundancy Check) Mathematical Engine
 * Pure browser-compatible, zero-dependency modulo-2 arithmetic.
 */

export interface DivisionStep {
  stepIndex: number;
  quotientBit: '0' | '1';
  dividendWindow: string; // The m-bit window currently being divided
  divisor: string; // Generator polynomial (if quotient bit is 1) or '0'.repeat(m)
  xorResult: string; // m-bit result of dividendWindow XOR divisor
  remainderBeforeNext: string; // (m-1)-bit remainder after dropping the leading 0
  nextBit: string | null; // The bit brought down from the dividend, if any
  nextWindow: string | null; // The new m-bit window for the next step, if any
  windowStartIndex: number; // 0-based start index of dividendWindow in paddedData
  broughtDownIndex: number | null; // index of nextBit in paddedData
  explanation: string;
}

export interface CrcCalculationResult {
  dataBits: string;
  generator: string;
  degree: number; // r = generator.length - 1
  paddedData: string; // dataBits + '0'.repeat(r)
  quotient: string;
  remainder: string; // r-bit CRC checksum
  codeword: string; // dataBits + remainder
  steps: DivisionStep[];
}

export interface ReceiverVerificationResult {
  receivedCodeword: string;
  generator: string;
  degree: number;
  quotient: string;
  remainder: string;
  isErrorFree: boolean;
  steps: DivisionStep[];
}

export function xorBits(a: string, b: string): string {
  let res = '';
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    res += a[i] === b[i] ? '0' : '1';
  }
  return res;
}

/**
 * Validates binary input
 */
export function validateBinaryString(val: string): { isValid: boolean; error?: string } {
  if (!val || val.trim().length === 0) {
    return { isValid: false, error: 'Input cannot be empty.' };
  }
  const clean = val.trim();
  if (!/^[01]+$/.test(clean)) {
    return { isValid: false, error: 'Only binary digits (0 and 1) are allowed.' };
  }
  return { isValid: true };
}

/**
 * Validates generator polynomial
 */
export function validateGenerator(val: string): { isValid: boolean; error?: string } {
  const binaryCheck = validateBinaryString(val);
  if (!binaryCheck.isValid) return binaryCheck;
  const clean = val.trim();
  if (clean.length < 2) {
    return { isValid: false, error: 'Generator must have degree >= 1 (at least 2 bits).' };
  }
  if (clean[0] !== '1') {
    return { isValid: false, error: 'Generator polynomial must start with 1 (highest degree term).' };
  }
  return { isValid: true };
}

/**
 * Performs step-by-step modulo-2 division
 * @param dividend The full binary string to divide (padded data or received codeword)
 * @param generator The generator polynomial string (starts with 1)
 */
export function performModulo2Division(
  dividend: string,
  generator: string
): { quotient: string; remainder: string; steps: DivisionStep[] } {
  const m = generator.length;
  const r = m - 1;

  if (dividend.length < m) {
    // If dividend is shorter than generator, remainder is dividend padded with leading 0s to length r
    const remainder = dividend.padStart(r, '0');
    return {
      quotient: '0',
      remainder,
      steps: []
    };
  }

  const steps: DivisionStep[] = [];
  let quotient = '';

  // Initial window: first m bits of dividend
  let currentWindow = dividend.slice(0, m);
  const totalSteps = dividend.length - m + 1;

  for (let i = 0; i < totalSteps; i++) {
    const isLeadingOne = currentWindow[0] === '1';
    const quotientBit: '0' | '1' = isLeadingOne ? '1' : '0';
    quotient += quotientBit;

    const divisorUsed = isLeadingOne ? generator : '0'.repeat(m);
    const xorResult = xorBits(currentWindow, divisorUsed);
    const remainderAfterDrop = xorResult.slice(1); // (m - 1) bits

    const broughtDownIndex = m + i < dividend.length ? m + i : null;
    const nextBit = broughtDownIndex !== null ? dividend[broughtDownIndex] : null;
    const nextWindow = nextBit !== null ? remainderAfterDrop + nextBit : null;

    const explanation = isLeadingOne
      ? `Step ${i + 1}: Leading bit is 1 → XOR current window (${currentWindow}) with Generator (${generator}). Intermediate remainder: ${remainderAfterDrop}${nextBit !== null ? `, bring down '${nextBit}' from index ${broughtDownIndex}` : ''}.`
      : `Step ${i + 1}: Leading bit is 0 → Quotient is 0, no XOR reduction needed. Shift window${nextBit !== null ? ` and bring down '${nextBit}' from index ${broughtDownIndex}` : ''}.`;

    steps.push({
      stepIndex: i,
      quotientBit,
      dividendWindow: currentWindow,
      divisor: divisorUsed,
      xorResult,
      remainderBeforeNext: remainderAfterDrop,
      nextBit,
      nextWindow,
      windowStartIndex: i,
      broughtDownIndex,
      explanation
    });

    if (nextWindow !== null) {
      currentWindow = nextWindow;
    }
  }

  // The final remainder is the last (m - 1) bits of the final xorResult
  const finalStep = steps[steps.length - 1];
  const remainder = finalStep ? finalStep.remainderBeforeNext : '0'.repeat(r);

  return {
    quotient,
    remainder,
    steps
  };
}

/**
 * Calculates CRC for a given data message and generator polynomial
 */
export function calculateCRC(dataBits: string, generator: string): CrcCalculationResult {
  const cleanData = dataBits.trim();
  const cleanGen = generator.trim();
  const degree = cleanGen.length - 1;
  const paddedData = cleanData + '0'.repeat(degree);

  const { quotient, remainder, steps } = performModulo2Division(paddedData, cleanGen);
  const codeword = cleanData + remainder;

  return {
    dataBits: cleanData,
    generator: cleanGen,
    degree,
    paddedData,
    quotient,
    remainder,
    codeword,
    steps
  };
}

/**
 * Verifies a received codeword at the receiver side
 */
export function verifyReceivedCodeword(
  receivedCodeword: string,
  generator: string
): ReceiverVerificationResult {
  const cleanReceived = receivedCodeword.trim();
  const cleanGen = generator.trim();
  const degree = cleanGen.length - 1;

  const { quotient, remainder, steps } = performModulo2Division(cleanReceived, cleanGen);
  // Remainder must be all zeros of length degree
  const isErrorFree = remainder === '0'.repeat(degree);

  return {
    receivedCodeword: cleanReceived,
    generator: cleanGen,
    degree,
    quotient,
    remainder,
    isErrorFree,
    steps
  };
}

/**
 * Formats a binary string into polynomial notation (e.g. 10011 -> x^4 + x + 1)
 */
export function binaryToPolynomial(bin: string): string {
  const clean = bin.trim();
  const terms: string[] = [];
  const degree = clean.length - 1;

  for (let i = 0; i < clean.length; i++) {
    if (clean[i] === '1') {
      const power = degree - i;
      if (power === 0) {
        terms.push('1');
      } else if (power === 1) {
        terms.push('x');
      } else {
        terms.push(`x^{${power}}`);
      }
    }
  }

  return terms.length > 0 ? terms.join(' + ') : '0';
}
