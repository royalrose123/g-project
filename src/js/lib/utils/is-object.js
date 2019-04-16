// Custimized for using case
function isObject (value) {
  return typeof value === 'object' && value !== null && !(value instanceof RegExp) && !(value instanceof Error) && !(value instanceof Date)
}

export default isObject
