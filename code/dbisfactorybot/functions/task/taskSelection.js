const { createProcessOptions } = require("../createProcessOptions");
const { createMessage } = require("../createMessage");
const { getStartTask } = require("./getStartTask");

function taskSelection(processes, convo) {
  return convo.addQuestion(
    createMessage(
      "It looks like your process includes multiple processes. Which one would you like to start?",
      null,
      createProcessOptions(processes)
    ),
    [
      {
        pattern: ["Maintenance - cancel"],
        callback: function(response, convo) {
          convo.gotoThread("cancel_maintenance");
          convo.completed;
        }
      },
      {
        default: true,
        callback: function(response, convo) {
          var process;
          processes.find(element => {
            if (element.processInformation.id === response.text) {
              process = element;
            } else if (
              element.processInformation.name === response.text.trim()
            ) {
              process = element;
            }
          });
          if (process !== undefined && process !== {}) {
            const startTask = getStartTask(process);
            startTask !== undefined
              ? convo.gotoThread(startTask.id)
              : convo.gotoThread("error");
          } else {
            convo.repeat();
            convo.next();
          }
        }
      }
    ],
    { key: "select_process" },
    "multiple_processes"
  );
}

exports.taskSelection = taskSelection;
