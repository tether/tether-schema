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

module.exports = function (schema, validator, mixins) {
  const obj = messages(schema, mixins)
  return (name, arg) => {
    const result = {}
    const message = obj[name]
    Object.keys(message)
      .map(key => {
        const validate = validator && validator[key]
        const value = message[key](arg[key])
        if (validate && !validate(value)) throw new Error(`field ${key} is malformatted`)
        if (value) result[key] = value
      })
    return result
  }
}


/**
 * Parse messages from schema txt.
 *
 * @param {String} schema
 * @param {Object} mixins
 * @return {Object}
 * @api private
 */

function messages (schema, mixins) {
  const result = {}
  const obj = protocol(schema)
  obj.messages.map(message => {
    result[message.name] = fields(message.fields, mixins)
  })
  return result
}


/**
 * Parse fields from schema messages.
 *
 * @param {Array} arr
 * @param {Object} mixins
 * @return {Object}
 * @api private
 */

function fields (arr, mixins) {
  const result = {}
  arr.map(item => {
    const field = item.name
    const mixin = item.options.mixin
    const type = item.type
    result[field] = function (value) {
      if (item.required && value == null) throw new ReferenceError(`field ${field} is not defined`)
      if (value && typeof value !== type) throw new TypeError(`field ${field} is not a ${type}`)
      return mixin
        ? mixins[mixin](value)
        : value
    }
  })
  return result
}
