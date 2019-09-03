import * as actionTypes from './actionTypes'

// setting data
export const initSettingData = (systemSettings, autoSettings, defaultRecord) => ({
  type: actionTypes.INIT_SETTING_DATA,
  payload: {
    systemSettings,
    autoSettings,
    defaultRecord,
  },
})

export const changeSettingData = (systemSettings, autoSettings, defaultRecord) => ({
  type: actionTypes.CHANGE_SETTING_DATA,
  payload: {
    systemSettings,
    autoSettings,
    defaultRecord,
  },
})
