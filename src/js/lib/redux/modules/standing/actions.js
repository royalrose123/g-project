// ** Simple Actions Creators (a function which return native object with type) **
// createItem: 從無到有 (null -> {...})
// fetchItem: 從後端取資料
// setItem: 直接替換該筆資料 (null/{...} -> {...})
// updateItem: 融合現有資料更新 ({..., a, ...} -> {..., a, b,...})
// deleteItem: 移除一筆資料，資料將不存在 ({...} -> null)

// createList: 從無到有 (null -> [])
// fetchList: 從後端取資料
// setList: 直接替換該筆資料 (null/[...] -> [...])
// addItemToList: 將一筆資料加進列表 ([...] -> [..., a])
// addListToList: 將一個列表加進列表 ([...] -> [..., ...])
// updateItemInList: 融合現有資料更新 ([..., a, ...] -> [..., a, b, ...])
// removeItemFromList: 將一筆資料從列表中刪除 ([..., a, ...] -> [..., ...])
// deleteList: 移除列表，列表將不存在 ([...] -> null)
// clearList: 將列表中的資料移除，列表本身仍存在 ([...] -> [])

import * as actionTypes from './actionTypes'

export const initStandingList = (item, index) => ({
  type: actionTypes.INIT_STANDING_LIST,
  payload: {
    item,
    index,
  },
})

export const addItemToList = (item, index) => ({
  type: actionTypes.ADD_ITEM_TO_LIST,
  payload: {
    item,
    index,
  },
})

export const removeItemFromList = index => ({
  type: actionTypes.REMOVE_ITEM_FROM_LIST,
  payload: {
    index,
  },
})

export const removeAllFromStanding = index => ({
  type: actionTypes.REMOVE_ALL_FROM_STANDING,
  payload: {
    index,
  },
})
