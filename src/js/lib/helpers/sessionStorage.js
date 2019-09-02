export const getSessionStorageItem = key => {
  return JSON.parse(window.sessionStorage.getItem(key))
}

export const setSessionStorageItem = (key, value) => {
  window.sessionStorage.setItem(key, JSON.stringify(value))
}

export const removeSessionStorageItem = key => {
  window.sessionStorage.removeItem(key)
}

export const clearSessionStorageItem = () => {
  window.sessionStorage.clear()
}
