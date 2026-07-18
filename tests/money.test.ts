import { describe, expect, it } from 'vitest';

import { audCents } from '@/domain/money';

describe('AUD cents representation', () => {
  it('accepts zero and positive integer AUD-cent values', () => {
    expect(audCents(0)).toBe(0);
    expect(audCents(1500)).toBe(1500);
  });

  it('rejects negative or fractional values', () => {
    expect(() => audCents(-1)).toThrow(
      'AUD cents must be a non-negative integer.',
    );
    expect(() => audCents(10.5)).toThrow(
      'AUD cents must be a non-negative integer.',
    );
  });
});
