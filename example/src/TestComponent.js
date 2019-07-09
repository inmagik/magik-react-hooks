import React from 'react'
import useQueryParams, { qpDate } from '@inmagik/magik-react-hooks/useQueryParams';
import { qpInt } from '../../src/useQueryParams';

const TestComponent = () => {
  const [params, setParams] = useQueryParams({
    hex: {
      encode: num => num.toString(16),
      decode: str => parseInt(str, 16) || undefined
    },
    bin: (fromQs, toQs) => (fromQs && parseInt(fromQs, 2)) || (toQs && toQs.toString(2)) || undefined,
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
