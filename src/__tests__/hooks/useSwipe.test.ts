import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useSwipe } from '../../hooks/useSwipe';

/** Build a minimal synthetic TouchEvent for testing. */
function makeTouchEvent(x: number, y: number): React.TouchEvent {
  return {
    touches: [{ clientX: x, clientY: y }],
    changedTouches: [{ clientX: x, clientY: y }],
  } as unknown as React.TouchEvent;
}

describe('useSwipe', () => {
  it('calls onSwipeLeft when swiping left with sufficient distance and speed', () => {
    const onSwipeLeft = vi.fn();
    const { result } = renderHook(() => useSwipe({ onSwipeLeft }));

    const now = Date.now();
    vi.spyOn(Date, 'now')
      .mockReturnValueOnce(now)        // touchStart time
      .mockReturnValueOnce(now + 100); // touchEnd time (within 300 ms)

    act(() => {
      result.current.onTouchStart(makeTouchEvent(200, 100));
    });
    act(() => {
      result.current.onTouchEnd(makeTouchEvent(100, 100)); // deltaX = -100
    });

    expect(onSwipeLeft).toHaveBeenCalledOnce();
    vi.restoreAllMocks();
  });

  it('calls onSwipeRight when swiping right', () => {
    const onSwipeRight = vi.fn();
    const { result } = renderHook(() => useSwipe({ onSwipeRight }));

    const now = Date.now();
    vi.spyOn(Date, 'now')
      .mockReturnValueOnce(now)
      .mockReturnValueOnce(now + 100);

    act(() => {
      result.current.onTouchStart(makeTouchEvent(100, 100));
    });
    act(() => {
      result.current.onTouchEnd(makeTouchEvent(200, 100)); // deltaX = +100
    });

    expect(onSwipeRight).toHaveBeenCalledOnce();
    vi.restoreAllMocks();
  });

  it('calls onSwipeUp when swiping up', () => {
    const onSwipeUp = vi.fn();
    const { result } = renderHook(() => useSwipe({ onSwipeUp }));

    const now = Date.now();
    vi.spyOn(Date, 'now')
      .mockReturnValueOnce(now)
      .mockReturnValueOnce(now + 100);

    act(() => {
      result.current.onTouchStart(makeTouchEvent(100, 200));
    });
    act(() => {
      result.current.onTouchEnd(makeTouchEvent(100, 100)); // deltaY = -100
    });

    expect(onSwipeUp).toHaveBeenCalledOnce();
    vi.restoreAllMocks();
  });

  it('calls onSwipeDown when swiping down', () => {
    const onSwipeDown = vi.fn();
    const { result } = renderHook(() => useSwipe({ onSwipeDown }));

    const now = Date.now();
    vi.spyOn(Date, 'now')
      .mockReturnValueOnce(now)
      .mockReturnValueOnce(now + 100);

    act(() => {
      result.current.onTouchStart(makeTouchEvent(100, 100));
    });
    act(() => {
      result.current.onTouchEnd(makeTouchEvent(100, 200)); // deltaY = +100
    });

    expect(onSwipeDown).toHaveBeenCalledOnce();
    vi.restoreAllMocks();
  });

  it('does not fire when the swipe distance is below the minimum threshold', () => {
    const onSwipeLeft = vi.fn();
    const { result } = renderHook(() => useSwipe({ onSwipeLeft }));

    const now = Date.now();
    vi.spyOn(Date, 'now')
      .mockReturnValueOnce(now)
      .mockReturnValueOnce(now + 50);

    act(() => {
      result.current.onTouchStart(makeTouchEvent(100, 100));
    });
    act(() => {
      result.current.onTouchEnd(makeTouchEvent(90, 100)); // deltaX = -10 (< 30 px)
    });

    expect(onSwipeLeft).not.toHaveBeenCalled();
    vi.restoreAllMocks();
  });

  it('does not fire when the swipe exceeds the maximum time limit', () => {
    const onSwipeLeft = vi.fn();
    const { result } = renderHook(() => useSwipe({ onSwipeLeft }));

    const now = Date.now();
    vi.spyOn(Date, 'now')
      .mockReturnValueOnce(now)
      .mockReturnValueOnce(now + 500); // 500 ms > 300 ms limit

    act(() => {
      result.current.onTouchStart(makeTouchEvent(200, 100));
    });
    act(() => {
      result.current.onTouchEnd(makeTouchEvent(100, 100));
    });

    expect(onSwipeLeft).not.toHaveBeenCalled();
    vi.restoreAllMocks();
  });

  it('does not fire when onTouchEnd is called without a prior onTouchStart', () => {
    const onSwipeLeft = vi.fn();
    const { result } = renderHook(() => useSwipe({ onSwipeLeft }));

    act(() => {
      result.current.onTouchEnd(makeTouchEvent(100, 100));
    });

    expect(onSwipeLeft).not.toHaveBeenCalled();
  });

  it('respects custom minSwipeDistance config', () => {
    const onSwipeLeft = vi.fn();
    const { result } = renderHook(() =>
      useSwipe({ onSwipeLeft }, { minSwipeDistance: 80 }),
    );

    const now = Date.now();
    vi.spyOn(Date, 'now')
      .mockReturnValueOnce(now)
      .mockReturnValueOnce(now + 100);

    // 50 px delta — enough for the default 30 px but not for 80 px
    act(() => {
      result.current.onTouchStart(makeTouchEvent(200, 100));
    });
    act(() => {
      result.current.onTouchEnd(makeTouchEvent(150, 100));
    });

    expect(onSwipeLeft).not.toHaveBeenCalled();
    vi.restoreAllMocks();
  });
});
