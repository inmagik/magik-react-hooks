'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');
var __chunk_1 = require('./chunk-1301c052.js');

// Credits to @Andarist
// https://github.com/Andarist/use-constant
function useConstant(valueOrFactory) {
  const ref = react.useRef();

  if (!ref.current) {
    ref.current = { v: __chunk_1.getOrInvoke(valueOrFactory) };
  }

  return ref.current.v
}

exports.useConstant = useConstant;
