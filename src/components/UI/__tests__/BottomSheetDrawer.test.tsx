import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import BottomSheetDrawer from '../BottomSheetDrawer'
import { getPrismConfig } from '../../../math/prismConfigs'

describe('BottomSheetDrawer Component', () => {
  const config = getPrismConfig('square')
  const defaultSettings = {
    wireframe: true,
    colorBases: true,
    showLabels: true,
    resetFoldOnSwitch: false,
  }

  it('does not render content when isOpen is false', () => {
    const onClose = vi.fn()
    const onSelect = vi.fn()
    const { container } = render(
      <BottomSheetDrawer
        isOpen={false}
        onClose={onClose}
        prismType="square"
        onSelectPrismType={onSelect}
        currentConfig={config}
        viewSettings={defaultSettings}
        onToggleWireframe={vi.fn()}
        onToggleColorBases={vi.fn()}
        onToggleLabels={vi.fn()}
        onResetCamera={vi.fn()}
      />
    )
    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument()
  })

  it('renders drawer with 3 tabs when isOpen is true', () => {
    const onClose = vi.fn()
    const onSelect = vi.fn()
    render(
      <BottomSheetDrawer
        isOpen={true}
        onClose={onClose}
        prismType="square"
        onSelectPrismType={onSelect}
        currentConfig={config}
        viewSettings={defaultSettings}
        onToggleWireframe={vi.fn()}
        onToggleColorBases={vi.fn()}
        onToggleLabels={vi.fn()}
        onResetCamera={vi.fn()}
      />
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /bryła/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /parametry/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /widok/i })).toBeInTheDocument()

    // Default tab is 'shapes', should show prism selector buttons
    expect(screen.getByText(/trójkątny/i)).toBeInTheDocument()
    expect(screen.getByText(/czworokątny/i)).toBeInTheDocument()
  })

  it('switches tabs and displays corresponding content', () => {
    render(
      <BottomSheetDrawer
        isOpen={true}
        onClose={vi.fn()}
        prismType="square"
        onSelectPrismType={vi.fn()}
        currentConfig={config}
        viewSettings={defaultSettings}
        onToggleWireframe={vi.fn()}
        onToggleColorBases={vi.fn()}
        onToggleLabels={vi.fn()}
        onResetCamera={vi.fn()}
      />
    )

    // Switch to 'Parametry' tab
    const paramTab = screen.getByRole('tab', { name: /parametry/i })
    fireEvent.click(paramTab)
    expect(screen.getByText(/Wzór Eulera/i)).toBeInTheDocument()

    // Switch to 'Widok' tab
    const viewTab = screen.getByRole('tab', { name: /widok/i })
    fireEvent.click(viewTab)
    expect(screen.getByLabelText(/pokaż krawędzie/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /resetuj widok/i })).toBeInTheDocument()
  })

  it('calls onClose when close button or backdrop is clicked', () => {
    const onClose = vi.fn()
    render(
      <BottomSheetDrawer
        isOpen={true}
        onClose={onClose}
        prismType="square"
        onSelectPrismType={vi.fn()}
        currentConfig={config}
        viewSettings={defaultSettings}
        onToggleWireframe={vi.fn()}
        onToggleColorBases={vi.fn()}
        onToggleLabels={vi.fn()}
        onResetCamera={vi.fn()}
      />
    )

    const closeBtn = screen.getByRole('button', { name: /zamknij arkusz/i })
    fireEvent.click(closeBtn)
    expect(onClose).toHaveBeenCalledTimes(1)

    const backdrop = screen.getByTestId('drawer-backdrop')
    fireEvent.click(backdrop)
    expect(onClose).toHaveBeenCalledTimes(2)
  })
})
