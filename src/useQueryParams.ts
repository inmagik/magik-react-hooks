import { useMemo, useCallback, useRef, useEffect } from 'react'
import qs, { ParsedQuery, StringifyOptions } from 'query-string'
import useConstant from './useConstant'
import {
  makeParamsEncDec,
  ParamsEncDecFn,
  ParamsEncDecObj,
  ComposedParamsEncDec,
  ComposeEncDec,
  MakeEncDecFromObj,
  ParamsEncDec
} from './EncDec/encdec'
import useMemoCompare from './useMemoCompare'

type SetQueryParamCb = (qs: string, ...args: any[]) => void

function useQueryParams(
  queryString: string,
  setQueryString: SetQueryParamCb
): [
  ParsedQuery,
  (
    q: Record<string, any> | ((q: Record<string, any>) => Record<string, any>),
    ...args: any[]
  ) => void
]

function useQueryParams<T>(
  queryString: string,
  setQueryString: SetQueryParamCb,
  qpEncode?: ParamsEncDecFn<T>,
  options?: StringifyOptions
): [T, (value: Partial<T> | ((e: T) => T), ...args: any[]) => void]

function useQueryParams<T extends ParamsEncDecObj>(
  queryString: string,
  setQueryString: SetQueryParamCb,
  qpEncoder: T,
  options?: StringifyOptions
): MakeEncDecFromObj<T> extends ParamsEncDec<infer O, infer I>
  ? [O, (value: Partial<I> | ((e: I) => I), ...args: any[]) => void]
  : never

function useQueryParams<T extends ComposedParamsEncDec>(
  queryString: string,
  setQueryString: SetQueryParamCb,
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

function useQueryParams(
  queryString: string,
  setQueryString: SetQueryParamCb,
  qpEncoder?: ParamsEncDecObj | ParamsEncDecFn | ComposedParamsEncDec,
  options: StringifyOptions = {}
): [
  ParsedQuery,
  (
    q: Record<string, any> | ((q: Record<string, any>) => Record<string, any>),
    ...args: any[]
  ) => void
] {
  const parser = useConstant(() => makeParamsEncDec(qpEncoder))

  const opts = useMemoCompare(options)

  const queryParams = useMemo(() => parser.decode(qs.parse(queryString)), [
    queryString,
    parser
  ])
  const holder = useRef(queryParams)
  useEffect(() => {
    holder.current = queryParams
  })

  const setQueryParams = useCallback(
    (newQueryParamsOrCb, ...args) => {
      const currentQueryParams = holder.current

      let nextParams
      if (typeof newQueryParamsOrCb === 'function') {
        nextParams = newQueryParamsOrCb(currentQueryParams)
      } else {
        nextParams = {
          ...currentQueryParams,
          ...newQueryParamsOrCb
        }
      }
      const queryString = qs.stringify(parser.encode(nextParams), opts)
      setQueryString(queryString, ...args)
    },
    [parser, opts, setQueryString]
  )

  return [queryParams, setQueryParams]
}

export default useQueryParams
