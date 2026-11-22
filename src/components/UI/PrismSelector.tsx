import React from 'react'
import { PrismType } from '../../types/prism'
import { PRISM_CONFIGS } from '../../math/prismConfigs'
import { Triangle, Square, Pentagon, Hexagon } from 'lucide-react'

interface PrismSelectorProps {
  activeType: PrismType
  onSelect: (type: PrismType) => void
}

const PRISM_ICONS: Record<PrismType, React.ElementType> = {
  triangular: Triangle,
  square: Square,
  pentagonal: Pentagon,
  hexagonal: Hexagon,
}

export default function PrismSelector({ activeType, onSelect }: PrismSelectorProps): React.ReactElement {
  const types: PrismType[] = ['triangular', 'square', 'pentagonal', 'hexagonal']

  return (
    <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800 shadow-xl space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        Wybór bryły
      </h2>

      <div className="grid grid-cols-2 gap-2">
        {types.map(type => {
          const config = PRISM_CONFIGS[type]
          const isSelected = activeType === type
          const Icon = PRISM_ICONS[type]

          return (
            <button
              key={type}
              onClick={() => onSelect(type)}
              className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-800/40 border-slate-800/80 text-slate-300 hover:bg-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              <div
                className={`p-1.5 rounded-lg ${
                  isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <span className="block text-xs font-medium truncate capitalize">
                  {config.name.replace('Graniastosłup ', '')}
                </span>
                <span className="block text-[10px] text-slate-400">
                  {config.polygonSides} ściany boczne
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
