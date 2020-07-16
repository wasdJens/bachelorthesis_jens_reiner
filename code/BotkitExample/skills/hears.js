module.exports = function(controller) {

  /**
   * Patterns on which the bot should listen for.
   */
  controller.hears('Hello world',  'message_received', function(bot, message) {
    bot.reply(message, 'Hello world!');
  });

  controller.hears(['hi','hello','howdy','hey','aloha','hola','bonjour','oi'],['message_received'],function(bot,message) {
    bot.reply(message,'Oh hai!');
  });
}