const { returnTask } = require("./returnTask");
function getPreviousTask(outgoing, process) {
  let previousTask = {};
  process.sequenceFlow.find(element => {
    if (element.id === outgoing) {
      if (element.sourceRef === process.startEvent.id) {
        return (previousTask = {});
      }
      else {
        return (previousTask = returnTask(element.sourceRef, process));
      }
    }
    else {
      return (previousTask = undefined);
    }
  });
  return previousTask;
}
exports.getPreviousTask = getPreviousTask;