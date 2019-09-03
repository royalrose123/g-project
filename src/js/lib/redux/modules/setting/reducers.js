import { createReducer } from 'redux-create-reducer'
import * as actionTypes from './actionTypes'

const initialState = {
  systemSettings: {},
  autoSettings: {},
  defaultRecord: {},
}

const settingData = createReducer(initialState, {
  [actionTypes.INIT_SETTING_DATA]: (state, { payload }) => ({
    ...state,
    systemSettings: payload.systemSettings,
    autoSettings: payload.autoSettings,
    defaultRecord: payload.defaultRecord,
  }),

  [actionTypes.CHANGE_SETTING_DATA]: (state, { payload }) => ({
    ...state,
    systemSettings: payload.systemSettings,
    autoSettings: payload.autoSettings,
    defaultRecord: payload.defaultRecord,
  }),
})

export default settingData
