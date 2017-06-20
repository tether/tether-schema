
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
