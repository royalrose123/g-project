import { hasSpaces } from './regexes'
import toSpaceCase from './to-space-case'

/**
 * Convert a `string` to snake case.
 *
 * @param {String} string
 * @return {String}
 */
function toSnakeCase (string) {
  return toSpaceCase(string).replace(hasSpaces, '_')
}

export default toSnakeCase
