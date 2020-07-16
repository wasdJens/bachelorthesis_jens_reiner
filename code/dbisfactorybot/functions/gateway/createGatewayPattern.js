const { getPreviousTask } = require("../task/getPreviousTask");
const { getNextTask } = require("../task/getNextTask");
const { returnTask } = require("../task/returnTask");

function createGatewayPattern(gateway, process) {
  const patterns = [
    {
      pattern: ["Maintenance - next"],
      callback: function(response, convo) {
        const next = getNextTask(gateway.outgoing, process);
        // Check if the getNextTask returned that there are no more tasks.
        if (next === undefined) {
          console.log("Next task is undefined");
          convo.gotoThread("error");
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
      pattern: ["Maintenance - cancel"],
      callback: function(response, convo) {
        convo.gotoThread("cancel_maintenance");
      }
    },
    {
      pattern: ["Maintenance - previous"],
      callback: function(response, convo) {
        if (Array.isArray(gateway.incoming)) {
          convo.gotoThread("error");
        } else {
          const previous = getPreviousTask(gateway.incoming, process);
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
      }
    },
    {
      default: true,
      callback: (response, convo) => {
        var nextTask;
        process.sequenceFlow.forEach(element => {
          if (element.targetRef === response.text) {
            nextTask = returnTask(element.targetRef, process);
          }
        });
        /**
         * Workaround if the user is typing Yes/No 
         */
        if (nextTask === undefined) {
          process.sequenceFlow.find(element => {
            if (
              element.sourceRef === gateway.id &&
              element.name === response.text.trim()
            ) {
              nextTask = returnTask(element.targetRef, process);
            }
          });
        }
        if (nextTask !== undefined) {
          convo.gotoThread(nextTask.id);
        } else {
          // sayFirst does not seem to work with the current Botkit version.
          // convo.sayFirst("Can you repeat that please?");
          // convo.next();
          convo.repeat();
          convo.next();
        }
      }
    }
  ];

  return patterns;
}

exports.createGatewayPattern = createGatewayPattern;
