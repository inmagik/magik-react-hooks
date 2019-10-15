 
import React, { useState } from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import useConstant from '../useConstant'

const WhatsInMyConstant = ({ valueOrFactory }) => {
  const c = useConstant(valueOrFactory)
  return (
    <div data-testid="constant-value">{c}</div>
  )
}

describe('useConstant', () => {
  it('should be sound when function is passed', () => {
    const producer = () => 1 + 2

    const App = () => (
      <WhatsInMyConstant valueOrFactory={producer} />
    )

    const { getByTestId } = render(<App />)

    expect(getByTestId("constant-value").textContent).toBe(producer().toString())
  })
  it('should be sound when value is passed', () => {
    const value = 3

    const App = () => (
      <WhatsInMyConstant valueOrFactory={value} />
    )

    const { getByTestId } = render(<App />)

    expect(getByTestId("constant-value").textContent).toBe(value.toString())
  })
  it('should not execute producer twice', () => {

    const producer = jest.fn(() => 3)

    const MyComponent = ({ producer }) => {
      const c = useConstant(producer)
      const [a, setA] = useState(0)
      return (
        <div>
          <div data-testid="constant-value">{c}</div>
          <div data-testid="action" onClick={() => setA(a + 1)} />
        </div>
      )
    }

    const { getByTestId } = render(<MyComponent producer={producer} />)

    expect(producer).toHaveBeenCalledTimes(1)
    fireEvent.click(getByTestId("action"))

    expect(producer).toHaveBeenCalledTimes(1)
    fireEvent.click(getByTestId("action"))
    fireEvent.click(getByTestId("action"))
    fireEvent.click(getByTestId("action"))
    fireEvent.click(getByTestId("action"))

    expect(producer).toHaveBeenCalledTimes(1)
  })
})