export const getLocalStorageItem = key => {
  return JSON.parse(window.localStorage.getItem(key))
}

export const setLocalStorageItem = (key, value) => {
  window.localStorage.setItem(key, JSON.stringify(value))
}

export const removeLocalStorageItem = key => {
  window.localStorage.removeItem(key)
}

export const clearLocalStorageItem = () => {
  window.localStorage.clear()
}

export const setLocalStorageItemPromise = (key, value) => {
  window.localStorage.setItem(key, JSON.stringify(value))

  let newPromise = new Promise((resolve, reject) => {
    // 傳入 resolve 與 reject，表示資料成功與失敗
    resolve(JSON.parse(window.localStorage.getItem(key)))
  })
  return newPromise
}
