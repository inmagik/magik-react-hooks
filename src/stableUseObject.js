import { useRef } from "react"
import isEqual from "lodash.isequal"

const useStableObject = obj => {
  const holder = useRef(obj)

  if (obj !== holder.current && !isEqual(obj, holder.current)) {
    holder.current = obj
  }

  return holder.current
}

export default useStableObject