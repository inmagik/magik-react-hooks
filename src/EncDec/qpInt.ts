import { ParamEncDecFn } from './encdec'

export const qpInt = (radix = 10): ParamEncDecFn<number | undefined | null> => (
  fromQs,
  toQs
) =>
  (fromQs && parseInt(fromQs as string, radix)) ||
  (toQs && toQs.toString(radix)) ||
  undefined
