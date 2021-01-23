export function getOrInvoke<T>(maybeFn: T | (() => T)): T {
  if (typeof maybeFn === 'function') {
    return (maybeFn as () => T)()
  } else {
    return maybeFn
  }
}