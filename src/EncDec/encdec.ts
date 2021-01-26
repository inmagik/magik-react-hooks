import memoizeOne from 'memoize-one'
import { ParsedQuery } from 'query-string'

export interface AnyEncDec<D = any, O = any, I = any> {
  decode(a: D): O
  encode(a: I): any
}

export type ParsedQueryItem = string | string[] | undefined | null

// NOTE: Not 100% correct but divided I vs O with conditional types is quite impossible
export type AnyEncDecFn<D, T> = (d: D | undefined, e: T | undefined) => any

const makeEncDecFromFn = <D, T>(fn: AnyEncDecFn<D, T>): AnyEncDec<D, T, T> => ({
  encode: memoizeOne(data => fn(undefined, data)),
  decode: memoizeOne(str => fn(str, undefined))
})

export type AnyEncDecObj<D = any, O = any, I = any> = Partial<
  AnyEncDec<D, O, I>
>

const identity = <T>(arg: T): T => arg

export type MakeEncDecFromObj<T extends AnyEncDecObj> = T extends AnyEncDecObj<
  infer D,
  infer O,
  infer I
>
  ? unknown extends O
    ? unknown extends I
      ? AnyEncDec<D, D, any>
      : AnyEncDec<D, D, I>
    : unknown extends I
    ? AnyEncDec<D, O, any>
    : AnyEncDec<D, O, I>
  : never

function makeEncDecFromObj<T extends AnyEncDecObj>(obj: T): MakeEncDecFromObj<T>

function makeEncDecFromObj(obj: AnyEncDecObj): AnyEncDec {
  return {
    encode: obj.encode ? memoizeOne(obj.encode) : identity,
    decode: obj.decode ? memoizeOne(obj.decode) : identity
  }
}

export type ParamEncDec<O = any, I = any> = AnyEncDec<ParsedQueryItem, O, I>

export type ParamEncDecObj<O = any, I = any> = AnyEncDecObj<
  ParsedQueryItem,
  O,
  I
>

export type ParamEncDecFn<T = any> = AnyEncDecFn<ParsedQueryItem, T>

export function makeParamEncDec(): ParamEncDec<ParsedQueryItem>

export function makeParamEncDec<T extends ParamEncDecObj>(
  arg: T
): MakeEncDecFromObj<T>

// NOTE: For enc dev function we assume input is the same of output
// We can later try improve with conditional types but check is hard
export function makeParamEncDec<T>(arg: ParamEncDecFn<T>): ParamEncDec<T, T>

export function makeParamEncDec(
  arg?: ParamEncDecObj | ParamEncDecFn | undefined
): ParamEncDec

export function makeParamEncDec(
  arg?: ParamEncDecObj | ParamEncDecFn
): ParamEncDec {
  if (typeof arg === 'function') {
    return makeEncDecFromFn(arg)
  } else if (typeof arg === 'object' && arg !== null) {
    return makeEncDecFromObj(arg)
  } else {
    return {
      encode: arg => arg,
      decode: arg => arg
    }
  }
}

export type ParamsEncDec<O = any, I = any> = AnyEncDec<ParsedQuery, O, I>

export type ParamsEncDecObj<O = any, I = any> = AnyEncDecObj<ParsedQuery, O, I>

export type ParamsEncDecFn<T = any> = AnyEncDecFn<ParsedQuery, T>

export interface ComposedParamsEncDec {
  [key: string]: ParamEncDecObj | ParamEncDecFn
}

export type ComposeEncDec<T extends ComposedParamsEncDec> = ParamsEncDec<
  {
    [k in keyof T]: T[k] extends ParamEncDecObj
      ? MakeEncDecFromObj<T[k]> extends ParamEncDec<infer O>
        ? unknown extends O
          ? ParsedQueryItem
          : O
        : never
      : T[k] extends ParamEncDecFn<infer T>
      ? T
      : any
  },
  {
    [k in keyof T]: T[k] extends ParamEncDecObj
      ? MakeEncDecFromObj<T[k]> extends ParamEncDec<any, infer I>
        ? unknown extends I
          ? any
          : I
        : never
      : T[k] extends ParamEncDecFn<infer T>
      ? T
      : any
  }
>

// TODO: For now the only un handled branch is : ParamsEncDecObj + ComposedParamsEncDec
// which should give simply ParamsEncDec (all any)

export function makeParamsEncDec(): ParamsEncDec<ParsedQueryItem>

export function makeParamsEncDec<T>(arg: ParamsEncDecFn<T>): ParamsEncDec<T, T>

export function makeParamsEncDec<T extends ParamsEncDecObj>(
  arg: T
): MakeEncDecFromObj<T>

export function makeParamsEncDec<T extends ComposedParamsEncDec>(
  arg: T
): ComposeEncDec<T>

export function makeParamsEncDec(
  arg?: ParamsEncDecObj | ParamsEncDecFn | ComposedParamsEncDec
): ParamsEncDec

export function makeParamsEncDec(
  arg?: ParamsEncDecObj | ParamsEncDecFn | ComposedParamsEncDec
): ParamsEncDec {
  if (typeof arg === 'function') {
    return makeEncDecFromFn(arg)
  } else if (typeof arg === 'object' && arg !== null) {
    const qp = {} as ParamsEncDec
    const { encode, decode, ...others } = arg as ComposedParamsEncDec
    const global = makeEncDecFromObj(arg) as ParamsEncDec
    const memoized = {} as { [key: string]: ParamEncDec }
    for (let k in others) {
      if (typeof others[k] === 'function') {
        memoized[k] = makeEncDecFromFn(others[k] as ParamEncDecFn)
      } else if (typeof others[k] === 'object') {
        memoized[k] = makeEncDecFromObj(others[k] as ParamEncDecObj)
      }
    }
    qp.encode = memoizeOne(data => {
      const out = global.encode(data)
      for (let k in memoized) {
        out[k] = memoized[k].encode(data[k])
      }
      return out
    })
    qp.decode = memoizeOne(data => {
      const out = global.decode(data)
      for (let k in memoized) {
        out[k] = memoized[k].decode(data[k])
      }
      return out
    })
    return qp
  } else {
    return {
      encode: arg => arg,
      decode: arg => arg
    }
  }
}
