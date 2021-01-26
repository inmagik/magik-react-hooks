import { useEffect, useRef } from 'react'
import isDeepEqual from 'fast-deep-equal'

type ComparatorFn = (a: any, b: any) => boolean

export default function useMemoCompare<T>(
  obj: T,
  cmp: ComparatorFn = isDeepEqual
): T {
  const holder = useRef(obj)
  const prev = holder.current

  const stableObj = cmp(obj, prev) ? prev : obj

  useEffect(() => {
    holder.current = stableObj
  })

  return stableObj
}
