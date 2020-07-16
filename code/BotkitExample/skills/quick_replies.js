module.exports = function(controller) {
  controller.hears("quick replies", "message_received", function(bot, message) {
    bot.reply(
      message,
      {
        text: "Would you like to start with the maintenance?",
        quick_replies: [
          {
            title: "Yes",
            payload: "yes"
          },
          {
            title: "No",
            payload: "no"
          }
        ]
      },
      function() {}
    );
  });
};
