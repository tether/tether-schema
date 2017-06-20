
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


test('should ignore optional fields in returned object if not defined', assert => {
  assert.plan(1)
  const obj = {
    email: 'olivier.wietrich@gmail.com'
  }
  const schema = protocol(`
    message User {
      required string email = 1;
      optional string name = 2;
    }
  `)

  const result = schema('User', Object.assign({}, obj))
  assert.deepEqual(result, obj)
})

test('should trigger TypeError if passed optional field is wrong type', assert =>{
  assert.plan(2)
  const schema = protocol(`
    message User {
      required string email = 1;
      optional string name = 2;
    }
  `)

  try {
    schema('User', {
      email: 'olivier.wietrich@gmail.com',
      name: true
    })
  } catch (e) {
    assert.equal(e.name, 'TypeError')
    assert.equal(e.message, 'field name is not a string')
  }
})

test('should return object with passed optional fields if validated', assert => {
  assert.plan(1)
  const obj = {
    email: 'olivier.wietrich@gmail.com',
    name: 'Olivier'
  }
  const schema = protocol(`
    message User {
      required string email = 1;
      optional string name = 2;
    }
  `)

  const result = schema('User', Object.assign({}, obj))
  assert.deepEqual(result, obj)
})

test('should trigger Error if field is not validated', assert => {
  assert.plan(2)
  const schema = protocol(`
    message User {
      required string password = 1;
    }
  `, {
    password(value) {
      return value.length > 4
    }
  })

  try {
    const result = schema('User', {
      password: 'foo'
    })
  } catch (e) {
    assert.equal(e.name, 'Error')
    assert.equal(e.message, 'field password is malformatted')
  }
})

test('should apply mixin', assert => {
  assert.plan(1)
  const schema = protocol(`
    message User {
      required string name = 1 [mixin = hello];
    }
  `, null, {
    hello(old) {
      return 'hello ' + old
    }
  })

  const result = schema('User', {
    name: 'foo'
  })
  assert.equal(result.name, 'hello foo')
})

test('should not apply mixin if does not exist', assert => {
  assert.plan(1)
  const schema = protocol(`
    message User {
      required string name = 1 [mixin = hello];
    }
  `)

  const result = schema('User', {
    name: 'foo'
  })
  assert.equal(result.name, 'foo')
})
