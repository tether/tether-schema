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
  console.log(obj)
  return (name, arg) => {
    const message = obj[name]
    Object.keys(message)
      .map(key => {
        message[key](arg[key])
      })
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
      if(item.required && value == null) throw new ReferenceError(`field ${field} is not defined`)
      if (typeof value !== type) throw new TypeError(`field ${field} is not a ${type}`)
    }
  })
  return result
}
