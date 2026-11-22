import React from 'react'
import { ViewSettingsState } from '../../types/prism'
import { Eye, Palette, Tag, Camera, RotateCcw } from 'lucide-react'

interface ViewSettingsProps {
  settings: ViewSettingsState
  onToggleWireframe: () => void
  onToggleColorBases: () => void
  onToggleLabels: () => void
  onToggleResetFoldOnSwitch?: () => void
  onResetCamera: () => void
}

export default function ViewSettings({
  settings,
  onToggleWireframe,
  onToggleColorBases,
  onToggleLabels,
  onToggleResetFoldOnSwitch,
  onResetCamera,
}: ViewSettingsProps): React.ReactElement {
  return (
    <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800 shadow-xl space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        Ustawienia widoku
      </h2>

      <div className="space-y-2 text-xs">
        <label className="flex items-center justify-between p-2 rounded-xl bg-slate-800/40 hover:bg-slate-800/70 border border-slate-800 cursor-pointer transition-colors">
          <div className="flex items-center gap-2 text-slate-300">
            <Eye className="w-4 h-4 text-indigo-400" />
            <span>Pokaż krawędzie</span>
          </div>
          <input
            type="checkbox"
            checked={settings.wireframe}
            onChange={onToggleWireframe}
            className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-indigo-500"
          />
        </label>

        <label className="flex items-center justify-between p-2 rounded-xl bg-slate-800/40 hover:bg-slate-800/70 border border-slate-800 cursor-pointer transition-colors">
          <div className="flex items-center gap-2 text-slate-300">
            <Palette className="w-4 h-4 text-indigo-400" />
            <span>Koloruj podstawy</span>
          </div>
          <input
            type="checkbox"
            checked={settings.colorBases}
            onChange={onToggleColorBases}
            className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-indigo-500"
          />
        </label>

        <label className="flex items-center justify-between p-2 rounded-xl bg-slate-800/40 hover:bg-slate-800/70 border border-slate-800 cursor-pointer transition-colors">
          <div className="flex items-center gap-2 text-slate-300">
            <Tag className="w-4 h-4 text-indigo-400" />
            <span>Etykiety ścian</span>
          </div>
          <input
            type="checkbox"
            checked={settings.showLabels}
            onChange={onToggleLabels}
            className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-indigo-500"
          />
        </label>

        {onToggleResetFoldOnSwitch && (
          <label className="flex items-center justify-between p-2 rounded-xl bg-slate-800/40 hover:bg-slate-800/70 border border-slate-800 cursor-pointer transition-colors">
            <div className="flex items-center gap-2 text-slate-300">
              <RotateCcw className="w-4 h-4 text-indigo-400" />
              <span>Resetuj kąt przy zmianie bryły</span>
            </div>
            <input
              type="checkbox"
              checked={settings.resetFoldOnSwitch}
              onChange={onToggleResetFoldOnSwitch}
              className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-indigo-500"
            />
          </label>
        )}
      </div>

      <button
        onClick={onResetCamera}
        aria-label="Resetuj widok"
        className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700/60 transition-colors shadow-sm"
      >
        <Camera className="w-3.5 h-3.5 text-indigo-400" />
        <span>Resetuj widok kamery</span>
      </button>
    </div>
  )
}
