import { makeEncDec } from "./encdec"

export const qpNullable = (nested_type, null_representation = "null") => {
  const encdec = makeEncDec(nested_type)
  return {
    encode: data => data === null ? null_representation : encdec.encode(data),
    decode: str => str === null_representation ? null : encdec.decode(str)
  }
}