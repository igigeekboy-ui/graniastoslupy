import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../App'

// Mock 3D SceneContainer since jsdom does not implement WebGL context
vi.mock('../components/3D/SceneContainer', () => ({
  default: ({ config, foldProgress }: { config: { name: string }; foldProgress: number }) => (
    <div data-testid="mock-3d-scene">
      <span>{config.name}</span>
      <span>Progress: {foldProgress}</span>
    </div>
  ),
}))

describe('App Integration', () => {
  it('renders the complete application layout and controls', () => {
    render(<App />)

    // Header
    expect(screen.getByText(/Wizualizator Siatek Graniastosłupów/i)).toBeInTheDocument()

    // 3D Canvas Mock
    expect(screen.getByTestId('mock-3d-scene')).toBeInTheDocument()

    // Prism selector button
    expect(screen.getByRole('button', { name: /czworokątny/i })).toBeInTheDocument()

    // Info panel
    expect(screen.getByText(/Informacje o bryle/i)).toBeInTheDocument()
    expect(screen.getByText(/Wzór Eulera/i)).toBeInTheDocument()

    // Slider
    expect(screen.getByRole('slider')).toBeInTheDocument()
  })

  it('switches prisms dynamically and updates scene and info', () => {
    render(<App />)

    // Initially square
    expect(screen.getByRole('button', { name: /czworokątny/i })).toBeInTheDocument()

    // Switch to hexagonal
    const hexBtn = screen.getByRole('button', { name: /sześciokątny/i })
    fireEvent.click(hexBtn)

    expect(screen.getAllByText(/Graniastosłup sześciokątny/i).length).toBeGreaterThan(0)
    expect(screen.getByText('12')).toBeInTheDocument() // 12 vertices
    expect(screen.getByText('18')).toBeInTheDocument() // 18 edges
    expect(screen.getByText('8')).toBeInTheDocument()  // 8 faces
  })

  it('toggles mobile sidebar visibility with mobile toggle button', () => {
    render(<App />)

    const toggleBtn = screen.getByRole('button', { name: /ukryj panel opcji/i })
    expect(toggleBtn).toBeInTheDocument()

    // Click to hide
    fireEvent.click(toggleBtn)
    expect(screen.getByRole('button', { name: /pokaż panel opcji/i })).toBeInTheDocument()

    // Click to open again
    fireEvent.click(screen.getByRole('button', { name: /pokaż panel opcji/i }))
    expect(screen.getByRole('button', { name: /ukryj panel opcji/i })).toBeInTheDocument()
  })
})
