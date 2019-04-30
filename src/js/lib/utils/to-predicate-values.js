const isObject = value => value !== null && (typeof value === 'function' || typeof value === 'object')
const matches = (patterns, value) => patterns.some(pattern => (typeof pattern === 'string' ? pattern === value : pattern.test(value)))

/**
 * Convert `object` values into predicated `object` by predicator with options.
 *
 * @param {object} object
 * @param {function} predicator // (object) => (predicated object)
 * @param {{ isDeep: boolean, exclude: (string[]|RegExp[]), objectComparator: function }} options
 * @return {Object}
 */
function toPredicateValues (object, predicator, options) {
  options = Object.assign({ isDeep: true, exclude: [], objectComparator: isObject }, options)

  if (!options.objectComparator(object)) return object

  const newObject = Array.isArray(object) ? [] : {}

  for (const [key, value] of Object.entries(object)) {
    if (matches(options.exclude, key)) {
      newObject[key] = value
    } else {
      newObject[key] = options.isDeep ? toPredicateValues(value, predicator, options) : value
    }
  }

  return predicator(newObject)
}

export default toPredicateValues
