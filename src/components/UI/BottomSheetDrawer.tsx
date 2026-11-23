import React, { useState, useEffect } from 'react'
import { PrismType, PrismConfig, ViewSettingsState } from '../../types/prism'
import PrismSelector from './PrismSelector'
import PrismInfo from './PrismInfo'
import ViewSettings from './ViewSettings'
import { Shapes, Info, Sliders, X } from 'lucide-react'

export interface BottomSheetDrawerProps {
  isOpen: boolean
  onClose: () => void
  prismType: PrismType
  onSelectPrismType: (type: PrismType) => void
  currentConfig: PrismConfig
  viewSettings: ViewSettingsState
  onToggleWireframe: () => void
  onToggleColorBases: () => void
  onToggleLabels: () => void
  onToggleResetFoldOnSwitch?: () => void
  onResetCamera: () => void
  defaultTab?: 'shapes' | 'info' | 'settings'
}

type TabType = 'shapes' | 'info' | 'settings'

export default function BottomSheetDrawer({
  isOpen,
  onClose,
  prismType,
  onSelectPrismType,
  currentConfig,
  viewSettings,
  onToggleWireframe,
  onToggleColorBases,
  onToggleLabels,
  onToggleResetFoldOnSwitch,
  onResetCamera,
  defaultTab = 'shapes',
}: BottomSheetDrawerProps): React.ReactElement | null {
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab)

  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab)
    }
  }, [isOpen, defaultTab])

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Panel opcji i parametrów"
      className="fixed inset-0 z-50 flex flex-col justify-end pointer-events-auto"
    >
      {/* Backdrop */}
      <div
        data-testid="drawer-backdrop"
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in"
      />

      {/* Sheet Container */}
      <div className="relative z-10 w-full max-h-[80vh] flex flex-col bg-slate-900/95 border-t border-slate-700/80 rounded-t-3xl shadow-2xl backdrop-blur-xl transition-transform animate-in slide-in-from-bottom duration-300 safe-pb">
        {/* Top Handle Bar */}
        <div className="flex items-center justify-between px-5 pt-3 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-slate-700 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-2" />
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider mt-1">
              Opcje i parametry
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Zamknij arkusz"
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div
          role="tablist"
          className="grid grid-cols-3 gap-1 px-4 py-2 border-b border-slate-800/80 bg-slate-950/40"
        >
          <button
            role="tab"
            aria-selected={activeTab === 'shapes'}
            onClick={() => setActiveTab('shapes')}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'shapes'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Shapes className="w-4 h-4" />
            <span>Bryła</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'info'}
            onClick={() => setActiveTab('info')}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'info'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>Parametry</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'settings'}
            onClick={() => setActiveTab('settings')}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'settings'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Widok</span>
          </button>
        </div>

        {/* Tab Content Panels (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(75vh-8rem)]">
          {activeTab === 'shapes' && (
            <div className="animate-fade-in">
              <PrismSelector
                activeType={prismType}
                onSelect={(type) => {
                  onSelectPrismType(type)
                }}
              />
            </div>
          )}

          {activeTab === 'info' && (
            <div className="animate-fade-in">
              <PrismInfo config={currentConfig} />
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="animate-fade-in">
              <ViewSettings
                settings={viewSettings}
                onToggleWireframe={onToggleWireframe}
                onToggleColorBases={onToggleColorBases}
                onToggleLabels={onToggleLabels}
                onToggleResetFoldOnSwitch={onToggleResetFoldOnSwitch}
                onResetCamera={onResetCamera}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
