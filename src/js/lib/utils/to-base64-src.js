/**
 * Transform source string to base64 src with format for image src.
 *
 * @param {string[jpg|jpeg|png]} format
 * @param {string} source
 * @param {{ isDeep: boolean, exclude: (string[]|RegExp[]) }} options
 * @return {Object}
 */
function toBase64Src (source, format = 'jpg') {
  return `data:image/${format};base64,${source}`
}

export default toBase64Src
