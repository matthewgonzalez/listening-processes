const execSync = require('child_process').execSync

function getProcesses (command) {
  const lsofOutput = execSync(`lsof -i TCP -P -n | grep '${command}\\s.*:[0-9]* (LISTEN)' | cat`, {encoding: 'utf-8'})
    .toString()
    .split('\n')
  const processesObject = {}
  lsofOutput.forEach((lsofString) => {
    if (lsofString) {
      const currentProcessObject = createProcessObjectFromLsof(lsofString)
      const command = currentProcessObject.command
      processesObject[command] = processesObject[command] || []
      processesObject[command].push(currentProcessObject)
    }
  })
  return processesObject
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

function killAtPID (pid) {
  try {
    execSync(`kill -9 ${pid}`)
    return 'success'
  } catch (e) {
    return 'fail'
  }
}

function killProcesses (pids) {
  var results = { success: [], fail: [] }
  if (Array.isArray(pids)) {
    pids.forEach((pid) => {
      results[killAtPID(pid)].push(pid)
    })
  } else if (typeof pids === 'string' || typeof pids === 'number') {
    results[killAtPID(pids)].push(pids)
  }
  return results
}

function processInfo (commands) {
  var processInfoObject = {}
  if (Array.isArray(commands)) {
    commands.forEach((command) => {
      processInfoObject = Object.assign(processInfoObject, getProcesses(command))
    })
  } else if (typeof commands === 'string') {
    processInfoObject = getProcesses(commands)
  } else if (typeof commands === 'undefined') {
    processInfoObject = getProcesses('')
  }
  return processInfoObject
}

module.exports = processInfo
module.exports.kill = killProcesses
