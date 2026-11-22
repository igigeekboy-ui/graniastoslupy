import { useState, useEffect, useCallback, useRef } from 'react'
import { PrismType, ViewSettingsState } from '../types/prism'
import { clamp } from '../math/kinematics'

export interface PrismStateReturn {
  prismType: PrismType
  setPrismType: (type: PrismType) => void
  foldProgress: number
  setFoldProgress: (value: number) => void
  isPlaying: boolean
  togglePlay: () => void
  speed: number
  setSpeed: (speed: number) => void
  fold: () => void
  unfold: () => void
  viewSettings: ViewSettingsState
  toggleWireframe: () => void
  toggleColorBases: () => void
  toggleLabels: () => void
  toggleResetFoldOnSwitch: () => void
  cameraResetTrigger: number
  resetCamera: () => void
}

export function usePrismState(initialPrism: PrismType = 'square'): PrismStateReturn {
  const [prismType, setPrismTypeState] = useState<PrismType>(initialPrism)
  const [foldProgress, setFoldProgressState] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [speed, setSpeed] = useState<number>(1.0)
  const [cameraResetTrigger, setCameraResetTrigger] = useState<number>(0)

  const [viewSettings, setViewSettings] = useState<ViewSettingsState>({
    wireframe: true,
    colorBases: true,
    showLabels: false,
    resetFoldOnSwitch: false,
  })

  const animDirectionRef = useRef<number>(1) // 1 for folding, -1 for unfolding
  const foldProgressRef = useRef<number>(0)
  foldProgressRef.current = foldProgress

  const viewSettingsRef = useRef<ViewSettingsState>(viewSettings)
  viewSettingsRef.current = viewSettings

  const setFoldProgress = useCallback((val: number) => {
    setFoldProgressState(clamp(val, 0, 1))
  }, [])

  const setPrismType = useCallback((type: PrismType) => {
    setPrismTypeState(type)
    if (viewSettingsRef.current.resetFoldOnSwitch) {
      setFoldProgressState(0)
      animDirectionRef.current = 1
    }
  }, [])

  const fold = useCallback(() => {
    setFoldProgress(1)
    animDirectionRef.current = -1
  }, [setFoldProgress])

  const unfold = useCallback(() => {
    setFoldProgress(0)
    animDirectionRef.current = 1
  }, [setFoldProgress])

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev)
  }, [])

  const resetCamera = useCallback(() => {
    setCameraResetTrigger(prev => prev + 1)
  }, [])

  const toggleWireframe = useCallback(() => {
    setViewSettings(prev => ({ ...prev, wireframe: !prev.wireframe }))
  }, [])

  const toggleColorBases = useCallback(() => {
    setViewSettings(prev => ({ ...prev, colorBases: !prev.colorBases }))
  }, [])

  const toggleLabels = useCallback(() => {
    setViewSettings(prev => ({ ...prev, showLabels: !prev.showLabels }))
  }, [])

  const toggleResetFoldOnSwitch = useCallback(() => {
    setViewSettings(prev => ({ ...prev, resetFoldOnSwitch: !prev.resetFoldOnSwitch }))
  }, [])

  // Animation loop with requestAnimationFrame and delta time for smooth V-Sync rendering
  useEffect(() => {
    if (!isPlaying) return

    let animFrameId: number
    let lastTime = performance.now()
    const baseDurationSec = 2.5 // Seconds to fold from 0 to 1 at 1.0x speed

    const animate = (now: number) => {
      // Clamp delta time to 0.1s max to prevent jumps when background tabs resume
      const deltaSec = Math.min((now - lastTime) / 1000, 0.1)
      lastTime = now

      const step = (deltaSec / baseDurationSec) * speed
      let next = foldProgressRef.current + animDirectionRef.current * step

      if (next >= 1) {
        next = 1
        animDirectionRef.current = -1
      } else if (next <= 0) {
        next = 0
        animDirectionRef.current = 1
      }

      setFoldProgressState(next)
      animFrameId = requestAnimationFrame(animate)
    }

    animFrameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animFrameId)
  }, [isPlaying, speed])

  // Keyboard accessibility shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = document.activeElement
      // Ignore only if user is actively typing in a text field
      const isTextInput =
        (target instanceof HTMLInputElement && target.type !== 'range') ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement

      if (isTextInput) {
        return
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault()
          togglePlay()
          break
        case 'ArrowLeft':
          e.preventDefault()
          setFoldProgressState(prev => clamp(prev - 0.01, 0, 1))
          break
        case 'ArrowRight':
          e.preventDefault()
          setFoldProgressState(prev => clamp(prev + 0.01, 0, 1))
          break
        case 'KeyR':
          e.preventDefault()
          resetCamera()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [togglePlay, resetCamera])

  return {
    prismType,
    setPrismType,
    foldProgress,
    setFoldProgress,
    isPlaying,
    togglePlay,
    speed,
    setSpeed,
    fold,
    unfold,
    viewSettings,
    toggleWireframe,
    toggleColorBases,
    toggleLabels,
    toggleResetFoldOnSwitch,
    cameraResetTrigger,
    resetCamera,
  }
}
