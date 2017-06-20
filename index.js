/**
 * Dependencies.
 */

const protocol = require('protocol-buffers-schema').parse


/**
 * This is a simple description.
 *
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


function messages (schema) {
  const result = {}
  const obj = protocol(schema)
  obj.messages.map(message => {
    result[message.name] = fields(message.fields)
  })
  return result
}


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
