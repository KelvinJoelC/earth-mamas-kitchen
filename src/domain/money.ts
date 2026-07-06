declare const audCentsBrand: unique symbol;

export type AudCents = number & { readonly [audCentsBrand]: 'AudCents' };

export const audCents = (value: number): AudCents => {
  if (!Number.isInteger(value) || value < 0) {
    throw new RangeError('AUD cents must be a non-negative integer.');
  }

  return value as AudCents;
};
