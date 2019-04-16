import { separatorSplitter } from './regexes'
import toNoCase from './to-no-case'

/**
 * Convert a `string` to space case.
 *
 * @param {String} string
 * @return {String}
 */
function toSpaceCase (string) {
  return toNoCase(string).replace(separatorSplitter, (matches, match) => (match ? ` ${match}` : '')).trim() // prettier-ignore
}

export default toSpaceCase
