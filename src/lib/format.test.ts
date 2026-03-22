import { describe, it, expect } from 'vitest';
import { formatDate, formatViews, formatRuntime } from './format';

describe('formatDate', () => {
  it('formats a date as "Month Year"', () => {
    expect(formatDate(new Date('2026-03-19'))).toBe('March 2026');
  });

  it('handles January correctly', () => {
    expect(formatDate(new Date('2020-01-15'))).toBe('January 2020');
  });

  it('handles December correctly', () => {
    expect(formatDate(new Date('2019-12-01'))).toBe('December 2019');
  });
});

describe('formatViews', () => {
  it('returns null for zero views', () => {
    expect(formatViews(0)).toBeNull();
  });

  it('returns the raw number as a string for small counts', () => {
    expect(formatViews(500)).toBe('500');
    expect(formatViews(999)).toBe('999');
  });

  it('rounds to nearest K for thousands', () => {
    expect(formatViews(1000)).toBe('1K');
    expect(formatViews(2900)).toBe('3K');
    expect(formatViews(15400)).toBe('15K');
  });

  it('formats millions with one decimal place', () => {
    expect(formatViews(1_000_000)).toBe('1.0M');
    expect(formatViews(1_200_000)).toBe('1.2M');
    expect(formatViews(10_500_000)).toBe('10.5M');
  });
});

describe('formatRuntime', () => {
  it('converts total seconds to hours and minutes', () => {
    expect(formatRuntime(3661)).toEqual({ hours: 1, mins: 1 });
  });

  it('handles exactly one hour', () => {
    expect(formatRuntime(3600)).toEqual({ hours: 1, mins: 0 });
  });

  it('handles zero', () => {
    expect(formatRuntime(0)).toEqual({ hours: 0, mins: 0 });
  });

  it('handles large totals', () => {
    // 23 talks × ~1h avg ≈ 80000s
    const result = formatRuntime(80000);
    expect(result.hours).toBe(22);
    expect(result.mins).toBe(13);
  });
});
