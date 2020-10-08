export const qpInt = (radix = 10) => (fromQs, toQs) =>
  (fromQs && parseInt(fromQs, radix)) ||
  (toQs && toQs.toString(radix)) ||
  undefined
