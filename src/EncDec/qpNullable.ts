import { makeParamEncDec, ParamEncDecObj, ParamEncDecFn } from './encdec'

// TODO: Infer all stuff "-.-
export const qpNullable = (
  nested_type: ParamEncDecObj | ParamEncDecFn,
  null_representation = 'null'
): ParamEncDecObj<any, any> => {
  const encdec = makeParamEncDec(nested_type)
  return {
    encode: data => (data === null ? null_representation : encdec.encode(data)),
    decode: str => (str === null_representation ? null : encdec.decode(str))
  }
}
