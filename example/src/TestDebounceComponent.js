import React, { useState } from 'react'
import useDebounce from '../../src/useDebounce'

export default function TestDebounceComponent() {
  const [text, setText] = useState('')
  const debouncedText = useDebounce(text, 200)

  console.log('Text', text)
  console.log('Debounced Text', debouncedText)

  return (
    <div>
      <input type='text' value={text} onChange={e => setText(e.target.value)} />
      <div>
        <div>TEXT: {text}</div>
        <div>TEXT DEBOUNCED: {debouncedText}</div>
      </div>
    </div>
  )
}