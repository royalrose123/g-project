// Separate the thunks from the action creators
// If the operation only dispatches a single action — forward the action creator function.
// If the operation uses a thunk, it can dispatch many actions and chain them with promises.

import * as actions from './actions'

export const initStandingList = actions.initStandingList

export const addItemToList = actions.addItemToList

export const removeItemFromList = actions.removeItemFromList

export const removeAllFromStanding = actions.removeAllFromStanding
