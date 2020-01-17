import { useMemo, useCallback, useRef } from 'react'
import qs from 'query-string'
import useConstant from './useConstant'
import { makeEncDec } from './EncDec/encdec'
import useStableObject from './stableUseObject'


export default function useQueryParam(queryString, setQueryString, name, defaultValue, qpEncoder = false, options = {}) {
  const parser = useConstant(() => makeEncDec(qpEncoder))

  const opts = useStableObject(options)

  const [param, queryParams] = useMemo(() => {
    const allParams = qs.parse(queryString)
    if (allParams[name]) {
      return [parser.decode(allParams[name]), allParams]
    } else {
      return [defaultValue, allParams]
    }
  }, [defaultValue, name, parser, queryString])

  const holder = useRef(queryParams)
  if (queryParams !== holder.current) {
    holder.current = queryParams
  }

  const setQueryParams = useCallback((nextValue, ...args) => {
    const currentQueryParams = holder.current
    const queryString = qs.stringify({
      ...currentQueryParams,
      [name]: parser.encode(nextValue)
    }, opts)
    setQueryString(queryString, ...args)
  }, [name, parser, opts, setQueryString])

  return [param, setQueryParams]
}