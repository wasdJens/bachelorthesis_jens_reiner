const { getPreviousTask } = require("./getPreviousTask");
const { getNextTask } = require("./getNextTask");
/**
 * Helper function for creating the pattern matching of the task instructions.
 * @param {Object} task
 * @param {Object} process The process object (returned by `getSpecificProcess()`)
 */
function createPattern(task, process) {
  const patterns = [
    {
      pattern: ["Maintenance - next"],
      callback: function(response, convo) {
        const next = getNextTask(task.outgoing, process);
        // Check if the getNextTask returned that there are no more tasks.
        if (next === undefined) {
          console.log("Next task is undefined");
          convo.gotoThread("error")
        } else {
          if (Object.keys(next).length === 0) {
            convo.gotoThread("continue");
          } else {
            convo.gotoThread(next.id);
          }
        }
      }
    },
    {
      pattern: ["Maintenance - previous"],
      callback: function(response, convo) {
        const previous = getPreviousTask(task.incoming, process);
        if (previous === undefined) {
          convo.gotoThread("error");
        } else if (Object.keys(previous).length === 0) {
          convo.transitionTo(
            "select_maintenance",
            "There is no task before that"
          );
        } else {
          convo.gotoThread(previous.id);
        }
      }
    },
    {
      pattern: ["Maintenance - cancel"],
      callback: function(response, convo) {
        convo.gotoThread("cancel_maintenance");
      }
    },
    {
      pattern: ["Maintenance - help"],
      callback: function(response, convo) {
        convo.gotoThread("help_" + task.id);
      }
    },
    {
      default: true,
      callback: (response, convo) => {
        convo.repeat();
        convo.next();
      }
    }
  ];
  return patterns;
}
exports.createPattern = createPattern;
