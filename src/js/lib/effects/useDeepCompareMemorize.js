import { useRef } from 'react'
import { isEqual } from 'lodash'

function useDeepCompareMemorize (value) {
  const ref = useRef()

  if (!isEqual(value, ref.current)) {
    ref.current = value
  }

  return ref.current
}

export default useDeepCompareMemorize
