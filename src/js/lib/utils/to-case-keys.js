import to, { CASES } from './to-case'

const isObject = value => value !== null && (typeof value === 'function' || typeof value === 'object')
const matches = (patterns, value) => patterns.some(pattern => (typeof pattern === 'string' ? pattern === value : pattern.test(value)))

/**
 * Convert `object` keys into a new cased `object` with options.
 *
 * @param {object} object
 * @param {string} toCase
 * @param {{ isDeep: boolean, exclude: (string[]|RegExp[]), objectComparator: function }} options
 * @return {Object}
 */
function toCaseKeys (object, toCase, options) {
  if (!Object.values(CASES).includes(toCase)) {
    throw new Error('There is not the type of case converter.')
  }

  options = Object.assign({ isDeep: true, exclude: [], objectComparator: isObject }, options)

  if (!options.objectComparator(object)) return object

  const converter = to[toCase]
  const newObject = Array.isArray(object) ? [] : {}

  for (const [key, value] of Object.entries(object)) {
    const newKey = matches(options.exclude, key) ? key : converter(key)
    const newValue = options.isDeep ? toCaseKeys(value, toCase, options) : value

    newObject[newKey] = newValue
  }

  return newObject
}

export { CASES }
export default toCaseKeys
