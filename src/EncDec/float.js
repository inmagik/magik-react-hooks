export const qpFloat = () => (fromQs, toQs) => (fromQs && parseFloat(fromQs)) || (toQs && toQs.toString()) || undefined
