import { useRef, useEffect } from 'react';
import { g as getOrInvoke } from './chunk-6983903d.js';

// Taken from React official docs (2019-06-14)
// https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
function usePrevious(valueOrFactory) {
  const ref = useRef();
  useEffect(() => {
    ref.current = getOrInvoke(valueOrFactory);
  });
  return ref.current
}

export { usePrevious };
