import { separatorSplitter, camelSplitter, hasSpace, hasSeparator, hasCamel } from './regexes'

/**
 * Un-separate a `string`.
 *
 * @param {String} string
 * @return {String}
 */
function unseparate (string) {
  return string.replace(separatorSplitter, (match, next) => (next ? ` ${next}` : ''))
}

/**
 * Un-camelcase a `string`.
 *
 * @param {String} string
 * @return {String}
 */
function uncamelize (string) {
  return string.replace(camelSplitter, (match, previous, uppers) => `${previous} ${uppers.toLowerCase().split('').join(' ')}`) // prettier-ignore
}

/**
 * Remove any starting case from a `string`, like camel or snake, but keep
 * spaces and punctuation that may be important otherwise.
 *
 * @param {String} string
 * @return {String}
 */
function toNoCase (string) {
  let result = ''

  switch (true) {
    case hasSpace.test(string):
      result = string
      break

    case hasSeparator.test(string):
      result = unseparate(string) || string
      break

    case hasCamel.test(string):
      result = uncamelize(string)
      break

    default:
      result = string
      break
  }

  return result.toLowerCase()
}

export default toNoCase
