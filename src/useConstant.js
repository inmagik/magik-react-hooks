import { useRef } from 'react'
import { getOrInvoke } from './utils'

// Credits to @Andarist
// https://github.com/Andarist/use-constant
export function useConstant(valueOrFactory) {
  const ref = useRef()

  if (!ref.current) {
    ref.current = { v: getOrInvoke(valueOrFactory) }
  }

  return ref.current.v
}
