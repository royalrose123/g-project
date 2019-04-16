import { createReducer } from 'redux-create-reducer'
import * as actionTypes from './actionTypes'

const initialState = null

const TEMPLATE = createReducer(initialState, {
  [actionTypes.ACTION_TYPE]: (state, action) => {},
})

export default TEMPLATE
