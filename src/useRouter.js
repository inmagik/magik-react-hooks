import { useContext } from 'react'
import { __RouterContext } from 'react-router'

export function useRouter() {
  return useContext(__RouterContext)
}
