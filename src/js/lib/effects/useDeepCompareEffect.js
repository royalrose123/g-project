import { useEffect } from 'react'

import useDeepCompareMemorize from './useDeepCompareMemorize'

function isPrimitive (val) {
  return val == null || /^[sbn]/.test(typeof val)
}

function checkDependencies (deps) {
  if (!deps || !deps.length) {
    throw new Error('useDeepCompareEffect should not be used with no dependencies. Use React.useEffect instead.')
  }

  if (deps.every(isPrimitive)) {
    throw new Error('useDeepCompareEffect should not be used with dependencies that are all primitive values. Use React.useEffect instead.')
  }
}
function useDeepCompareEffect (callback, dependencies) {
  if (process.env.NODE_ENV !== 'production') {
    checkDependencies(dependencies)
  }

  useEffect(callback, useDeepCompareMemorize(dependencies))
}

export default useDeepCompareEffect
