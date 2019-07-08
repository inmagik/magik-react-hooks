import { useMemo, useCallback } from 'react'
import qs from 'query-string'
import useRouter from './useRouter'

export default function useQueryParams() {
  const { location, history } = useRouter()

  const queryParams = useMemo(() => qs.parse(location.search), [location.search])

  const setQueryParams = useCallback((newQueryParams, historyMethod = 'push') => {
    const currentQueryParams = qs.parse(location.search)
    const url = `${location.pathname}?${qs.stringify({
      ...currentQueryParams,
      ...newQueryParams
    })}`
    history[historyMethod](url)
  }, [location, history])

  return [queryParams, setQueryParams]
}
