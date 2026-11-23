import React, { useState } from 'react'
import { HelpCircle, X, Box, Keyboard, Camera, Smartphone, SlidersHorizontal } from 'lucide-react'

interface HeaderProps {
  onResetCamera?: () => void
  onOpenDrawer?: () => void
}

export default function Header({ onResetCamera, onOpenDrawer }: HeaderProps): React.ReactElement {
  const [showHelp, setShowHelp] = useState(false)

  return (
    <header className="relative flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3.5 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 z-30">
      <div className="flex items-center gap-2.5 sm:gap-3">
        <div className="p-1.5 sm:p-2 bg-indigo-500/20 rounded-xl text-indigo-400 border border-indigo-500/30">
          <Box className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div>
          <h1 className="text-sm sm:text-base md:text-lg font-bold text-slate-100 tracking-tight leading-tight">
            <span className="xs:hidden">Siatki 3D</span>
            <span className="hidden xs:inline sm:hidden">Siatki Graniastosłupów 3D</span>
            <span className="hidden sm:inline">Wizualizator Siatek Graniastosłupów Prostych 3D</span>
          </h1>
          <p className="hidden sm:block text-xs text-slate-400">
            Interaktywna animacja składania i rozkładania brył
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Quick Reset Camera Button */}
        {onResetCamera && (
          <button
            onClick={onResetCamera}
            aria-label="Reset widoku kamery"
            title="Resetuj widok kamery"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border border-slate-700/60 shadow-sm"
          >
            <Camera className="w-4 h-4 text-indigo-400" />
            <span className="hidden md:inline">Reset kamery</span>
          </button>
        )}

        {/* Mobile Drawer Trigger (Top-Right Quick Access) */}
        {onOpenDrawer && (
          <button
            onClick={onOpenDrawer}
            aria-label="Otwórz panel opcji i brył"
            title="Opcje i wybór bryły"
            className="lg:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border border-slate-700/60"
          >
            <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold">Opcje</span>
          </button>
        )}

        {/* Help Button */}
        <button
          onClick={() => setShowHelp(true)}
          aria-label="Pomoc"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border border-slate-700/60"
        >
          <HelpCircle className="w-4 h-4 text-indigo-400" />
          <span className="hidden xs:inline">Pomoc</span>
        </button>
      </div>

      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg p-5 sm:p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm sm:text-base">
                <Keyboard className="w-5 h-5" />
                <span>Skróty klawiszowe i instrukcja obsługi</span>
              </div>
              <button
                onClick={() => setShowHelp(false)}
                aria-label="Zamknij"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs sm:text-sm text-slate-300">
              <p>
                Aplikacja umożliwia dynamiczne badanie relacji między płaską siatką (2D) a przestrzennym graniastosłupem prostym (3D).
              </p>

              {/* Mobile touch instructions */}
              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/70 space-y-2">
                <div className="flex items-center gap-2 text-indigo-300 font-semibold text-xs sm:text-sm pb-1 border-b border-slate-700/60">
                  <Smartphone className="w-4 h-4 text-indigo-400" />
                  <span>Sterowanie dotykowe (Telefon / Tablet):</span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-indigo-300 shrink-0">1 palec:</span>
                    <span>Przeciągnij, aby obracać bryłę 3D pod dowolnym kątem.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-indigo-300 shrink-0">2 palce (zsunięcie / rozszerzenie):</span>
                    <span>Pinch-to-zoom – przybliżanie lub oddalanie widoku.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-indigo-300 shrink-0">2 palce (przesunięcie):</span>
                    <span>Przesuwanie kamery w płaszczyźnie ekranu (pan).</span>
                  </div>
                </div>
              </div>

              {/* Desktop keyboard & mouse instructions */}
              <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-slate-300 font-semibold text-xs sm:text-sm pb-1 border-b border-slate-800">
                  <Keyboard className="w-4 h-4 text-indigo-400" />
                  <span>Klawiatura i mysz (Komputer):</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-indigo-300 border border-slate-700">Spacja</span>
                    <span>Odtwórz / Wstrzymaj animację</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-indigo-300 border border-slate-700">← / →</span>
                    <span>Krokowy obrót ścian (±1%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-indigo-300 border border-slate-700">R</span>
                    <span>Reset widoku kamery</span>
                  </div>
                  <div className="pt-1 text-slate-400">
                    <strong>Mysz:</strong> LPM – obrót, PPM/Shift – przesuwanie, Rolka – zoom.
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowHelp(false)}
                className="px-4 py-2 text-xs sm:text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors shadow-lg shadow-indigo-600/30"
              >
                Rozumiem
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
