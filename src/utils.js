export const getOrInvoke = (maybeFn, ...args) => {
  if (typeof maybeFn === 'function') {
    return maybeFn(...args)
  } else {
    return maybeFn
  }
}
