import { useMemo, useCallback, useRef } from 'react'
import qs from 'query-string'
import useRouter from './useRouter'
import memoizeOne from 'memoize-one'
import useConstant from './useConstant'

const makeEncDecFromFn = fn => ({
  encode: memoizeOne(data => fn(undefined, data)),
  decode: memoizeOne(str => fn(str, undefined))
})

const makeQP = arg => {
  if (typeof arg === 'function') {
    return makeEncDecFromFn(arg)
  }
  else if (typeof arg === 'object') {
    const qp = {}
    const { encode, decode, ...others } = arg
    const memoized = {}
    for (let k in others) {
      if (typeof others[k] === 'function') memoized[k] = memoizeOne(others[k])
      else if (typeof others[k] === 'object') {
        const out = {}
        const { encode, decode, ...props } = others[k]
        if (typeof encode === 'function')
          out.encode = memoizeOne(encode)
        else
          out.encode = encode
        if (typeof decode === 'function')
          out.decode = memoizeOne(decode)
        else
          out.decode = decode
        memoized[k] = { ...props, ...out }
      }
    }
    qp.encode = memoizeOne(data => {
      const out = {}
      for (let k in data) {
        if (memoized[k]) {
          if (typeof memoized[k] === 'function') {
            out[k] = memoized[k](undefined, data[k])
          }
          else if (typeof memoized[k] === 'object' && memoized[k].encode) {
            out[k] = memoized[k].encode(data[k])
          }
          else {
            out[k] = data[k]
          }
        }
        else if (encode) {
          out[k] = encode(data[k])
        }
        else {
          out[k] = data[k]
        }
      }
      return out
    })
    qp.decode = memoizeOne(data => {
      const out = {}
      for (let k in data) {
        if (memoized[k]) {
          if (typeof memoized[k] === 'function') {
            out[k] = memoized[k](data[k], undefined)
          }
          else if (typeof memoized[k] === 'object' && memoized[k].decode) {
            out[k] = memoized[k].decode(data[k])
          }
          else {
            out[k] = data[k]
          }
        } 
        else if (decode) {
          out[k] = decode(data[k])
        }
        else {
          out[k] = data[k]
        }
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

class DefaultDateLibrary {
  constructor(arg) {
    if (arg instanceof Date)
      this.date = arg
    else
      this.date = new Date(arg)
  }

  format() {
    return this.date.toISOString()
  }

  toDate() {
    console.log('decoding')
    return this.date
  }
}

const DefaultDateLibraryEntry = arg => {
  return new DefaultDateLibrary(arg)
}

export const qpDate = (dateLibrary = DefaultDateLibraryEntry, format = 'YYYY-MM-DD HH:mm') => ({
  encode: data => dateLibrary(data).format(format),
  decode: data => dateLibrary(data).toDate()
})

export const qpInt = (radix = 10) => (fromQs, toQs) => (fromQs && parseInt(fromQs, radix)) || (toQs && toQs.toString(radix)) || undefined

export const qpFloat = () => (fromQs, toQs) => (fromQs && parseFloat(fromQs)) || (toQs && toQs.toString()) || undefined

export default function useQueryParams(qpEncoder = {}, options = {}) {
  const { location, history } = useRouter()
  const parser = useConstant(() => makeQP(qpEncoder))

  const queryParams = useMemo(() => parser.decode(qs.parse(location.search)), [location.search])

  const setQueryParams = useCallback((newQueryParams, historyMethod = 'push') => {
    const currentQueryParams = qs.parse(location.search)
    const queryString = qs.stringify(parser.encode({
      ...currentQueryParams,
      ...newQueryParams
    }), options)
    const url = `${location.pathname}?${queryString}`
    history[historyMethod](url)
  }, [location, history])

  return [queryParams, setQueryParams]
}
