'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');
var reactRouter = require('react-router');

function useRouter() {
  return react.useContext(reactRouter.__RouterContext)
}

exports.useRouter = useRouter;
