import React from 'react'
import useRouterQueryParams from '@inmagik/magik-react-hooks/useRouterQueryParams';
import { qpDate, qpInt, qpNullable, qpBool } from '@inmagik/magik-react-hooks/qpUtils'

const TestComponent = () => {
  const [params, setParams] = useRouterQueryParams({
    decode: arg => {
      console.log('decode called', { ...arg })
      return arg
    },
    hex: {
      encode: num => num.toString(16),
      decode: str => parseInt(str, 16) || 0
    },
    bin: (fromQs, toQs) => (fromQs && parseInt(fromQs, 2)) || (toQs && toQs.toString(2)) || 0,
    b: qpNullable(qpInt(), "null"),
    d: qpDate(),
    x: qpNullable(qpBool("1", "0"), "U")
  }, { encode: false })

  console.log(params)

  const changeQs = () => {
    setParams({ b: (params.b || 0) + 1 })
  }

  const changeQsDate = () => {
    setParams({ d: new Date() })
  }

  return (
    <div>
      <pre>
        {
          JSON.stringify(params, undefined, 2)
        }
      </pre>
      <button onClick={changeQs}>Click me</button>
      <button onClick={changeQsDate}>Go to now</button>
      <button onClick={() => setParams({ b: undefined })}>Set b to undefined</button>
      <button onClick={() => setParams({ b: null })}>Set b to null</button>
      <button onClick={() => setParams({ x: true })}>Set x to true</button>
      <button onClick={() => setParams({ x: false })}>Set x to false</button>
      <button onClick={() => setParams({ x: null })}>Set x to null</button>
      <button onClick={() => setParams({ x: undefined })}>Set x to undefined</button>
    </div>
  )
}

export default TestComponent
