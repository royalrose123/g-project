import isObject from './is-object'

function matches (patterns, value) {
  return patterns.some(pattern => (typeof pattern === 'string' ? pattern === value : pattern.test(value)))
}

/**
 * Convert `object` values into predicated `object` by predicator with options.
 *
 * @param {object} object
 * @param {string} predicator
 * @param {{ isDeep: boolean, exclude: (string[]|RegExp[]) }} options
 * @return {Object}
 */
function toPredicateValues (object, predicator, options) {
  const newObject = Array.isArray(object) ? [] : {}
  options = Object.assign({ isDeep: true, exclude: [] }, options)

  for (const [key, value] of Object.entries(object)) {
    if (matches(options.exclude, key)) {
      newObject[key] = value
    } else {
      newObject[key] = options.isDeep && isObject(value) ? toPredicateValues(value, predicator, options) : value
    }
  }

  return predicator(newObject)
}

export default toPredicateValues
