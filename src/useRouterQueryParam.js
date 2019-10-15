import { useCallback } from "react"
import useRouter from "./useRouter"
import useQueryParam from "./useQueryParam"

export default function useRouterQueryParam(name, defaultValue, qpEncoder = false, options = {}) {
  const { location, history } = useRouter()

  const setSearchStr = useCallback((nextQueryString, historyMethod = 'push') => {
    const url = `${location.pathname}?${nextQueryString}`
    history[historyMethod](url)
  }, [location.pathname, history])

  const proxied = useQueryParam(location.search, setSearchStr, name, defaultValue, qpEncoder, options)

  return proxied
}