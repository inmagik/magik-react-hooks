import { renderHook, act } from '@testing-library/react-hooks'
import { useState } from 'react'
import { useMemoCompare } from '../useMemoCompare'

describe('useMemoCompare', () => {
  it('should memoize using deep object equality', () => {
    const START_VALUE : any = { name: 'Gio Va' }
    const { result } = renderHook(() => {
      const [rawValue, setRawValue] = useState(START_VALUE)
      const memoValue = useMemoCompare(rawValue)
      return { rawValue, setRawValue, memoValue }
    })

    expect(result.current.rawValue).toBe(result.current.memoValue)

    // Update to same value
    act(() => result.current.setRawValue({ name: 'Gio Va' }))
    expect(result.current.memoValue).not.toBe(result.current.rawValue)
    expect(result.current.memoValue).toBe(START_VALUE)

    // Update to different value
    const NEXT_VALUE = { name: 'Rowndo', gang: { members: ['Ice', 'Jack'] } }
    act(() => result.current.setRawValue(NEXT_VALUE))
    expect(result.current.memoValue).toBe(result.current.rawValue)
    expect(result.current.memoValue).toBe(NEXT_VALUE)

    // Next Value with deep fields
    act(() =>
      result.current.setRawValue({
        name: 'Rowndo',
        gang: { members: ['Ice', 'Jack'] }
      })
    )
    expect(result.current.memoValue).not.toBe(result.current.rawValue)
    expect(result.current.memoValue).toBe(NEXT_VALUE)
  })
})
