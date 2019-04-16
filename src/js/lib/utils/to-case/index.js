import toCamelCase from './to-camel-case'
import toSnakeCase from './to-snake-case'
import toSpaceCase from './to-space-case'

const to = {
  camel: toCamelCase,
  snake: toSnakeCase,
  space: toSpaceCase,
}

const CASES = Object.keys(to).reduce((accumulator, CASE) => ({ ...accumulator, [CASE.toUpperCase()]: CASE }), {})

export { toCamelCase, toSnakeCase, toSpaceCase, CASES }
export default to
