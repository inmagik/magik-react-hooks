'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');
require('reconnectingwebsocket');
var useRawWs = require('./useRawWs.cjs.js');

const useJsonWs = (url, callback) => {
  const savedCallback = react.useRef();

  react.useEffect(() => {
    savedCallback.current = callback;
  });

  return useRawWs.useRawWs(url, {
    message: e => callback(JSON.parse(e.data))
  })
};

exports.useJsonWs = useJsonWs;
