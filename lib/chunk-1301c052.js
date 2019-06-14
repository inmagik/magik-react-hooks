'use strict';

const getOrInvoke = (maybeFn, ...args) => {
  if (typeof maybeFn === 'function') {
    return maybeFn(...args)
  } else {
    return maybeFn
  }
};

exports.getOrInvoke = getOrInvoke;
