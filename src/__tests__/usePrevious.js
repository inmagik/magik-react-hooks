
import React, { useState } from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import usePrevious from '../usePrevious'

const WhatsInMyHook = ({ valueOrFactory }) => {
  const c = usePrevious(valueOrFactory)
  return (
    <div data-testid="hook-value">{c}</div>
  )
}

describe('usePrevious', () => {
  it('should be undefined at first pass', () => {
    const WhatsInMyHook = ({ valueOrFactory }) => {
      const c = usePrevious(valueOrFactory)
      return (
        <div data-testid="hook-value">{c === undefined ? "undefined" : "something_else"}</div>
      )
    }

    const producer = () => 1 + 2

    const App = () => (
      <WhatsInMyHook valueOrFactory={producer} />
    )

    const { getByTestId } = render(<App />)

    expect(getByTestId("hook-value").textContent).toBe("undefined")
  })
  it('should always be late', () => {
    const WhatsInMyHook = ({ valueOrFactory }) => {
      const c = usePrevious(valueOrFactory)
      return (
        <div data-testid="hook-value">{c}</div>
      )
    }

    const Wrapper = () => {
      const [x, setx] = useState(0)
      return (
        <div>
          <WhatsInMyHook valueOrFactory={x} />
          <div data-testid="action" onClick={() => setx(x + 1)} />
        </div>
      )
    }

    const { getByTestId } = render(<Wrapper />)

    fireEvent.click(getByTestId("action"))
    expect(getByTestId("hook-value").textContent).toBe("0")

    fireEvent.click(getByTestId("action"))
    expect(getByTestId("hook-value").textContent).toBe("1")

    fireEvent.click(getByTestId("action"))
    fireEvent.click(getByTestId("action"))
    fireEvent.click(getByTestId("action"))
    fireEvent.click(getByTestId("action"))
    fireEvent.click(getByTestId("action"))
    fireEvent.click(getByTestId("action"))
    expect(getByTestId("hook-value").textContent).toBe("7")
  })
})