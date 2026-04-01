/**
 * Tests for the analytics period-filtering logic.
 */
import { describe, it, expect } from 'vitest';
import { inPeriod, AnalyticsPeriod } from '../../hooks/useAnalytics';

// ── Helpers ──────────────────────────────────────────────────────────────────
function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 60 * 60 * 1000).toISOString();
}

function daysAgo(d: number): string {
  return new Date(Date.now() - d * 24 * 60 * 60 * 1000).toISOString();
}

describe('inPeriod — Today', () => {
  it('includes a timestamp from 1 hour ago', () => {
    expect(inPeriod(hoursAgo(1), 'Today')).toBe(true);
  });

  it('excludes a timestamp from yesterday', () => {
    expect(inPeriod(daysAgo(1), 'Today')).toBe(false);
  });

  it('excludes a timestamp from 7 days ago', () => {
    expect(inPeriod(daysAgo(7), 'Today')).toBe(false);
  });
});

describe('inPeriod — This Week', () => {
  it('includes a timestamp from 1 day ago', () => {
    expect(inPeriod(daysAgo(1), 'This Week')).toBe(true);
  });

  it('includes a timestamp from the start of the current week (Monday)', () => {
    const now = new Date();
    // Find this Monday
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    monday.setHours(1, 0, 0, 0); // 01:00 on Monday — safely within the current week
    expect(inPeriod(monday.toISOString(), 'This Week')).toBe(true);
  });

  it('excludes a timestamp from 8 days ago', () => {
    expect(inPeriod(daysAgo(8), 'This Week')).toBe(false);
  });
});

describe('inPeriod — This Month', () => {
  it('includes a timestamp from earlier today', () => {
    expect(inPeriod(hoursAgo(2), 'This Month')).toBe(true);
  });

  it('includes a timestamp from 20 days ago when in the same month', () => {
    const now = new Date();
    const d   = new Date(now);
    d.setDate(1); // first of the current month
    expect(inPeriod(d.toISOString(), 'This Month')).toBe(true);
  });

  it('excludes a timestamp from the previous year', () => {
    const lastYear = new Date();
    lastYear.setFullYear(lastYear.getFullYear() - 1);
    expect(inPeriod(lastYear.toISOString(), 'This Month')).toBe(false);
  });
});

describe('inPeriod — This Year', () => {
  it('includes a timestamp from 1 day ago', () => {
    expect(inPeriod(daysAgo(1), 'This Year')).toBe(true);
  });

  it('includes a timestamp from the start of the current year', () => {
    const jan1 = new Date(new Date().getFullYear(), 0, 1).toISOString();
    expect(inPeriod(jan1, 'This Year')).toBe(true);
  });

  it('excludes a timestamp from last year', () => {
    const lastYear = new Date();
    lastYear.setFullYear(lastYear.getFullYear() - 1);
    expect(inPeriod(lastYear.toISOString(), 'This Year')).toBe(false);
  });
});
