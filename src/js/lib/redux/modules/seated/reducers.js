import { createReducer } from 'redux-create-reducer'
import * as actionTypes from './actionTypes'

import { COUNT } from './constants'

const initialState = new Array(COUNT).fill()

const seated = createReducer(initialState, {
  [actionTypes.ADD_ITEM_TO_LIST]: (state, { payload }) => state.map((item, index) => (index === payload.index ? payload.item : item)),
  [actionTypes.REMOVE_ITEM_FROM_LIST]: (state, { payload }) => state.map((item, index) => (index === payload.index ? undefined : item)),
  [actionTypes.REMOVE_ALL_FROM_SEATED]: (state, { payload }) => new Array(COUNT).fill(),
})

export default seated
