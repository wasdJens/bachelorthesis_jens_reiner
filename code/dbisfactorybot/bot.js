var env = require('node-env-file');
env(__dirname + '/.env');

var Botkit = require('botkit');
// Middleware plugin for using Dialogflow NLU component
const dialogflowMiddleware = module.exports = require('botkit-middleware-dialogflow')({
  keyFilename: '../../../ba-jens-reiner-ws1718-222d7e74861c.json',  // service account private key file from Google Cloud Console
});

var bot_options = {
    replyWithTyping: true,
};

// Use a mongo database if specified, otherwise store in a JSON file local to the app.
// Mongo is automatically configured when deploying to Heroku
if (process.env.MONGO_URI) {
  // create a custom db access method
  var db = require(__dirname + '/components/database.js')({});
  bot_options.storage = db;
} else {
    bot_options.json_file_store = __dirname + '/.data/db/'; // store user data in a simple JSON format
}

// Create the Botkit controller, which controls all instances of the bot.
var controller = Botkit.socketbot(bot_options);
// Use dialogflow instead of local pattern matching
controller.middleware.receive.use(dialogflowMiddleware.receive);

// Change pattern matcher of botkit to dialogflow
controller.changeEars(function(patterns, message) {
  console.log("Intent is: ", message.intent);
  return  dialogflowMiddleware.hears(patterns, message);
})

// Set up an Express-powered webserver to expose oauth and webhook endpoints
var webserver = require(__dirname + '/components/express_webserver.js')(controller);

// Load in a plugin that defines the bot's identity
require(__dirname + '/components/plugin_identity.js')(controller);

// Open the web socket server
controller.openSocketServer(controller.httpserver);

// Start the bot brain in motion!!
controller.startTicking();

var normalizedPath = require("path").join(__dirname, "skills");
require("fs").readdirSync(normalizedPath).forEach(function(file) {
  require("./skills/" + file)(controller);
});

console.log('http://localhost:' + (process.env.PORT || 3000))