import React from 'react'
import { Play, Pause, RotateCcw, Box, SlidersHorizontal } from 'lucide-react'

export const ANIMATION_SPEEDS = [0.5, 1.0, 2.0] as const

interface FoldSliderProps {
  foldProgress: number
  onFoldProgressChange: (value: number) => void
  isPlaying: boolean
  onTogglePlay: () => void
  onFold: () => void
  onUnfold: () => void
  speed: number
  onSpeedChange: (speed: number) => void
  onOpenDrawer?: () => void
}

export default function FoldSlider({
  foldProgress,
  onFoldProgressChange,
  isPlaying,
  onTogglePlay,
  onFold,
  onUnfold,
  speed,
  onSpeedChange,
  onOpenDrawer,
}: FoldSliderProps): React.ReactElement {
  const percent = Math.round(foldProgress * 100)
  const angleDeg = Math.round(foldProgress * 90)

  // Cycling speeds for mobile single-tap button
  const handleCycleSpeed = () => {
    const currentIndex = ANIMATION_SPEEDS.indexOf(speed as (typeof ANIMATION_SPEEDS)[number])
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % ANIMATION_SPEEDS.length
    onSpeedChange(ANIMATION_SPEEDS[nextIndex])
  }

  return (
    <div className="bg-slate-900/95 sm:bg-slate-900/90 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-slate-800 shadow-2xl space-y-2.5 sm:space-y-3">
      {/* Top Header: Label & Status */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400">
          Stopień złożenia
        </span>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-[11px] sm:text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60">
            {angleDeg}°
          </span>
          <span className="text-xs sm:text-sm font-bold font-mono text-indigo-400 min-w-[2.5rem] sm:min-w-[3rem] text-right">
            {percent}%
          </span>
        </div>
      </div>

      {/* Main Touch-Friendly Slider */}
      <div className="relative flex items-center py-1">
        <input
          type="range"
          min="0"
          max="100"
          step="0.1"
          role="slider"
          aria-label="Suwak złożenia siatki"
          value={foldProgress * 100}
          onChange={e => onFoldProgressChange(parseFloat(e.target.value) / 100)}
          className="w-full h-3 sm:h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all focus:outline-none"
        />
      </div>

      {/* Playback Controls & Quick Jumps */}
      <div className="flex items-center justify-between gap-1 sm:gap-2 pt-1 border-t border-slate-800/80">
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Play / Pause */}
          <button
            onClick={onTogglePlay}
            aria-label={isPlaying ? 'Wstrzymaj' : 'Odtwarzaj'}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all shadow-md shadow-indigo-600/20 active:scale-95"
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            <span className="hidden xs:inline">{isPlaying ? 'Pauza' : 'Animacja'}</span>
          </button>

          {/* Unfold Quick Jump */}
          <button
            onClick={onUnfold}
            aria-label="Rozłóż"
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs transition-colors border border-slate-700/50"
            title="Rozłóż do siatki 2D (0%)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Rozłóż</span>
          </button>

          {/* Fold Quick Jump */}
          <button
            onClick={onFold}
            aria-label="Złóż"
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs transition-colors border border-slate-700/50"
            title="Złóż bryłę 3D (100%)"
          >
            <Box className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Złóż</span>
          </button>
        </div>

        {/* Speed Controls: Cycle button for mobile, 3 buttons for tablet/desktop */}
        <div className="flex items-center gap-1.5">
          {/* Mobile Single Speed Cycler */}
          <button
            onClick={handleCycleSpeed}
            aria-label={`Prędkość animacji ${speed}x`}
            className="sm:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 text-indigo-300 border border-slate-700/60 text-xs font-mono font-semibold"
          >
            <span>{speed}x</span>
          </button>

          {/* Desktop 3-Option Speed Selector */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-800/60 p-1 rounded-xl border border-slate-800">
            {ANIMATION_SPEEDS.map(s => (
              <button
                key={s}
                onClick={() => onSpeedChange(s)}
                aria-label={`Prędkość animacji ${s}x`}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-mono transition-colors ${
                  speed === s
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Mobile Drawer Open Button (In Thumb Zone) */}
          {onOpenDrawer && (
            <button
              onClick={onOpenDrawer}
              aria-label="Opcje i wybór bryły"
              className="lg:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400 border border-slate-700/60 text-xs font-medium transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="text-[11px] font-semibold">Opcje</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
