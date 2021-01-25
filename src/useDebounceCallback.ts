import { useCallback, useEffect, useRef } from 'react'

export default function useDebounceCallback(
  cb: (...args: any[]) => void,
  delay = 0,
  args: any[] = []
) {
  const lastTimeoutId = useRef<ReturnType<typeof setTimeout>>()
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  const memoCb = useCallback(cb, args)

  const callback = useCallback(
    (...params) => {
      if (lastTimeoutId.current) {
        clearTimeout(lastTimeoutId.current)
      }
      lastTimeoutId.current = setTimeout(() => {
        if (mounted.current) {
          memoCb(...params)
        }
      }, delay)
    },
    [memoCb, delay]
  )

  return callback
}
