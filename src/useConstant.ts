import { useRef } from 'react'
import { getOrInvoke } from './utils'

// Credits to @Andarist
// https://github.com/Andarist/use-constant
export default function useConstant<T>(valueOrFactory: T | (() => T)): T {
  const ref = useRef<{ v: T }>()

  if (!ref.current) {
    ref.current = { v: getOrInvoke(valueOrFactory) }
  }

  return ref.current.v
}
