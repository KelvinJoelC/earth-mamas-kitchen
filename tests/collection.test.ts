import { describe, expect, it } from 'vitest';

import {
  COLLECTION_TIME_SLOTS,
  getBrisbaneDate,
  getEarliestCollectionDate,
  isCollectionWeekday,
} from '@/domain/collection';

describe('collection scheduling', () => {
  it('uses the Brisbane calendar date instead of UTC date', () => {
    expect(getBrisbaneDate(new Date('2026-07-22T23:30:00.000Z'))).toBe(
      '2026-07-23',
    );
  });

  it('skips weekends when calculating the earliest valid date', () => {
    const thursday = new Date('2026-07-02T00:00:00.000Z');

    expect(getEarliestCollectionDate(3, thursday)).toBe('2026-07-06');
    expect(isCollectionWeekday('2026-07-04')).toBe(false);
    expect(isCollectionWeekday('2026-07-06')).toBe(true);
  });

  it('provides every half-hour slot from 9:00 am through 4:00 pm', () => {
    expect(COLLECTION_TIME_SLOTS).toHaveLength(15);
    expect(COLLECTION_TIME_SLOTS[0]).toBe('09:00');
    expect(COLLECTION_TIME_SLOTS.at(-1)).toBe('16:00');
  });
});
