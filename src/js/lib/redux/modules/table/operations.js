// Separate the thunks from the action creators
// If the operation only dispatches a single action — forward the action creator function.
// If the operation uses a thunk, it can dispatch many actions and chain them with promises.

import * as actions from './actions'

export const initTableNumber = actions.initTableNumber

export const changeTableNumber = actions.changeTableNumber

export const initClockState = actions.initClockState

export const changeClockState = actions.changeClockState

export const changeClockInTriggerTime = actions.changeClockInTriggerTime
