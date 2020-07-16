const { createThreadId } = require("../functions/task/createThreadId");
const {
  createDocumentation
} = require("../functions/task/createDocumentation");
const { createPattern } = require("../functions/task/createPattern");
const { createQuestion } = require("../functions/task/createQuestion");
const { getStartTask } = require("../functions/task/getStartTask");
const { getSpecificProcess } = require("../functions/getSpecificProcess");
const { getAllProcesses } = require("../functions/getAllProcesses");
const { createProcessSelect } = require("../functions/createProcessSelect");
const { createDefaultReplies } = require("../functions/createDefaultReplies");
const { createMessage } = require("../functions/createMessage");
const {
  createGatewayQuestion
} = require("../functions/gateway/createGatewayQuestion");
const {
  createGatewayPattern
} = require("../functions/gateway/createGatewayPattern");
const { taskSelection } = require("../functions/task/taskSelection");

module.exports = async function(controller) {
  // Retrieve a list of all availalbe processes first
  var allProcesses = await getAllProcesses();

  controller.on(["inactive"], (bot, message) => {
    bot.createConversation(message, function(err, convo) {
      // Conversation end
      convo.addMessage(
        createMessage("Okay.", null, null),
        "cancel_maintenance"
      );
      // Bot did not understand the selection of a process
      convo.addMessage(
        createMessage(
          "Sorry I did not understand you",
          "start_maintenance",
          null
        ),
        "bad_response"
      );
      // Bot crashed somewhere
      convo.addMessage(
        createMessage("Sorry something went wrong on my end", null, null),
        "error"
      );
      // Bot could not find the process on the rest-api
      convo.addMessage(
        createMessage(
          "Sorry I could not find the process",
          "select_maintenance",
          null
        ),
        "no_process"
      );
      // First question the bot asks - default thread
      convo.addMessage(
        createMessage(
          "For which process would you like to start the maintenance?",
          "select_maintenance",
          null
        ),
        "default"
      );

      // Create a selection for all available processes and let the user select one to start
      // Warning! The default callback always searches whatever the user typed in. Even if it is no process
      convo.addQuestion(
        createMessage(
          "Select or type the name of the process",
          null,
          createProcessSelect(allProcesses)
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
              if (allProcesses.includes(response.text)) {
                convo.gotoThread("maintenance");
              } else {
                convo.gotoThread("no_process");
              }
            }
          }
        ],
        { key: "selection" },
        "select_maintenance"
      );

      /**
       * Dynamic Generation of a conversation flow based on the process
       * 1. Get the selected process from the rest-api
       * 2. Check that the process actually exists
       * 3. Check if the process includes multiple process (Another selection needed)
       * 4. Create the conversation threads for the tasks inside the process
       * 5. Create the conversation threads for the gateways inside the process
       * 6. Create documentation for each tasks
       * 7. Get the start task/gateway and jump to the thread_id
       * Afterwards the whole conversation flow based on the process is created and with the help of
       * the thread_ids the user can navigate through the process
       */
      convo.beforeThread("maintenance", async function(convo, next) {
        // Get the specific process from the server
        var selection = convo.extractResponse("selection");
        const processes = await getSpecificProcess(selection);

        // Check if something went wrong while getting the specific process
        if (typeof processes === undefined) {
          console.log("Process could not be retrieved by botkit");
          convo.gotoThread("error");
        } else {
          processes.forEach(process => {
            /**
             * Creation of tasks and their documentation
             */
            if (process.tasks) {
              // Create conversation flow for each task
              process.tasks.forEach(task => {
                return convo.addQuestion(
                  createQuestion(task),
                  createPattern(task, process),
                  {},
                  createThreadId(task)
                );
              });
              // Create documentation messages for each task
              process.tasks.forEach(task => {
                const doc = createDocumentation(task);
                return convo.addMessage(
                  {
                    text: doc.msg,
                    quick_replies: doc.quick_replies,
                    action: doc.return_id
                  },
                  doc.thread_id
                );
              });
            } else {
              console.log("No tasks for this process");
            }

            // Create gateways
            if (process.gateways) {
              process.gateways.forEach(gateway => {
                return convo.addQuestion(
                  createGatewayQuestion(gateway, process),
                  createGatewayPattern(gateway, process),
                  {},
                  createThreadId(gateway)
                );
              });
            } else {
              console.log("No gateways for this process");
            }
            // Check if the selected process includes more than one process
            if (processes.length > 1) {
              // Add a new variable which holds the process with multiple elements.
              taskSelection(processes, convo);
              convo.gotoThread("multiple_processes");
              // If not simply create conversation flow
            } else {
              // Get the first task and start the process
              const startTask = getStartTask(process);
              if (startTask === undefined) {
                convo.gotoThread("error");
              } else {
                convo.gotoThread(startTask.id);
              }
            }
          });
        }
      });

      // Create a case for completion of a process and if the user would like to start another process
      convo.addQuestion(
        createMessage(
          "You have completed the process. \n Would you like to start another process?",
          null,
          createDefaultReplies()
        ),
        [
          {
            pattern: ["Yes"],
            callback: function(response, convo) {
              convo.gotoThread("select_maintenance");
            }
          },
          {
            pattern: ["No"],
            callback: function(response, convo) {
              convo.gotoThread("cancel_maintenance");
            }
          },
          {
            pattern: ["Maintenance - cancel"],
            callback: function(response, convo) {
              convo.gotoThread("cancel_maintenance");
            }
          }
        ],
        {},
        "continue"
      );

      // Init the conversation object.
      convo.activate();
    });
  });
};
