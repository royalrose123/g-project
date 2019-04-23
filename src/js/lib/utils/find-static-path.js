/**
 * Find static path from string or array of string
 * @param {string || string[]} value
 * @returns {string} - staticPath
 */
function findStaticPath (value) {
  return Array.isArray(value) ? value.find(path => !/\/:\w*/gi.test(path)) || '' : value.replace(/\/:\w*/gi, '')
}

export default findStaticPath
