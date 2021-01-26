import React, { useEffect } from 'react'
import { qpDate, qpInt, qpNullable, qpBool } from 'magik-react-hooks/qpUtils'
import useDebounceQueryParams from 'magik-react-hooks/useRouterDebounceQueryParams';

const TestComponent = () => {
  const [params, setParams, debParams, setDebParams] = useDebounceQueryParams({
    decode: arg => {
      // console.log('decode called', { ...arg })
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

  console.log(params, debParams)

  const changeQs = () => {
    setParams({ b: (params.b || 0) + 1 })
  }

  const changeQsDate = () => {
    setParams({ d: new Date() })
  }

  useEffect(() => {
    setParams({ hex: 15 })
  }, [setParams])

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <pre>
          {
            JSON.stringify(params, undefined, 2)
          }
        </pre>
        <pre>
          {
            JSON.stringify(debParams, undefined, 2)
          }
        </pre>
      </div>
      <button onClick={changeQs}>Click me</button>
      <button onClick={changeQsDate}>Go to now</button>
      <button onClick={() => setParams({ b: undefined })}>Set b to undefined</button>
      <button onClick={() => setParams({ b: null })}>Set b to null</button>
      <button onClick={() => setParams({ x: true })}>Set x to true</button>
      <button onClick={() => setParams({ x: false })}>Set x to false</button>
      <button onClick={() => setParams({ x: null })}>Set x to null</button>
      <button onClick={() => setParams({ x: undefined })}>Set x to undefined</button>
      <br />
      <input type='text' value={params.search ?? ''} onChange={(e) => {
        setDebParams({ search: e.target.value, b: 1 })
      }} />
    </div>
  )
}

export default TestComponent
