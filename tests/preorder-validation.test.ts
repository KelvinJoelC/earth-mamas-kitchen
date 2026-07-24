import { describe, expect, it } from 'vitest';

import {
  containsEmoji,
  hasMeaningfulText,
  isValidPreorderFullName,
  isValidPreorderPhone,
} from '@/domain/preorder-validation';

describe('preorder validation', () => {
  it('validates the approved Australian mobile format', () => {
    expect(isValidPreorderPhone('0412345678')).toBe(true);
    expect(isValidPreorderPhone('041234567')).toBe(false);
    expect(isValidPreorderPhone('04 1234 5678')).toBe(false);
    expect(isValidPreorderPhone('+61412345678')).toBe(false);
  });

  it('trims names while enforcing the approved maximum length', () => {
    expect(isValidPreorderFullName('  Alex Customer  ')).toBe(true);
    expect(isValidPreorderFullName('   ')).toBe(false);
    expect(isValidPreorderFullName('a'.repeat(101))).toBe(false);
  });

  it('recognises whitespace-only values and emoji', () => {
    expect(hasMeaningfulText('   ')).toBe(false);
    expect(hasMeaningfulText('  custom colours  ')).toBe(true);
    expect(containsEmoji('Birthday 🎂')).toBe(true);
    expect(containsEmoji('Birthday cake')).toBe(false);
  });
});
