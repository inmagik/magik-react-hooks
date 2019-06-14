import { useRef } from 'react';
import { g as getOrInvoke } from './chunk-6983903d.js';

// Credits to @Andarist
// https://github.com/Andarist/use-constant
function useConstant(valueOrFactory) {
  const ref = useRef();

  if (!ref.current) {
    ref.current = { v: getOrInvoke(valueOrFactory) };
  }

  return ref.current.v
}

export { useConstant };
