import { useRef, useEffect } from 'react'
import useRawWs from './useRawWs'

export default function useJsonWs(url, callback) {
  const savedCallback = useRef()

  useEffect(() => {
    savedCallback.current = callback
  })

  return useRawWs(url, {
    message: e => callback(JSON.parse(e.data))
  })
}
