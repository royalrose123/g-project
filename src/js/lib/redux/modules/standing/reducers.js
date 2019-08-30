import { createReducer } from 'redux-create-reducer'
import * as actionTypes from './actionTypes'

import { ROW, COLUMN } from './constants'

// 只要 14 個人，去掉最前面
const initialState = new Array(ROW * COLUMN).fill().slice(1)

const standing = createReducer(initialState, {
  [actionTypes.INIT_STANDING_LIST]: (state, { payload }) => payload.item.map(item => item || undefined),
  [actionTypes.ADD_ITEM_TO_LIST]: (state, { payload }) => state.map((item, index) => (index === payload.index ? payload.item : item)),
  [actionTypes.REMOVE_ITEM_FROM_LIST]: (state, { payload }) => state.map((item, index) => (index === payload.index ? undefined : item)),
  [actionTypes.REMOVE_ALL_FROM_STANDING]: (state, { payload }) => new Array(ROW * COLUMN).fill().slice(1),
})

export default standing
