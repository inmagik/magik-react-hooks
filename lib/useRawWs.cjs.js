'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var react = require('react');
var ReconnectingWebSocket = _interopDefault(require('reconnectingwebsocket'));

const useRawWs = (url, callback) => {
  const savedCallback = react.useRef();

  react.useEffect(() => {
    savedCallback.current = callback;
  });

  const sendEvent = react.useCallback((eventType, eventObj) => {
    if (typeof savedCallback.current === 'function') {
      savedCallback.current(eventType, eventObj);
    } else if (typeof savedCallback.current === 'object' && savedCallback.current !== null && savedCallback.current[eventType]) {
      savedCallback.current(eventObj);
    }
  }, []);

  react.useEffect(() => {
    const ws = new ReconnectingWebSocket(url);

    ws.addEventListener('open', e => {
      sendEvent('open', e);
    });

    ws.addEventListener('message', e => {
      sendEvent('message', e);
    });

    ws.addEventListener('close', e => {
      sendEvent('close', e);
    });

    return () => ws.close()
  }, [url]);
};

exports.useRawWs = useRawWs;
