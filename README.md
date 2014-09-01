# jsonclone [![Build Status](https://secure.travis-ci.org/svoeller99/jsonclone.png?branch=master)](http://travis-ci.org/svoeller99/jsonclone)

> library to allow jsonification of objects with behavior preserved via a simple metadata system.


## Getting Started

Install the module with: `npm install jsonclone`

```js
var jsonclone = require('jsonclone');

var jsonString = jsonclone.stringify(yourObject); // json representation with functions encoded
var clone = jsonclone.parse(jsonString);          // clone with functions intact

clone = jsonclone.clone(yourObject);              // clone shortcut
```


## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com).


## License

Copyright (c) 2014 sean voeller  
Licensed under the MIT license.
