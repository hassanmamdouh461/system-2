import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useLocalStorage } from '../../hooks/useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns the initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('reads an existing value from localStorage on mount', () => {
    localStorage.setItem('test-key', JSON.stringify('stored'));
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    expect(result.current[0]).toBe('stored');
  });

  it('persists a new value to localStorage when setValue is called', () => {
    const { result } = renderHook(() => useLocalStorage<string>('test-key', 'initial'));

    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');
    expect(JSON.parse(localStorage.getItem('test-key')!)).toBe('updated');
  });

  it('supports functional updates (like setState)', () => {
    const { result } = renderHook(() => useLocalStorage<number>('counter', 0));

    act(() => {
      result.current[1](prev => prev + 5);
    });

    expect(result.current[0]).toBe(5);
  });

  it('works with object values', () => {
    const initial = { name: 'Alice', age: 30 };
    const { result } = renderHook(() => useLocalStorage('user', initial));

    act(() => {
      result.current[1]({ name: 'Bob', age: 25 });
    });

    expect(result.current[0]).toEqual({ name: 'Bob', age: 25 });
    expect(JSON.parse(localStorage.getItem('user')!)).toEqual({ name: 'Bob', age: 25 });
  });

  it('initialises localStorage with the initial value on first mount', () => {
    renderHook(() => useLocalStorage('new-key', 42));
    expect(JSON.parse(localStorage.getItem('new-key')!)).toBe(42);
  });

  it('falls back to initial value when localStorage contains invalid JSON', () => {
    localStorage.setItem('bad-key', '{invalid json}');
    const { result } = renderHook(() => useLocalStorage('bad-key', 'fallback'));
    expect(result.current[0]).toBe('fallback');
  });
});
