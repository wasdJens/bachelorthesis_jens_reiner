const { returnTask } = require("./returnTask");
/**
 * Helper function for finding the next task inside the sequenceFlow array.
 * Also checks if the sequence is complete. If so it returns an empty object.
 * If it finds another task it returns the next task as object
 * If it cannot find anything it returns undefined
 * @param {string} outgoing The id that is provided inside our task object
 * @param {Object} process The process object (returned by `getSpecificProcess()`)
 */
function getNextTask(outgoing, process) {
  let nextTask = {};
  process.sequenceFlow.find(element => {
    if (element.id === outgoing) {
      if (element.targetRef === process.endEvent.id) {
        return (nextTask = {});
      }
      else {
        return (nextTask = returnTask(element.targetRef, process));
      }
    }
    else {
      return (nextTask = undefined);
    }
  });
  return nextTask;
}
exports.getNextTask = getNextTask;