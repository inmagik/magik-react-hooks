import { useMemo, useCallback, useRef, useEffect } from 'react'
import qs, { StringifyOptions } from 'query-string'
import useConstant from './useConstant'
import {
  makeParamEncDec,
  ParamEncDecObj,
  ParamEncDecFn,
  ParsedQueryItem,
  MakeEncDecFromObj,
  ParamEncDec
} from './EncDec/encdec'
import useMemoCompare from './useMemoCompare'

type SetQueryParamCb = (qs: string, ...args: any[]) => void

function useQueryParam(
  queryString: string,
  setQueryString: SetQueryParamCb,
  name: string
): [ParsedQueryItem, (value: any, ...args: any[]) => void]

function useQueryParam<D>(
  queryString: string,
  setQueryString: SetQueryParamCb,
  name: string,
  defaultValue: D
): [ParsedQueryItem | D, (value: any, ...args: any[]) => void]

function useQueryParam<D, T>(
  queryString: string,
  setQueryString: SetQueryParamCb,
  name: string,
  defaultValue: D,
  qpEncoder: ParamEncDecFn<T>,
  options?: StringifyOptions
): [NonNullable<T> | D, (value: NonNullable<T>, ...args: any[]) => void]

function useQueryParam<D, T extends ParamEncDecObj>(
  queryString: string,
  setQueryString: SetQueryParamCb,
  name: string,
  defaultValue: D,
  qpEncoder: T,
  options?: StringifyOptions
): MakeEncDecFromObj<T> extends ParamEncDec<infer O, infer I>
  ? [NonNullable<O> | D, (value: I, ...args: any[]) => void]
  : never

function useQueryParam(
  queryString: string,
  setQueryString: SetQueryParamCb,
  name: string,
  defaultValue?: any,
  qpEncoder?: ParamEncDecObj | ParamEncDecFn,
  options?: StringifyOptions
): [any, (value: any, ...args: any[]) => void]

function useQueryParam(
  queryString: string,
  setQueryString: SetQueryParamCb,
  name: string,
  defaultValue?: any,
  qpEncoder?: ParamEncDecObj | ParamEncDecFn,
  options: StringifyOptions = {}
): [any, (value: any, ...args: any[]) => void] {
  const parser = useConstant(() => makeParamEncDec(qpEncoder))

  const opts = useMemoCompare(options)

  const [param, queryParams] = useMemo(() => {
    const allParams = qs.parse(queryString)
    if (allParams[name]) {
      return [parser.decode(allParams[name]), allParams]
    } else {
      return [defaultValue, allParams]
    }
  }, [defaultValue, name, parser, queryString])

  const holder = useRef(queryParams)
  useEffect(() => {
    holder.current = queryParams
  }, [queryParams])

  const setQueryParams = useCallback(
    (nextValue, ...args) => {
      const currentQueryParams = holder.current
      const queryString = qs.stringify(
        {
          ...currentQueryParams,
          [name]: parser.encode(nextValue)
        },
        opts
      )
      setQueryString(queryString, ...args)
    },
    [name, parser, opts, setQueryString]
  )

  return [param, setQueryParams]
}

export default useQueryParam