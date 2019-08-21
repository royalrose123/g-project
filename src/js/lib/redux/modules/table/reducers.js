import { createReducer } from 'redux-create-reducer'
import * as actionTypes from './actionTypes'

const initialState = {
  tableNumber: 'Please select',
  // clockState: 'manualClock',
  // clockState: 'autoMember',
  // clockState: 'autoClock',
  clockState: 'manualClock',
  // clockInTriggerTime: 60,
  autoSettings: {},
  defaultRecord: {},
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
})

export default tableData
