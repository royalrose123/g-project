import { createReducer } from 'redux-create-reducer'
import * as actionTypes from './actionTypes'

const initialState = { tableNumber: 'Please select', clockState: 'autoMember' }

const tableData = createReducer(initialState, {
  [actionTypes.INIT_TABLE_NUMBER]: (state, { payload }) => ({
    ...state,
    ...payload,
  }),
  [actionTypes.CHANGE_TABLE_NUMBER]: (state, { payload }) => ({
    ...state,
    tableNumber: payload.tableNumber,
  }),
  [actionTypes.CHANGE_CLOCK_STATE]: (state, { payload }) => ({
    ...state,
    clockState: payload.clockState,
  }),
})

export default tableData
