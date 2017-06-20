
/**
 * Test dependencies.
 */

const test = require('tape')
const protocol = require('..')

test('should trigger ReferenceError if field does not exist', assert => {
  assert.plan(2)
  const schema = protocol(`
    message User {
      required string email = 1;
    }
  `)

  try {
    schema('User', {})
  } catch (e) {
    assert.equal(e.name, 'ReferenceError')
    assert.equal(e.message, 'field email is not defined')
  }
})


test('should trigger TypeError if field exist but wrong type', assert => {
  assert.plan(2)
  const schema = protocol(`
    message User {
      required string email = 1;
    }
  `)

  try {
    schema('User', {
      email: true
    })
  } catch (e) {
    assert.equal(e.name, 'TypeError')
    assert.equal(e.message, 'field email is not a string')
  }
})


test('should return object if validated', assert => {
  assert.plan(1)
  const obj = {
    email: 'olivier.wietrich@gmail.com'
  }
  const schema = protocol(`
    message User {
      required string email = 1;
    }
  `)
  const result = schema('User', Object.assign({}, obj))
  assert.deepEqual(result, obj)
})
