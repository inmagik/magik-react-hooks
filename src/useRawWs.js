import { useEffect, useRef, useCallback } from 'react'
import ReconnectingWebSocket from 'reconnectingwebsocket'

export const useRawWs = (url, callback) => {
  const savedCallback = useRef()

  useEffect(() => {
    savedCallback.current = callback
  })

  const sendEvent = useCallback((eventType, eventObj) => {
    if (typeof savedCallback.current === 'function') {
      savedCallback.current(eventType, eventObj)
    } else if (typeof savedCallback.current === 'object' && savedCallback.current !== null && savedCallback.current[eventType]) {
      savedCallback.current(eventObj)
    }
  }, [])

  useEffect(() => {
    const ws = new ReconnectingWebSocket(url)

    ws.addEventListener('open', e => {
      sendEvent('open', e)
    })

    ws.addEventListener('message', e => {
      sendEvent('message', e)
    })

    ws.addEventListener('close', e => {
      sendEvent('close', e)
    })

    return () => ws.close()
  }, [url])
}
