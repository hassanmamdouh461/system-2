import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useIsMobile } from '../../hooks/useIsMobile';

type MediaQueryCallback = (e: MediaQueryListEvent) => void;

function createMockMediaQuery(matches: boolean) {
  const listeners: MediaQueryCallback[] = [];
  const mql = {
    matches,
    media: '',
    onchange: null,
    addEventListener: vi.fn((_event: string, cb: MediaQueryCallback) => {
      listeners.push(cb);
    }),
    removeEventListener: vi.fn((_event: string, cb: MediaQueryCallback) => {
      const idx = listeners.indexOf(cb);
      if (idx !== -1) listeners.splice(idx, 1);
    }),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
    // Helper to simulate a viewport change
    _trigger(newMatches: boolean) {
      listeners.forEach(cb => cb({ matches: newMatches } as MediaQueryListEvent));
    },
  };
  return mql;
}

describe('useIsMobile', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns false when viewport is wider than the breakpoint', () => {
    const mockMql = createMockMediaQuery(false);
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockReturnValue(mockMql),
    });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('returns true when viewport is narrower than the breakpoint', () => {
    const mockMql = createMockMediaQuery(true);
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockReturnValue(mockMql),
    });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('updates when the media query changes', () => {
    const mockMql = createMockMediaQuery(false);
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockReturnValue(mockMql),
    });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    act(() => {
      mockMql._trigger(true);
    });

    expect(result.current).toBe(true);
  });

  it('uses the default breakpoint of 768px', () => {
    const mockMql = createMockMediaQuery(false);
    const matchMediaFn = vi.fn().mockReturnValue(mockMql);
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: matchMediaFn,
    });

    renderHook(() => useIsMobile());
    expect(matchMediaFn).toHaveBeenCalledWith('(max-width: 768px)');
  });

  it('respects a custom breakpoint', () => {
    const mockMql = createMockMediaQuery(false);
    const matchMediaFn = vi.fn().mockReturnValue(mockMql);
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: matchMediaFn,
    });

    renderHook(() => useIsMobile(1024));
    expect(matchMediaFn).toHaveBeenCalledWith('(max-width: 1024px)');
  });

  it('removes the event listener on unmount', () => {
    const mockMql = createMockMediaQuery(false);
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockReturnValue(mockMql),
    });

    const { unmount } = renderHook(() => useIsMobile());
    unmount();
    expect(mockMql.removeEventListener).toHaveBeenCalled();
  });
});
