import { ParsedQuery, StringifyOptions } from 'query-string'
import { useCallback } from 'react'
import { useLocation, useHistory } from 'react-router'
import {
  ComposedParamsEncDec,
  ComposeEncDec,
  MakeEncDecFromObj,
  ParamsEncDec,
  ParamsEncDecFn,
  ParamsEncDecObj
} from './EncDec/encdec'
import useQueryParams from './useQueryParams'

type HistoryMethods = 'push' | 'replace'

function useRouterQueryParams(): [
  ParsedQuery,
  (
    q: Record<string, any> | ((q: Record<string, any>) => Record<string, any>),
    ...args: any[]
  ) => void
]

function useRouterQueryParams<T>(
  qpEncode?: ParamsEncDecFn<T>,
  options?: StringifyOptions
): [T, (value: Partial<T> | ((e: T) => T), ...args: any[]) => void]

function useRouterQueryParams<T extends ParamsEncDecObj>(
  qpEncoder: T,
  options?: StringifyOptions
): MakeEncDecFromObj<T> extends ParamsEncDec<infer O, infer I>
  ? [O, (value: Partial<I> | ((e: O) => I), ...args: any[]) => void]
  : never

function useRouterQueryParams<T extends ComposedParamsEncDec>(
  qpEncoder: T,
  options?: StringifyOptions
): ComposeEncDec<T> extends ParamsEncDec<infer O, infer I>
  ? [
      O & ParsedQuery,
      (
        value:
          | Partial<I & Record<string, any>>
          | ((e: O & ParsedQuery) => I & Record<string, any>),
        ...args: any[]
      ) => void
    ]
  : never

function useRouterQueryParams(
  qpEncoder?: ParamsEncDecObj | ParamsEncDecFn | ComposedParamsEncDec,
  options?: StringifyOptions
): [
  Record<string, any>,
  (
    q: Record<string, any> | ((q: Record<string, any>) => Record<string, any>),
    ...args: any[]
  ) => void
]

function useRouterQueryParams(
  qpEncoder?: ParamsEncDecObj | ParamsEncDecFn | ComposedParamsEncDec,
  options: StringifyOptions = {}
): [
  Record<string, any>,
  (
    q: Record<string, any> | ((q: Record<string, any>) => Record<string, any>),
    ...args: any[]
  ) => void
] {
  const location = useLocation()
  const history = useHistory()

  const setSearchStr = useCallback(
    (nextQueryString, historyMethod: HistoryMethods = 'push') => {
      /*
       * WARNING: do not be tempted to direcly use "location" from outer scope here,
       * since it changes at every render. This may cause an infinite render loop.
       */
      const url = `${history.location.pathname}?${nextQueryString}`
      history[historyMethod](url)
    },
    [history]
  )

  const proxied = useQueryParams(
    location.search,
    setSearchStr,
    qpEncoder,
    options
  )

  return proxied
}

export default useRouterQueryParams
