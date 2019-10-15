import { useMemo, useCallback } from 'react'
import qs from 'query-string'
import useConstant from './useConstant'
import { makeEncDec } from './EncDec/encdec'


export default function useQueryParam(queryString, setQueryString, name, defaultValue, qpEncoder = false, options = {}) {
  const parser = useConstant(() => makeEncDec(qpEncoder))

  const [param, queryParams] = useMemo(() => {
    const allParams = qs.parse(queryString)
    if (allParams[name]) {
      return [parser.decode(allParams[name]), allParams]
    } else {
      return [defaultValue, allParams]
    }
  }, [defaultValue, name, parser, queryString])

  const setQueryParams = useCallback((nextValue, ...args) => {
    const currentQueryParams = queryParams
    const queryString = qs.stringify({
      ...currentQueryParams,
      [name]: parser.encode(nextValue)
    }, options)
    setQueryString(queryString, ...args)
  }, [queryParams, name, parser, options, setQueryString])

  return [param, setQueryParams]
}