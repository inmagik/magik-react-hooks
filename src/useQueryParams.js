import { useMemo, useCallback } from 'react'
import qs from 'query-string'
import useRouter from './useRouter'
import useConstant from './useConstant'
import { makeEncDec } from './EncDec/encdec'

export default function useQueryParams(qpEncoder = false, options = {}) {
  const { location, history } = useRouter()
  const parser = useConstant(() => makeEncDec(qpEncoder))

  const queryParams = useMemo(() => parser.decode(qs.parse(location.search)), [location.search, parser])

  const setQueryParams = useCallback((newQueryParams, historyMethod = 'push') => {
    const currentQueryParams = qs.parse(location.search)
    const queryString = qs.stringify(parser.encode({
      ...currentQueryParams,
      ...newQueryParams
    }), options)
    const url = `${location.pathname}?${queryString}`
    history[historyMethod](url)
  }, [location.search, location.pathname, parser, options, history])

  return [queryParams, setQueryParams]
}
