/**
 * Helper function for returning a specific task
 * @param {string} id The tasks ID
 * @param {Object} process The process object (returned by `getSpecificProcess()`)
 * @returns {Object} task || undefined
 */
function returnTask(id, process) {
  // First search inside the tasks for the next one
  const task = process.tasks.find(task => {
    if (task.id === id) {
      return task;
    }
    else {
      return undefined;
    }
  });
  // If it is not found inside the tasks array search inside the gateway array
  if (task === undefined) {
    const gateway = process.gateways.find(gateway => {
      if (gateway.id === id) {
        return gateway;
      }
      else {
        return undefined
      }
    })
    return gateway
  } else {
    return task;
  }
}
exports.returnTask = returnTask;