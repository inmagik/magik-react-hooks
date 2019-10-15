import { useCallback } from 'react'
import useRouter from './useRouter'
import useQueryParams from './useQueryParams'

export default function useRouterQueryParams(qpEncoder = false, options = {}) {
  const { location, history } = useRouter()

  const setSearchStr = useCallback((nextQueryString, historyMethod = 'push') => {
    const url = `${location.pathname}?${nextQueryString}`
    history[historyMethod](url)
  }, [location.pathname, history])

  const proxied = useQueryParams(location.search, setSearchStr, qpEncoder, options)

  return proxied
}