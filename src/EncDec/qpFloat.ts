import { ParamEncDecFn } from './encdec'

export const qpFloat = (): ParamEncDecFn<number | undefined | null> => (
  fromQs,
  toQs
) =>
  (fromQs && parseFloat(fromQs as string)) ||
  (toQs && toQs.toString()) ||
  undefined
