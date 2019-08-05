import React from 'react'
import useQueryParams from '@inmagik/magik-react-hooks/useQueryParams';
import { qpDate, qpInt } from '@inmagik/magik-react-hooks/qpUtils'

const TestComponent = () => {
  const [params, setParams] = useQueryParams({
    decode: arg => {
      console.log('decode called', { ...arg })
      return arg
    },
    hex: {
      encode: num => num.toString(16),
      decode: str => parseInt(str, 16) || 0
    },
    bin: (fromQs, toQs) => (fromQs && parseInt(fromQs, 2)) || (toQs && toQs.toString(2)) || 0,
    b: qpInt(),
    d: qpDate()
  }, { encode: false })

  console.log(params)

  const changeQs = () => {
    setParams({ b: params.b + 1 })
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
    </div>
  )
}

export default TestComponent
