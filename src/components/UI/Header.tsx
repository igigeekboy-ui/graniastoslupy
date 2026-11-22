import React, { useState } from 'react'
import { HelpCircle, X, Box, Keyboard } from 'lucide-react'

export default function Header(): React.ReactElement {
  const [showHelp, setShowHelp] = useState(false)

  return (
    <header className="relative flex items-center justify-between px-6 py-4 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 z-30">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400 border border-indigo-500/30">
          <Box className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-100 tracking-tight">
            Wizualizator Siatek Graniastosłupów Prostych 3D
          </h1>
          <p className="text-xs text-slate-400">
            Interaktywna animacja składania i rozkładania brył
          </p>
        </div>
      </div>

      <button
        onClick={() => setShowHelp(true)}
        aria-label="Pomoc"
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border border-slate-700/60"
      >
        <HelpCircle className="w-4 h-4 text-indigo-400" />
        <span>Pomoc</span>
      </button>

      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold">
                <Keyboard className="w-5 h-5" />
                <span>Skróty klawiszowe i instrukcja</span>
              </div>
              <button
                onClick={() => setShowHelp(false)}
                aria-label="Zamknij"
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <p>
                Aplikacja umożliwia dynamiczne badanie relacji między płaską siatką (2D) a przestrzennym graniastosłupem prostym (3D).
              </p>

              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-800 space-y-2">
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
              </div>

              <div className="text-xs text-slate-400 mt-2">
                <p><strong>Sterowanie myszą:</strong> LPM - obrót bryły, PPM/Shift - przesuwanie, Rolka - przybliżanie/oddalanie.</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowHelp(false)}
                className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors shadow-lg shadow-indigo-600/30"
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
