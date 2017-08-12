const execSync = require('child_process').execSync

function getProcesses (command) {
  const lsofOutput = execSync(`lsof -i -P -n | grep '${command}.*:[0-9]* (LISTEN)' | cat`, {encoding: 'utf-8'})
    .toString()
    .split('\n')

  const processesArray = []
  lsofOutput.forEach((lsofString) => {
    return lsofString
      ? processesArray.push(createProcessObjectFromLsof(lsofString))
      : ''
  })

  return processesArray
}

function createProcessObjectFromLsof (lsofString) {
  const processInfoArray = splitWords(lsofString)
  /* Expects array with: 0. COMMAND, 1. PID, 2. USER, 3. FD, 4. TYPE, 5. DEVICE,
    6. SIZE/OFF, 7. NODE, 8. NAME (ex: *:4200 (LISTEN) )
  */
  const pid = processInfoArray[1]
  return processInfoArray ? {
    'command': processInfoArray[0],
    pid,
    'port': (/:([0-9]*)/).exec(processInfoArray[8])[1],
    'invokingCommand': getInvokingCommand(pid)
  } : {}
}

function getInvokingCommand (pid) {
  return execSync(`ps -o command= -p ${pid} | cat`, {encoding: 'utf-8'}).replace(/\s*$/g, '')
}

function splitWords (string) {
  const splitWordRegex = new RegExp(/(\S+)/g)
  return string.match(splitWordRegex)
}

function killProcesses (pids) {
  if (Array.isArray(pids)) {
    return execSync(`kill -9 ${pids.join(' ')} | cat`)
  } else if (typeof pids === 'string') {
    return execSync(`kill -9 ${pids} | cat`)
  }
}

function processInfo (commands) {
  const processInfoObject = {}
  if (Array.isArray(commands)) {
    commands.forEach((command) => {
      processInfoObject[command] = getProcesses(command)
    })
  } else if (typeof commands === 'string') {
    processInfoObject[commands] = getProcesses(commands)
  }
  return processInfoObject
}

module.exports = processInfo
module.exports.kill = killProcesses
