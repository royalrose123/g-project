import { createReducer } from 'redux-create-reducer'
import * as actionTypes from './actionTypes'

import CLOCK_STATUS from '../../../../constants/ClockStatus'

const initialState = {
  tableNumber: 'Please select',
  clockState: CLOCK_STATUS.MANUALLY_CLOCK,
  autoSettings: {},
  defaultRecord: {},
  clockOutPlayer: [],
}

const tableData = createReducer(initialState, {
  [actionTypes.INIT_TABLE_NUMBER]: (state, { payload }) => ({
    ...state,
    ...payload,
  }),

  [actionTypes.CHANGE_TABLE_NUMBER]: (state, { payload }) => ({
    ...state,
    tableNumber: payload.tableNumber,
  }),

  [actionTypes.INIT_CLOCK_STATE]: (state, { payload }) => ({
    ...state,
    ...payload,
  }),

  [actionTypes.CHANGE_CLOCK_STATE]: (state, { payload }) => ({
    ...state,
    clockState: payload.clockState,
  }),

  [actionTypes.CHANGE_AUTO_SETTINGS]: (state, { payload }) => ({
    ...state,
    autoSettings: payload.autoSettings,
  }),

  [actionTypes.CHANGE_DEFAULT_RECORD]: (state, { payload }) => ({
    ...state,
    defaultRecord: payload.defaultRecord,
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
