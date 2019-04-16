import { hasSpacesWithWord } from './regexes'
import toSpaceCase from './to-space-case'

/**
 * Convert a `string` to camel case.
 *
 * @param {String} string
 * @return {String}
 */

function toCamelCase (string) {
  return toSpaceCase(string).replace(hasSpacesWithWord, (matches, letter) => letter.toUpperCase())
}

export default toCamelCase
