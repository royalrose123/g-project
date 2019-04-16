import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { composeWithDevTools } from 'redux-devtools-extension'

import * as modules from './modules'

const isDevelopment = process.env.NODE_ENV === 'development'

export const initializeStore = () => {
  let middlewares = [thunk]

  if (isDevelopment) {
    middlewares = [...middlewares, createLogger({ diff: true, collapsed: true, titleFormatter: action => `action： ${action.type}` })]
  }

  const reducer = combineReducers(modules)
  const initialState = {}
  const enhencer = composeWithDevTools(applyMiddleware(...middlewares))

  const store = createStore(reducer, initialState, enhencer)

  if (module.hot) {
    module.hot.accept('./modules', () => store.replaceReducer(modules))
  }

  return store
}
