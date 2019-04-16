import { useEffect, useState, useReducer } from 'react'

import useDeepCompareEffect from './useDeepCompareEffect'

const actionTypes = {
  FETCH_REQUEST: 'FETCH_REQUEST',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_FAILURE: 'FETCH_FAILURE',
}

const initialState = {
  isLoaded: false,
  isFetching: false,
  hasError: false,
  response: null,
}

const reducer = (state, { type, response }) => {
  switch (type) {
    case actionTypes.FETCH_REQUEST:
      return { ...state, isFetching: true }

    case actionTypes.FETCH_SUCCESS:
      return { ...state, isFetching: false, isLoaded: true, hasError: false, response }

    case actionTypes.FETCH_FAILURE:
      return { ...state, isFetching: false, isLoaded: false, hasError: true, response }

    default:
      return state
  }
}

const useFetcher = (initialResponse, fetcher, variables = {}) => {
  const [parameters, setParameters] = useState(variables)
  const [state, dispatch] = useReducer(reducer, { ...initialState, response: initialResponse })

  useEffect(() => {
    let didCancel = false
    const fetchData = async () => {
      dispatch({ type: actionTypes.FETCH_REQUEST })

      try {
        const response = await fetcher(parameters)

        if (!didCancel) {
          dispatch({ type: actionTypes.FETCH_SUCCESS, response })
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: actionTypes.FETCH_FAILURE })
        }
      }
    }

    fetchData()

    return () => (didCancel = true)
  }, [fetcher, parameters])

  useDeepCompareEffect(() => {
    setParameters(variables)
  }, [variables])

  const updateParameters = newParameters => setParameters({ ...parameters, ...newParameters })

  return { ...state, updateParameters }
}

export default useFetcher
