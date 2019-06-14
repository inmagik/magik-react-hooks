'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var react = require('react');
var qs = _interopDefault(require('query-string'));
require('react-router');
var useRouter = require('./useRouter.cjs.js');

function useQueryParams() {
  const { location, history } = useRouter.useRouter();

  const queryParams = react.useMemo(() => qs.parse(location.search), [location.search]);

  const setQueryParams = newQueryParams => {
    const currentQueryParams = qs.parse(location.search);
    const url = `${location.pathname}?${qs.stringify({
      ...currentQueryParams,
      ...newQueryParams
    })}`;
    history.push(url);
  };

  return [queryParams, setQueryParams]
}

exports.useQueryParams = useQueryParams;
