import { StringifyOptions } from 'query-string'
import { useCallback } from 'react'
import { useHistory, useLocation } from 'react-router'
import {
  MakeEncDecFromObj,
  ParamEncDec,
  ParamEncDecFn,
  ParamEncDecObj,
  ParsedQueryItem
} from './EncDec/encdec'
import useQueryParam from './useQueryParam'

type HistoryMethods = 'push' | 'replace'

function useRouterQueryParam(
  name: string
): [ParsedQueryItem, (value: any, ...args: any[]) => void]

function useRouterQueryParam<D>(
  name: string,
  defaultValue: D
): [ParsedQueryItem | D, (value: any, ...args: any[]) => void]

function useRouterQueryParam<D, T>(
  name: string,
  defaultValue: D,
  qpEncoder: ParamEncDecFn<T>,
  options?: StringifyOptions
): [NonNullable<T> | D, (value: NonNullable<T>, ...args: any[]) => void]

function useRouterQueryParam<D, T extends ParamEncDecObj>(
  name: string,
  defaultValue: D,
  qpEncoder: T,
  options?: StringifyOptions
): MakeEncDecFromObj<T> extends ParamEncDec<infer O, infer I>
  ? [NonNullable<O> | D, (value: I, ...args: any[]) => void]
  : never

function useRouterQueryParam(
  name: string,
  defaultValue?: any,
  qpEncoder?: ParamEncDecObj | ParamEncDecFn,
  options: StringifyOptions = {}
): [any, (value: any, ...args: any[]) => void] {
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

  const proxied = useQueryParam(
    location.search,
    setSearchStr,
    name,
    defaultValue,
    qpEncoder,
    options
  )

  return proxied
}

export default useRouterQueryParam