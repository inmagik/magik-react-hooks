import { useMemo, useCallback } from 'react'
import qs from 'query-string'
import useRouter from './useRouter'
import useConstant from './useConstant'
import { makeEncDec } from './EncDec/encdec'


export default function useQueryParam(name, defaultValue, qpEncoder = false, options = {}) {
  const { location, history } = useRouter()
  const parser = useConstant(() => makeEncDec(qpEncoder))

  const queryParams = useMemo(() => {
    const allParams = qs.parse(location.search)
    if (allParams[name]) {
      return parser.decode(allParams[name])
    } else {
      return defaultValue
    }
  }, [defaultValue, location.search, name, parser])

  const setQueryParams = useCallback((nextValue, historyMethod = 'push') => {
    const currentQueryParams = qs.parse(location.search)
    const queryString = qs.stringify({
      ...currentQueryParams,
      [name]: parser.encode(nextValue)
    }, options)
    const url = `${location.pathname}?${queryString}`
    history[historyMethod](url)
  }, [location.search, location.pathname, name, parser, options, history])

  return [queryParams, setQueryParams]
}