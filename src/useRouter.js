import { useLocation, useHistory } from 'react-router'

export default function useRouter() {
  const location = useLocation()
  const history = useHistory()

  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      'useRouter is depreacted and will be removed in the next major release ' +
        "plase use: import { useLocation, useHistory } from 'react-router' instead. "
    )
  }

  return { location, history }
}
