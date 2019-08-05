import React from 'react'
import useQueryParam from '@inmagik/magik-react-hooks/useQueryParam';
import { qpDate } from '@inmagik/magik-react-hooks/qpUtils'

const SingleTestComponent = () => {
  const [date, setDate] = useQueryParam('d', null, qpDate(), { encode: false })

  console.log('single', { date })

  return (
    <div onClick={() => setDate(new Date(2019, 8, 27, 15, 0))}>
      {date && date.toLocaleDateString()}
    </div>
  )
}

export default SingleTestComponent
