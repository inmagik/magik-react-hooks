import { useCallback } from "react"
import useRouter from "./useRouter"
import useQueryParam from "./useQueryParam"

export default function useRouterQueryParam(name, defaultValue, qpEncoder = false, options = {}) {
  const { location, history } = useRouter()

  const setSearchStr = useCallback((nextQueryString, historyMethod = 'push') => {
    /*
     * WARNING: do not be tempted to direcly use "location" from outer scope here,
     * since it changes at every render. This may cause an infinite render loop.
     */
    const url = `${history.location.pathname}?${nextQueryString}`
    history[historyMethod](url)
  }, [history])

  const proxied = useQueryParam(location.search, setSearchStr, name, defaultValue, qpEncoder, options)

  return proxied
}