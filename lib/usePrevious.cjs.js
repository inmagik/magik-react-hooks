'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');
var __chunk_1 = require('./chunk-1301c052.js');

// Taken from React official docs (2019-06-14)
// https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
function usePrevious(valueOrFactory) {
  const ref = react.useRef();
  react.useEffect(() => {
    ref.current = __chunk_1.getOrInvoke(valueOrFactory);
  });
  return ref.current
}

exports.usePrevious = usePrevious;
