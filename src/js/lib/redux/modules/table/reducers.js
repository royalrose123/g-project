import { createReducer } from 'redux-create-reducer'
import * as actionTypes from './actionTypes'

const initialState = {
  tableNumber: 'Please select',
  // clockState: 'manualClock',
  // clockState: 'autoMember',
  clockState: 'autoAnonymous',
  clockInTriggerTime: 60,
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

  [actionTypes.CHANGE_CLOCK_IN_TRIGGER_TIME]: (state, { payload }) => ({
    ...state,
    clockInTriggerTime: payload.clockInTriggerTime,
  }),
})

export default tableData
