import memoizeOne from 'memoize-one'

const identity = arg => arg

const makeEncDecFromFn = fn => ({
  encode: memoizeOne(data => fn(undefined, data)),
  decode: memoizeOne(str => fn(str, undefined))
})

const makeEncDecFromObj = obj => ({
  encode: obj.encode ? memoizeOne(obj.encode) : identity,
  decode: obj.decode ? memoizeOne(obj.decode) : identity
})

export const makeEncDec = arg => {
  if (typeof arg === 'function') {
    return makeEncDecFromFn(arg)
  }
  else if (typeof arg === 'object') {
    const qp = {}
    const { encode, decode, ...others } = arg
    const global = makeEncDecFromObj(arg)
    const memoized = {}
    for (let k in others) {
      if (typeof others[k] === 'function') {
        memoized[k] = makeEncDecFromFn(others[k])
      }
      else if (typeof others[k] === 'object') {
        memoized[k] = makeEncDecFromObj(others[k])
      }
    }
    qp.encode = memoizeOne(data => {
      const out = global.encode(data)
      for (let k in memoized) {
        out[k] = memoized[k].encode(data[k])
      }
      return out
    })
    qp.decode = memoizeOne(data => {
      const out = global.decode(data)
      for (let k in memoized) {
        out[k] = memoized[k].decode(data[k])
      }
      return out
    })
    return qp
  } else {
    return {
      encode: arg => arg,
      decode: arg => arg
    }
  }
}