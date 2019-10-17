import { useMemo, useCallback } from 'react'
import qs from 'query-string'
import useConstant from './useConstant'
import { makeEncDec } from './EncDec/encdec'

export default function useQueryParams(queryString, setQueryString, qpEncoder = false, options = {}) {
  const parser = useConstant(() => makeEncDec(qpEncoder))

  const queryParams = useMemo(() => parser.decode(qs.parse(queryString)), [queryString, parser])

  const setQueryParams = useCallback((newQueryParams, ...args) => {
    const currentQueryParams = queryParams
    const nextParams = {
      ...currentQueryParams,
      ...newQueryParams
    }
    const queryString = qs.stringify(parser.encode(nextParams), options)
    setQueryString(queryString, ...args)
  }, [queryParams, parser, options, setQueryString])

  return [queryParams, setQueryParams]
}
