import { createReducer } from 'redux-create-reducer'
import * as actionTypes from './actionTypes'

import { ROW, COLUMN } from './constants'

const initialState = new Array(ROW * COLUMN).fill()

const standing = createReducer(initialState, {
  [actionTypes.ADD_ITEM_TO_LIST]: (state, { payload }) => state.map((item, index) => (index === payload.index ? payload.item : item)),
  [actionTypes.REMOVE_ITEM_FROM_LIST]: (state, { payload }) => state.map((item, index) => (index === payload.index ? undefined : item)),
})

export default standing
