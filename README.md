# listening-processes [![Build Status](https://travis-ci.org/matthewgonzalez/listening-processes.svg?branch=master)](https://travis-ci.org/matthewgonzalez/listening-processes)

> "A simple NPM module for retrieving pertinent info on processes which are listening on local ports, and for killing those processes using shell commands `lsof`, `ps`, and `kill` in the background."

## Install

```sh
$ npm install --save listening-processes
```

## Usage

```js
const processes = require('listening-processes')

processes(['node', 'ruby'])  // returns object of all Listening Processes for each command in array

  /* Object output resembles the following:
    {
      node: [
        { command: 'node',
          pid: '581',
          port: '20559',
          invokingCommand: 'pow' },
        { command: 'node',
          pid: '642',
          port: '4200',
          invokingCommand: 'ember server' }
      ],
      ruby: [
        { command: 'ruby',
          pid: '720',
          port: '3000',
          invokingCommand: 'rails s'
        }
      ]
    }
  */
processes('node') // same as above but returns results for the single command
processes() // same as above but returns all listening processes

processes.kill('581') // kills process at PID=581
  /*
    The `kill` method returns an object with two arrays, 'success' & 'fail', which include the PIDs of the respective results.

    Example:
    {
      success: [720, 642],
      fail: [581]
    }
  */
processes.kill(720)
processes.kill(['581', '642']) // kills processes at all PIDs in the array
processes.kill([720, 581])
```

## License

MIT © [Matthew Gonzalez](https://www.matthewgonzalez.me)
