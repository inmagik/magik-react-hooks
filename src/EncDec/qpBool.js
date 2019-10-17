export const qpBool = (trueValue = "1", falseValue = "0") => {
  const repr = [`${falseValue}`, `${trueValue}`]
  return {
    encode: data => data !== undefined && data !== null ? repr[!!data ? 1 : 0] : undefined,
    decode: str => {
      if (str !== undefined) {
        if (`${str}`.toLowerCase() === repr[1]) {
          return true
        }
        else if (`${str}`.toLowerCase() === repr[0]) {
          return false
        }
        else {
          return undefined
        }
      } else {
        return undefined
      }
    }
  }
}