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
// const { createDefaultReplies } = require("../functions/createDefaultReplies");
const { createMessage } = require("../functions/createMessage");
const {
  createGatewayQuestion
} = require("../functions/gateway/createGatewayQuestion");
const {
  createGatewayPattern
} = require("../functions/gateway/createGatewayPattern");
const { taskSelection } = require("../functions/task/taskSelection");
const { getAllStations } = require("../functions/requests");

module.exports = async function(controller) {
  // Get data
  var stations = await getAllStations();
  var allProcesses = await getAllProcesses();
  console.log(allProcesses);

  controller.on(["start-maintenance"], (bot, message) => {
    bot.reply(message, {
      text: message.fulfillment.text,
      quick_replies: [
        {
          title: "Select",
          payload: "select"
        },
        {
          title: "Resume",
          payload: "resume"
        }
      ]
    });
  });

  controller.on(["maintenance-select"], (bot, message) => {
    var entitiy = message.entities;

    if (entitiy.Stations === stations.FUR) {
      console.log("Select maintenance station: " + entitiy.Stations);
      controller.trigger("create-maintenance-conversation", [bot, message]);
    } else if (entitiy.Stations === stations.SL) {
      console.log("Select maintenance station: " + entitiy.Stations);
      controller.trigger("create-maintenance-conversation", [bot, message]);
    } else if (entitiy.Stations === stations.VG) {
      console.log("Select maintenance station: " + entitiy.Stations);
      controller.trigger("create-maintenance-conversation", [bot, message]);
    } else if (entitiy.Stations === stations.HR) {
      console.log("Select maintenance station: " + entitiy.Stations);
      controller.trigger("create-maintenance-conversation", [bot, message]);
    } else if (entitiy.Stations === "") {
      bot.reply(message, {
        text: message.fulfillment.text,
        quick_replies: createProcessSelect(allProcesses)
      });
    }
  });

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
  controller.on(["create-maintenance-conversation"], async (bot, message) => {
    // Retrieve the maintenance process based on the user input from the rest-api
    const processes = await getSpecificProcess(message.entities.Stations);
    if (processes === undefined) {
      bot.reply("Something went wrong");
    } else {
      bot.createConversation(message, function(err, convo) {
        // Abort maintenance
        convo.addMessage(
          createMessage("Okay.", null, null),
          "cancel_maintenance"
        );

        // Finish maintenance
        convo.addMessage(createMessage("You have completed the process.", null, null),
          "continue"
        );

        // Convert process into conversation 
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
        convo.activate();
      });
    }
  });
};
