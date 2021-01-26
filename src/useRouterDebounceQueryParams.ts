import { ParsedQuery, StringifyOptions } from 'query-string'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useHistory, useLocation } from 'react-router'
import {
  ComposedParamsEncDec,
  ComposeEncDec,
  MakeEncDecFromObj,
  ParamsEncDec,
  ParamsEncDecFn,
  ParamsEncDecObj
} from './EncDec/encdec'
import useDebounceCallback from './useDebounceCallback'
import useQueryParams from './useQueryParams'

type Options = StringifyOptions & { delay?: number }

type HistoryMethods = 'push' | 'replace'

function stripQuestionMark(search: string): string {
  if (search.startsWith('?')) {
    return search.slice(1)
  }
  return search
}

function useRouterDebounceQueryParams(): [
  ParsedQuery,
  (
    q: Record<string, any> | ((q: Record<string, any>) => Record<string, any>),
    ...args: any[]
  ) => void,
  ParsedQuery,
  (
    q: Record<string, any> | ((q: Record<string, any>) => Record<string, any>),
    ...args: any[]
  ) => void
]

function useRouterDebounceQueryParams<T>(
  qpEncode?: ParamsEncDecFn<T>,
  options?: StringifyOptions
): [
  T,
  (value: Partial<T> | ((e: T) => T), ...args: any[]) => void,
  T,
  (value: Partial<T> | ((e: T) => T), ...args: any[]) => void
]

function useRouterDebounceQueryParams<T extends ParamsEncDecObj>(
  qpEncoder: T,
  options?: Options
): MakeEncDecFromObj<T> extends ParamsEncDec<infer O, infer I>
  ? [
      O,
      (value: Partial<I> | ((e: O) => I), ...args: any[]) => void,
      O,
      (value: Partial<I> | ((e: O) => I), ...args: any[]) => void
    ]
  : never

function useRouterDebounceQueryParams<T extends ComposedParamsEncDec>(
  qpEncoder: T,
  options?: Options
): ComposeEncDec<T> extends ParamsEncDec<infer O, infer I>
  ? [
      O & ParsedQuery,
      (
        value:
          | Partial<I & Record<string, any>>
          | ((e: O & ParsedQuery) => I & Record<string, any>),
        ...args: any[]
      ) => void,
      O & ParsedQuery,
      (
        value:
          | Partial<I & Record<string, any>>
          | ((e: O & ParsedQuery) => I & Record<string, any>),
        ...args: any[]
      ) => void
    ]
  : never

function useRouterDebounceQueryParams(
  qpEncoder?: ParamsEncDecObj | ParamsEncDecFn | ComposedParamsEncDec,
  options?: Options
): [
  Record<string, any>,
  (
    q: Record<string, any> | ((q: Record<string, any>) => Record<string, any>),
    ...args: any[]
  ) => void,
  Record<string, any>,
  (
    q: Record<string, any> | ((q: Record<string, any>) => Record<string, any>),
    ...args: any[]
  ) => void
]

function useRouterDebounceQueryParams(
  qpEncoder?: ParamsEncDecObj | ParamsEncDecFn | ComposedParamsEncDec,
  options: Options = {}
): [
  Record<string, any>,
  (
    q: Record<string, any> | ((q: Record<string, any>) => Record<string, any>),
    ...args: any[]
  ) => void,
  Record<string, any>,
  (
    q: Record<string, any> | ((q: Record<string, any>) => Record<string, any>),
    ...args: any[]
  ) => void
] {
  const location = useLocation()
  const history = useHistory()
  const { delay = 200, ...passOptions } = options

  const [queryString, setQueryString] = useState(location.search)

  const setSearchStr = useCallback(
    (nextQueryString, historyMethod: HistoryMethods = 'push') => {
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

export default useRouterDebounceQueryParams
