module.exports = function(controller) {
  controller.hears("file example", "message_received", function(bot, message) {
    var reply = {
      text: 'A random picture of a goat!',
      files: [
        {
          url: "http://placegoat.com/200/200",
          image: true
        }
      ]
    }
    bot.reply(message, reply);
  });
};
