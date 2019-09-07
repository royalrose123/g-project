import * as actionTypes from './actionTypes'

// tableNumber
export const initTableNumber = tableNumber => ({
  type: actionTypes.INIT_TABLE_NUMBER,
  payload: {
    tableNumber,
  },
})

export const changeTableNumber = tableNumber => ({
  type: actionTypes.CHANGE_TABLE_NUMBER,
  payload: {
    tableNumber,
  },
})

// clockState
export const initClockState = clockState => ({
  type: actionTypes.INIT_CLOCK_STATE,
  payload: {
    clockState,
  },
})

export const changeClockState = clockState => ({
  type: actionTypes.CHANGE_CLOCK_STATE,
  payload: {
    clockState,
  },
})

// clockOutPlayer
export const initClockOutPlayer = clockOutPlayer => ({
  type: actionTypes.INIT_CLOCK_OUT_PLAYER,
  payload: {
    clockOutPlayer,
  },
})

export const addClockOutPlayer = clockOutPlayer => ({
  type: actionTypes.ADD_CLOCK_OUT_PLAYER,
  payload: {
    clockOutPlayer,
  },
})

export const removeClockOutPlayer = clockOutPlayer => ({
  type: actionTypes.REMOVE_CLOCK_OUT_PLAYER,
  payload: {
    clockOutPlayer,
  },
})

export const removeAllClockOutPlayer = clockOutPlayer => ({
  type: actionTypes.REMOVE_ALL_CLOCK_OUT_PLAYER,
  payload: {
    clockOutPlayer,
  },
})
