/**
 * Dependencies.
 */

const protocol = require('protocol-buffers-schema').parse


/**
 * Create schema from protocol buffer file.
 *
 * Examples:
 *
 *  const validate = schema(`
 *    message User {
 *      required string email = 1;
 *    }
 *  `)
 *
 *   valiate('User', {
 *     email: 'foo@bar.com'
 *   })
 *
 * @param {String} schema
 * @return {Function}
 * @api public
 */

module.exports = function (schema) {
  const obj = messages(schema)
  return (name, arg) => {
    const result = {}
    const message = obj[name]
    Object.keys(message)
      .map(key => {
        const value = message[key](arg[key])
        if (value) result[key] = value
      })
    return result
  }
}

/**
 * Parse messages from schema txt.
 *
 * @param {String} schema
 * @return {Object}
 * @api private
 */

function messages (schema) {
  const result = {}
  const obj = protocol(schema)
  obj.messages.map(message => {
    result[message.name] = fields(message.fields)
  })
  return result
}


/**
 * Parse fields from schema messages.
 *
 * @param {Array} arr
 * @return {Object}
 * @api private
 */

function fields (arr) {
  const result = {}
  arr.map(item => {
    const field = item.name
    const type = item.type
    result[field] = function (value) {
      if (item.required && value == null) throw new ReferenceError(`field ${field} is not defined`)
      if (value && typeof value !== type) throw new TypeError(`field ${field} is not a ${type}`)
      return value
    }
  })
  return result
}
