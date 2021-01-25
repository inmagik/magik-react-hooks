import { ParamEncDec, ParamEncDecObj } from './encdec'

export const qpList = () : ParamEncDec<any[], any[]> => ({
  encode: (a) => a,
  decode: (a) => {
    if (a === undefined || a === null) {
      return []
    }
    return Array.isArray(a) ? a : [a]
  },
})