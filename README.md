# Tether-Schema

[![Build Status](https://travis-ci.org/tether/tether-schema.svg?branch=master)](https://travis-ci.org/tether/tether-schema)
[![NPM](https://img.shields.io/npm/v/tether-schema.svg)](https://www.npmjs.com/package/tether-schema)
[![Downloads](https://img.shields.io/npm/dm/tether-schema.svg)](http://npm-stat.com/charts.html?package=tether-schema)
[![guidelines](https://tether.github.io/contribution-guide/badge-guidelines.svg)](https://github.com/tether/contribution-guide)

Validate your data against a custom protocol buffer syntax.
  * **validator**: Pass functions to validate and sanitize your data.

## Usage

```js
const protocol = require('tether-schema')

const schema = protocol(`
  message User {
    required string email = 1;
    required string password = 2;
  }
`, {
  password: (value) => {
    return value.length > 4
  }
})

schema('User', {
  email: 'foo@bar.com'
})
// => trigger TypeError: field password is missing

schema('User', {
  email: 'foo@bar.com',
  password: 'foo',
})
// => trigger Error: field password is malformatted


schema('User', {
  email: 'foo@bar.com',
  password: 'helloworld',
})
// => {email: 'foo@bar.com', password: 'helloworld'}
```

## Installation

```shell
npm install tether-schema --save
```

[![NPM](https://nodei.co/npm/tether-schema.png)](https://nodei.co/npm/tether-schema/)


## Question

For support, bug reports and or feature requests please make sure to read our
<a href="https://github.com/tether/contribution-guide/blob/master/community.md" target="_blank">community guidelines</a> and use the issue list of this repo and make sure it's not present yet in our reporting checklist.

## Contribution

The open source community is very important to us. If you want to participate to this repository, please make sure to read our <a href="https://github.com/tether/contribution-guide" target="_blank">guidelines</a> before making any pull request. If you have any related project, please let everyone know in our wiki.

## License

The MIT License (MIT)

Copyright (c) 2017 Tether Inc

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
