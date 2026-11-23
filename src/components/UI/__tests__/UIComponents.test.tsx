import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Header from '../Header'
import PrismSelector from '../PrismSelector'
import FoldSlider from '../FoldSlider'
import ViewSettings from '../ViewSettings'
import PrismInfo from '../PrismInfo'
import { getPrismConfig } from '../../../math/prismConfigs'

describe('UI Components', () => {
  it('renders Header with title and help modal toggle', () => {
    render(<Header />)
    expect(screen.getByText(/Wizualizator Siatek Graniastosłupów/i)).toBeInTheDocument()

    const helpBtn = screen.getByRole('button', { name: /pomoc/i })
    expect(helpBtn).toBeInTheDocument()

    // Open help modal
    fireEvent.click(helpBtn)
    expect(screen.getByText(/Skróty klawiszowe/i)).toBeInTheDocument()

    // Close help modal
    const closeBtn = screen.getByRole('button', { name: /zamknij/i })
    fireEvent.click(closeBtn)
    expect(screen.queryByText(/Skróty klawiszowe/i)).not.toBeInTheDocument()
  })

  it('renders Header with resetCamera and openDrawer handlers', () => {
    const onResetCamera = vi.fn()
    const onOpenDrawer = vi.fn()
    render(<Header onResetCamera={onResetCamera} onOpenDrawer={onOpenDrawer} />)

    const resetBtn = screen.getByRole('button', { name: /reset widoku kamery/i })
    fireEvent.click(resetBtn)
    expect(onResetCamera).toHaveBeenCalledTimes(1)

    const drawerBtn = screen.getByRole('button', { name: /otwórz panel opcji/i })
    fireEvent.click(drawerBtn)
    expect(onOpenDrawer).toHaveBeenCalledTimes(1)
  })

  it('renders PrismSelector and handles selection', () => {
    const onSelect = vi.fn()
    render(<PrismSelector activeType="square" onSelect={onSelect} />)

    expect(screen.getByText(/trójkątny/i)).toBeInTheDocument()
    expect(screen.getByText(/czworokątny/i)).toBeInTheDocument()
    expect(screen.getByText(/pięciokątny/i)).toBeInTheDocument()
    expect(screen.getByText(/sześciokątny/i)).toBeInTheDocument()

    fireEvent.click(screen.getByText(/trójkątny/i))
    expect(onSelect).toHaveBeenCalledWith('triangular')
  })

  it('renders FoldSlider with controls, percentage, and triggers events', () => {
    const onFoldChange = vi.fn()
    const onTogglePlay = vi.fn()
    const onFold = vi.fn()
    const onUnfold = vi.fn()
    const onSpeedChange = vi.fn()

    render(
      <FoldSlider
        foldProgress={0.42}
        onFoldProgressChange={onFoldChange}
        isPlaying={false}
        onTogglePlay={onTogglePlay}
        onFold={onFold}
        onUnfold={onUnfold}
        speed={1}
        onSpeedChange={onSpeedChange}
      />
    )

    // Percentage display
    expect(screen.getByText('42%')).toBeInTheDocument()

    // Play button
    const playBtn = screen.getByRole('button', { name: /odtwarzaj/i })
    fireEvent.click(playBtn)
    expect(onTogglePlay).toHaveBeenCalledTimes(1)

    // Unfold / Fold buttons
    const unfoldBtn = screen.getByRole('button', { name: /rozłóż/i })
    fireEvent.click(unfoldBtn)
    expect(onUnfold).toHaveBeenCalledTimes(1)

    const foldBtn = screen.getByRole('button', { name: /^złóż$/i })
    fireEvent.click(foldBtn)
    expect(onFold).toHaveBeenCalledTimes(1)

    // Slider change
    const slider = screen.getByRole('slider')
    fireEvent.change(slider, { target: { value: '75' } })
    expect(onFoldChange).toHaveBeenCalledWith(0.75)
  })

  it('renders FoldSlider with onOpenDrawer and speed cycler', () => {
    const onOpenDrawer = vi.fn()
    const onSpeedChange = vi.fn()

    render(
      <FoldSlider
        foldProgress={0.5}
        onFoldProgressChange={vi.fn()}
        isPlaying={true}
        onTogglePlay={vi.fn()}
        onFold={vi.fn()}
        onUnfold={vi.fn()}
        speed={1}
        onSpeedChange={onSpeedChange}
        onOpenDrawer={onOpenDrawer}
      />
    )

    const optionsBtn = screen.getByRole('button', { name: /opcje i wybór bryły/i })
    fireEvent.click(optionsBtn)
    expect(onOpenDrawer).toHaveBeenCalledTimes(1)

    const speedButtons = screen.getAllByRole('button', { name: /prędkość animacji 1x/i })
    expect(speedButtons.length).toBeGreaterThan(0)
    fireEvent.click(speedButtons[0])
    expect(onSpeedChange).toHaveBeenCalledWith(2.0)
  })

  it('renders ViewSettings and triggers toggles and camera reset', () => {
    const onToggleWireframe = vi.fn()
    const onToggleColorBases = vi.fn()
    const onToggleLabels = vi.fn()
    const onToggleResetFoldOnSwitch = vi.fn()
    const onResetCamera = vi.fn()

    render(
      <ViewSettings
        settings={{ wireframe: true, colorBases: true, showLabels: false, resetFoldOnSwitch: false }}
        onToggleWireframe={onToggleWireframe}
        onToggleColorBases={onToggleColorBases}
        onToggleLabels={onToggleLabels}
        onToggleResetFoldOnSwitch={onToggleResetFoldOnSwitch}
        onResetCamera={onResetCamera}
      />
    )

    const resetBtn = screen.getByRole('button', { name: /resetuj widok/i })
    fireEvent.click(resetBtn)
    expect(onResetCamera).toHaveBeenCalledTimes(1)

    const wireframeCheckbox = screen.getByLabelText(/pokaż krawędzie/i)
    fireEvent.click(wireframeCheckbox)
    expect(onToggleWireframe).toHaveBeenCalledTimes(1)

    const resetFoldCheckbox = screen.getByLabelText(/resetuj kąt przy zmianie bryły/i)
    fireEvent.click(resetFoldCheckbox)
    expect(onToggleResetFoldOnSwitch).toHaveBeenCalledTimes(1)
  })

  it('renders PrismInfo with geometric metrics and Euler characteristics', () => {
    const config = getPrismConfig('square')
    render(<PrismInfo config={config} />)

    expect(screen.getByText(/Graniastosłup czworokątny/i)).toBeInTheDocument()
    expect(screen.getByText(/Wierzchołki \(V\):/i)).toBeInTheDocument()
    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText(/Krawędzie \(E\):/i)).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText(/Ściany \(F\):/i)).toBeInTheDocument()
    expect(screen.getByText('6')).toBeInTheDocument()
    expect(screen.getByText(/Wzór Eulera: 8 - 12 \+ 6 = 2/i)).toBeInTheDocument()
  })
})
