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
