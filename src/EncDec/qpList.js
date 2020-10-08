export const qpList = () => ({
  encode: (a) => a,
  decode: (a) => {
    if (a === undefined || a === null) {
      return []
    }
    return Array.isArray(a) ? a : [a]
  },
})