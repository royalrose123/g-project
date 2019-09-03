import { createReducer } from 'redux-create-reducer'
import * as actionTypes from './actionTypes'

import CLOCK_STATUS from '../../../../constants/ClockStatus'

const initialState = {
  tableNumber: 'Please select table',
  clockState: CLOCK_STATUS.MANUALLY_CLOCK,
  clockOutPlayer: [],
}

const tableData = createReducer(initialState, {
  // tableNumber
  [actionTypes.INIT_TABLE_NUMBER]: (state, { payload }) => ({
    ...state,
    ...payload,
  }),

  [actionTypes.CHANGE_TABLE_NUMBER]: (state, { payload }) => ({
    ...state,
    tableNumber: payload.tableNumber,
  }),

  // clockState
  [actionTypes.INIT_CLOCK_STATE]: (state, { payload }) => ({
    ...state,
    ...payload,
  }),

  [actionTypes.CHANGE_CLOCK_STATE]: (state, { payload }) => ({
    ...state,
    clockState: payload.clockState,
  }),

  // clockOutPlayer
  [actionTypes.INIT_CLOCK_OUT_PLAYER]: (state, { payload }) => ({
    ...state,
    ...payload,
  }),

  [actionTypes.ADD_CLOCK_OUT_PLAYER]: (state, { payload }) => ({
    ...state,
    clockOutPlayer: [...state.clockOutPlayer, payload.clockOutPlayer],
  }),

  [actionTypes.REMOVE_CLOCK_OUT_PLAYER]: (state, { payload }) => ({
    ...state,
    clockOutPlayer: state.clockOutPlayer.filter(item => item !== payload.clockOutPlayer),
  }),
})

export default tableData
