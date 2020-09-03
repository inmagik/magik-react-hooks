import { useLocation, useHistory } from 'react-router'

if (process.env.NODE_ENV !== 'production') {
  console.warn(
    'useRouter is depreacted and will be removed in the next major release, ' +
    'use native react-router hooks instead:\n' +
      "import { useLocation, useHistory } from 'react-router'"
  )
}

export default function useRouter() {
  const location = useLocation()
  const history = useHistory()

  return { location, history }
}
