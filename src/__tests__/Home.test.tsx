import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Home from '@/app/page'

describe('Home Page', () => {
  it('renders the hero heading', () => {
    render(<Home />)
    const heading = screen.getByRole('heading', { name: /track issues/i })
    expect(heading).toBeInTheDocument()
  })

  it('contains a Get Started link', () => {
    render(<Home />)
    const link = screen.getByRole('link', { name: /get started/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/login')
  })
})
