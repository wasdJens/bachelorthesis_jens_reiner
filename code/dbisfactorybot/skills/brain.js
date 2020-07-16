const dialogflowMiddleware = require("../bot");

module.exports = function(controller) {
  // Intent Maintenance: 
  controller.hears(["Maintenance-Start"], "message_received", dialogflowMiddleware.hears, (bot,message) => {
    console.log("Intent -> Maintenance");
    controller.trigger("start-maintenance", [bot, message]);
  });

  // Intent Maintenance Resume
  controller.hears(["Maintenance-Resume"], "message_received", dialogflowMiddleware.hears, (bot, message) => {
    console.log("Intent -> Maintenance-Resume");
    controller.trigger("maintenance-resume", [bot, message]);
  });

  // Intent Maintenance Select
  controller.hears(["Maintenance-Select"], "message_received", dialogflowMiddleware.hears, (bot, message) => {
    console.log("Intent -> Maintenance-Select");
    controller.trigger("maintenance-select", [bot, message]);
  });

  // ---------------------------------------------------------------------------------------------------------------------
  controller.hears(["Machine-Status"], "message_received", dialogflowMiddleware.hears, (bot, message) => {
    console.log("Intent -> Machine-Status");
    controller.trigger("machine-status", [bot, message]);
  });

  controller.hears(["Machine-Maintenance"], "message_received", dialogflowMiddleware.hears, (bot, message) => {
    console.log("Intent -> Machine-Maintenance");
    controller.trigger("machine-maintenance", [bot, message]);
  });

  // ---------------------------------------------------------------------------------------------------------------------

  controller.hears(["Default Welcome Intent"], "message_received", dialogflowMiddleware.hears, (bot, message) => {
    console.log("Intent -> Default Welcome Intent");
    bot.reply(message, message.fulfillment.text);
  });

  controller.hears(["Default Help"], "message_received", dialogflowMiddleware.hears, (bot, message) => {
    console.log("Intent -> Default Help");
    bot.reply(message, message.fulfillment.text);
  });

  // ---------------------------------------------------------------------------------------------------------------------
  
  // Lifecycle logs
  controller.on('conversationStarted', function(bot, convo) {
    console.log("Conversations started with: ", convo.context.user);
  });

  controller.on('conversationEnded', function(bot, convo) {
    console.log("Conversation ended with: ", convo.context.user);
  });
}