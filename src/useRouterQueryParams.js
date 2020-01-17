import { useCallback } from 'react'
import useRouter from './useRouter'
import useQueryParams from './useQueryParams'

export default function useRouterQueryParams(qpEncoder = false, options = {}) {
  const { location, history } = useRouter()

  const setSearchStr = useCallback((nextQueryString, historyMethod = 'push') => {
    /*
     * WARNING: do not be tempted to direcly use "location" from outer scope here,
     * since it changes at every render. This may cause an infinite render loop.
     */
    const url = `${history.location.pathname}?${nextQueryString}`
    history[historyMethod](url)
  }, [history])

  const proxied = useQueryParams(location.search, setSearchStr, qpEncoder, options)

  return proxied
}