/**
 * Separator splitter.
 */
const separatorSplitter = /[\W_]+(.|$)/g

/**
 * Camelcase splitter.
 */
const camelSplitter = /(.)([A-Z]+)/g

/**
 * Test whether a string is camel-case.
 */
const hasSpace = /\s/
const hasSeparator = /(_|-|\.|:)/
const hasCamel = /([a-z][A-Z]|[A-Z][a-z])/

const hasSpaces = /\s/g
const hasSpacesWithWord = /\s(\w)/g

export { separatorSplitter, camelSplitter, hasSpace, hasSeparator, hasCamel, hasSpaces, hasSpacesWithWord }
