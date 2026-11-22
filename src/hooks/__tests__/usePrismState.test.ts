import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePrismState } from '../usePrismState'

describe('usePrismState hook', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('initializes with default values', () => {
    const { result } = renderHook(() => usePrismState())

    expect(result.current.prismType).toBe('square')
    expect(result.current.foldProgress).toBe(0)
    expect(result.current.isPlaying).toBe(false)
    expect(result.current.speed).toBe(1.0)
    expect(result.current.viewSettings.wireframe).toBe(true)
    expect(result.current.viewSettings.colorBases).toBe(true)
  })

  it('allows changing prism type and resetting or preserving foldProgress', () => {
    const { result } = renderHook(() => usePrismState())

    act(() => {
      result.current.setPrismType('triangular')
    })
    expect(result.current.prismType).toBe('triangular')

    act(() => {
      result.current.setFoldProgress(0.75)
    })
    expect(result.current.foldProgress).toBe(0.75)
  })

  it('folds and unfolds with quick actions', () => {
    const { result } = renderHook(() => usePrismState())

    act(() => {
      result.current.fold()
    })
    expect(result.current.foldProgress).toBe(1)

    act(() => {
      result.current.unfold()
    })
    expect(result.current.foldProgress).toBe(0)
  })

  it('toggles playback and runs ping-pong animation', () => {
    const { result } = renderHook(() => usePrismState())

    act(() => {
      result.current.togglePlay()
    })
    expect(result.current.isPlaying).toBe(true)

    // Advance time by 500ms
    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(result.current.foldProgress).toBeGreaterThan(0)

    act(() => {
      result.current.togglePlay()
    })
    expect(result.current.isPlaying).toBe(false)
  })

  it('updates view settings', () => {
    const { result } = renderHook(() => usePrismState())

    act(() => {
      result.current.toggleWireframe()
    })
    expect(result.current.viewSettings.wireframe).toBe(false)

    act(() => {
      result.current.toggleColorBases()
    })
    expect(result.current.viewSettings.colorBases).toBe(false)

    act(() => {
      result.current.toggleLabels()
    })
    expect(result.current.viewSettings.showLabels).toBe(true)
  })

  it('handles resetFoldOnSwitch configuration when switching prisms', () => {
    const { result } = renderHook(() => usePrismState())

    // 1. Default: resetFoldOnSwitch is false, preserves progress
    act(() => {
      result.current.setFoldProgress(0.8)
    })
    expect(result.current.foldProgress).toBe(0.8)

    act(() => {
      result.current.setPrismType('hexagonal')
    })
    expect(result.current.prismType).toBe('hexagonal')
    expect(result.current.foldProgress).toBe(0.8) // Preserved

    // 2. Enable resetFoldOnSwitch
    act(() => {
      result.current.toggleResetFoldOnSwitch()
    })
    expect(result.current.viewSettings.resetFoldOnSwitch).toBe(true)

    // Switching prism now resets foldProgress to 0
    act(() => {
      result.current.setPrismType('triangular')
    })
    expect(result.current.prismType).toBe('triangular')
    expect(result.current.foldProgress).toBe(0) // Reset to 0
  })

  it('handles keyboard shortcuts even when range slider input has focus', () => {
    const { result } = renderHook(() => usePrismState())

    const rangeInput = document.createElement('input')
    rangeInput.type = 'range'
    document.body.appendChild(rangeInput)
    rangeInput.focus()

    expect(document.activeElement).toBe(rangeInput)

    // Space should still toggle play
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' }))
    })
    expect(result.current.isPlaying).toBe(true)

    // R should reset camera
    const prevTrigger = result.current.cameraResetTrigger
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyR' }))
    })
    expect(result.current.cameraResetTrigger).toBe(prevTrigger + 1)

    document.body.removeChild(rangeInput)
  })
})
