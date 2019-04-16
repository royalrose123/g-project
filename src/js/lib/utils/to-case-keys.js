import to, { CASES } from './to-case'
import isObject from './is-object'

function matches (patterns, value) {
  return patterns.some(pattern => (typeof pattern === 'string' ? pattern === value : pattern.test(value)))
}

/**
 * Convert `object` keys into a new cased `object` with options.
 *
 * @param {object} object
 * @param {string} toCase
 * @param {{ isDeep: boolean, exclude: (string[]|RegExp[]) }} options
 * @return {Object}
 */
function toCaseKeys (object, toCase, options) {
  if (!Object.values(CASES).includes(toCase)) {
    throw new Error('There is not the type of case converter.')
  }

  const converter = to[toCase]
  const newObject = Array.isArray(object) ? [] : {}
  options = Object.assign({ isDeep: true, exclude: [] }, options)

  for (const [key, value] of Object.entries(object)) {
    const newKey = matches(options.exclude, key) ? key : converter(key)
    const newValue = options.isDeep && isObject(value) ? toCaseKeys(value, toCase, options) : value

    newObject[newKey] = newValue
  }

  return newObject
}

export { CASES }
export default toCaseKeys
