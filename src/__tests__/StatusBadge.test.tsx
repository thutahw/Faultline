import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import StatusBadge from '@/components/StatusBadge'

describe('StatusBadge', () => {
  it('renders the status text', () => {
    render(<StatusBadge status="open" />)
    expect(screen.getByText(/open/i)).toBeInTheDocument()
  })

  it('replaces underscores with spaces', () => {
    render(<StatusBadge status="in_progress" />)
    expect(screen.getByText(/in progress/i)).toBeInTheDocument()
  })

  it('applies the correct classes for open status', () => {
    render(<StatusBadge status="open" />)
    const badge = screen.getByText(/open/i)
    expect(badge).toHaveClass('bg-green-100')
    expect(badge).toHaveClass('text-green-700')
  })

  it('applies the correct classes for in_progress status', () => {
    render(<StatusBadge status="in_progress" />)
    const badge = screen.getByText(/in progress/i)
    expect(badge).toHaveClass('bg-blue-100')
    expect(badge).toHaveClass('text-blue-700')
  })
})
