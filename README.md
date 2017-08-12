# listening-processes [![Build Status](https://travis-ci.org/matthewgonzalez/listening-processes.svg?branch=master)](https://travis-ci.org/matthewgonzalez/listening-processes)

> Dependency-free, platform-aware, DNS-clearing library.

## Install

```sh
$ npm install --save listening-processes
```

## Usage

```js
const processes = require('listening-processes')
processes('node') // returns array of all Listening Processes with command of `node`
  /* Array output resembles the following:
    node: {
      [ command: 'node',
        pid: '581',
        port: '20559',
        invokingCommand: 'pow' ],
      [ command: 'node',
        pid: '642',
        port: '4200',
        invokingCommand: 'ember server' ]
    }
  */
processes(['node', 'ruby']) // same as above but returns results for each command in the array
processes.kill('581') // kills process at PID=581
processes.kill(['581', '642']) // kills processes at all PIDs in the array
```

## License

MIT © [Matthew Gonzalez](https://www.matthewgonzalez.me)
