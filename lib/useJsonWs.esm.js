import { useRef, useEffect } from 'react';
import 'reconnectingwebsocket';
import { useRawWs } from './useRawWs.esm.js';

const useJsonWs = (url, callback) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  });

  return useRawWs(url, {
    message: e => callback(JSON.parse(e.data))
  })
};

export { useJsonWs };
