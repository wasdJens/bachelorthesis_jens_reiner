const { returnTask } = require("./returnTask");
/**
 * Helper function for findint the first task in our process.
 * @param {Object}process The process object (returned by `getSpecificProcess()`)
 */
function getStartTask(process) {
  const startEventId = process.startEvent.outgoing;
  let startTask = {};
  process.sequenceFlow.find(element => {
    if (element.id === startEventId) {
      return (startTask = returnTask(element.targetRef, process));
    }
    else {
      return undefined;
    }
  });
  return startTask;
}
exports.getStartTask = getStartTask;