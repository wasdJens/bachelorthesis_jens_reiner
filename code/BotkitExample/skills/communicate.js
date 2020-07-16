module.exports = function(controller) {
  /**
   * Reply to any incomming message
   */
  controller.on('message_received', function(bot, message) {
    bot.reply(message, 'I heard... something');
  });

  /**
   * Reply to direct mentions @bot hello
   */
  controller.on('direct_mention', function(bot, message) {
    bot.reply(message, 'I heard you mention me!');
  });

  /**
   * Reply to direct messages
   */
  controller.on('direct_message', function(bot, message) {
    bot.reply(message, 'You are talking directly to me');
  });
}
