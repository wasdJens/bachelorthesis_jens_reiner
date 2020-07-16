module.exports = function(controller) {
  controller.hears('Conversation',  'message_received', function(bot, message) {
    // Create a conversation 
    bot.startConversation(message, function(err, convo) {
      // Add a question we want to ask the user following their input
      convo.addQuestion('How are you?', function(response, convo) {
        // Response to the user 
        convo.say('Cool, you said: ' + response.text);
        convo.next();
      }, {}, 'default');
    });
  });

  controller.hears('Maintenance', 'message_received', function(bot, message) {
    // Create a conversation 
    bot.createConversation(message, function(err, convo) {

      // Create different paths which are choosen on the users input.
      convo.addMessage({
        text: 'Okay lets begin with the maintenance.',
      }, 'yes_thread');

      convo.addMessage({
        text: 'Okay no maintenance for now.',
      }, 'no_thread');

      convo.addMessage({
        text: 'Sorry I did not understand you',
        action: 'default',
      }, 'bad_response'),

      // Create a yes / no question 
      convo.addQuestion('Would you like to start with the maintenance', [
        {
          pattern: 'yes',
          callback: function(response, convo) {
            convo.gotoThread('yes_thread');
          },
        },
        {
          pattern: 'no',
          callback: function(response, convo) {
            convo.gotoThread('no_thread');
          },
        },
        {
          default: true,
          callback: function(response, convo) {
            convo.gotoThread('bad_response');
          },
        },
      ], {}, 'default');

      convo.activate();
    });
  });
}