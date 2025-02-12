import React, { useState } from 'react'

import useConstant from 'magik-react-hooks/useConstant'
import useDebounce from 'magik-react-hooks/useDebounce'
import useMemoCompare from 'magik-react-hooks/useMemoCompare'
import usePrevious from 'magik-react-hooks/usePrevious'

const App = () => {
  const [numberState, setNumberState] = useState(0)
  const [stringState, setStringState] = useState('example')

  const constant = useConstant(stringState)
  const previous = usePrevious(stringState)
  const debounced = useDebounce(stringState, 1000)
  const memoCompared = useMemoCompare({ value: stringState })

  return (
    <div>
      <div>
        <input
          type="number"
          value={isNaN(numberState) ? '' : numberState}
          onChange={(e) => setNumberState(parseInt(e.target.value))}
        />
        <input
          type="text"
          value={stringState}
          onChange={(e) => setStringState(e.target.value)}
        />
      </div>
      <div>
        <div>Constant: {constant}</div>
        <div>Previous: {previous}</div>
        <div>Debounced: {debounced}</div>
        <div>MemoCompared: {memoCompared}</div>
      </div>
    </div>
  )
}

export default App
