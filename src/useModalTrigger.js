import { useCallback, useMemo, useState } from "react"

export default function useModalTrigger() {
  const [state, setState] = useState({
    isOpen: false,
    value: null,
  })

  const open = useCallback(
    (value = null) =>
      setState({
        value,
        isOpen: true,
      }),
    []
  )

  const close = useCallback(
    () =>
      setState((s) => ({
        ...s,
        isOpen: false,
      })),
    []
  )

  const toggle = useCallback(
    () =>
      setState((s) => ({
        ...s,
        isOpen: !s.isOpen,
      })),
    []
  )

  const onClosed = useCallback(
    () =>
      setState((s) => ({
        value: null,
        isOpen: false,
      })),
    []
  )

  const memoActions = useMemo(
    () => ({
      open,
      toggle,
      close,
      onClosed,
    }),
    [open, toggle, close, onClosed]
  )

  return [state, memoActions]
}
