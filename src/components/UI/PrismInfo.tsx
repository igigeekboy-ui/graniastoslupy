import React from 'react'
import { PrismConfig } from '../../types/prism'
import { calculatePrismMetrics } from '../../math/kinematics'
import { Info, Sigma } from 'lucide-react'

interface PrismInfoProps {
  config: PrismConfig
}

export default function PrismInfo({ config }: PrismInfoProps): React.ReactElement {
  const metrics = calculatePrismMetrics(config.polygonSides, config.sideLength, config.height)

  const polygonNames: Record<number, string> = {
    3: 'trójkąt równoboczny',
    4: 'kwadrat',
    5: 'pięciokąt foremny',
    6: 'sześciokąt foremny',
  }

  const baseName = polygonNames[config.polygonSides] || `${config.polygonSides}-kąt foremny`

  return (
    <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800 shadow-xl space-y-3">
      <div className="flex items-center gap-2">
        <Info className="w-4 h-4 text-indigo-400" />
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Informacje o bryle
        </h2>
      </div>

      <div className="space-y-1.5 text-xs text-slate-300">
        <div className="font-semibold text-slate-100 text-sm">
          {config.name}
        </div>
        <p className="text-slate-400">
          Podstawa: <span className="text-slate-200 capitalize">{baseName}</span>
        </p>
      </div>

      {/* Topology / Euler Grid */}
      <div className="grid grid-cols-3 gap-1.5 py-2 px-2.5 rounded-xl bg-slate-800/40 border border-slate-800 text-center">
        <div>
          <div className="text-[10px] text-slate-400">Wierzchołki (V):</div>
          <div className="text-sm font-bold text-indigo-400">{config.verticesCount}</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-400">Krawędzie (E):</div>
          <div className="text-sm font-bold text-amber-400">{config.edgesCount}</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-400">Ściany (F):</div>
          <div className="text-sm font-bold text-emerald-400">{config.facesCount}</div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-950/30 border border-indigo-800/30 text-[11px] text-indigo-300">
        <Sigma className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
        <span>
          Wzór Eulera: {config.verticesCount} - {config.edgesCount} + {config.facesCount} = 2
        </span>
      </div>

      {/* Surface areas & Volume */}
      <div className="pt-1 border-t border-slate-800/80 space-y-1 text-[11px] text-slate-400">
        <div className="flex justify-between">
          <span>Pole podstawy (Pp):</span>
          <span className="font-mono text-slate-200">{metrics.baseArea.toFixed(2)} j²</span>
        </div>
        <div className="flex justify-between">
          <span>Pole boczne (Pb):</span>
          <span className="font-mono text-slate-200">{metrics.lateralArea.toFixed(2)} j²</span>
        </div>
        <div className="flex justify-between">
          <span>Pole całkowite (Pc):</span>
          <span className="font-mono text-slate-200">{metrics.totalArea.toFixed(2)} j²</span>
        </div>
        <div className="flex justify-between">
          <span>Objętość (V):</span>
          <span className="font-mono text-slate-200 font-semibold">{metrics.volume.toFixed(2)} j³</span>
        </div>
      </div>
    </div>
  )
}
