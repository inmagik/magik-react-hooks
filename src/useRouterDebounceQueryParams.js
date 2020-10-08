import { useCallback, useEffect, useRef, useState } from 'react'
import { useHistory, useLocation } from 'react-router'
import useDebounceCallback from './useDebounceCallback'
import useQueryParams from './useQueryParams'

function stripQuestionMark(search) {
  if (search.startsWith('?')) {
    return search.slice(1)
  }
  return search
}

export default function useRouterDebounceQueryParams(
  qpEncoder = false,
  options = {}
) {
  const location = useLocation()
  const history = useHistory()
  const { delay = 200, ...passOptions } = options

  const [queryString, setQueryString] = useState(location.search)

  const setSearchStr = useCallback(
    (nextQueryString, historyMethod = 'push') => {
      /*
       * WARNING: do not be tempted to direcly use "location" from outer scope here,
       * since it changes at every render. This may cause an infinite render loop.
       */
      const url = `${history.location.pathname}?${nextQueryString}`
      setQueryString(nextQueryString)
      history[historyMethod](url)
    },
    [history]
  )

  const [debQueryParams, setLocalDebQueryParams] = useQueryParams(
    location.search,
    setSearchStr,
    qpEncoder,
    passOptions
  )

  const [queryParams, setQueryParams] = useQueryParams(
    queryString,
    setQueryString,
    qpEncoder,
    passOptions
  )

  const prevKey = useRef(location.key)
  useEffect(() => {
    if (
      prevKey.current !== location.key &&
      stripQuestionMark(queryString) !== stripQuestionMark(location.search)
    ) {
      setQueryString(location.search)
    }
    prevKey.current = location.key
  }, [location.key, location.search, queryString])

  const setDebQueryParams = useDebounceCallback(
    nextQueryParams => {
      setLocalDebQueryParams(nextQueryParams)
    },
    delay,
    []
  )

  const setDebQueryState = useCallback(
    nextQueryParams => {
      setQueryParams(nextQueryParams)
      setDebQueryParams(nextQueryParams)
    },
    [setDebQueryParams, setQueryParams]
  )

  return [queryParams, setLocalDebQueryParams, debQueryParams, setDebQueryState]
}
