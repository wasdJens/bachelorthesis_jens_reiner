const { getData, getAllStations } = require("../functions/requests");

module.exports = async function(controller) {
  var stations = await getAllStations();

  // Get data from the virtual factory.
  var mockData = await getData(4);
  console.log("Mock Data log: ");
  console.log(mockData);

  /**
   * Trigger for the intent machine-status
   */
  controller.on(["machine-status"], (bot, message) => {
    var entity = message.entities;

    if (entity.Stations === stations.FUR) {
      console.log("Station is FUR");
      printStatusResult(bot, message, stations.FUR, mockData);
    } else if (entity.Stations === stations.SL) {
      console.log("Station is SL");
      printStatusResult(bot, message, stations.SL, mockData);
    } else if (entity.Stations === stations.VG) {
      console.log("Station is VG");
      printStatusResult(bot, message, stations.VG, mockData);
    } else if (entity.Stations === stations.HR) {
      console.log("Station is HR");
      printStatusResult(bot, message, stations.HR, mockData);
    } else if (entity.Stations === "") {
      console.log("No station found");
      bot.reply(message, "Sorry could not find the station");
      bot.createConversation(message, function(err, convo) {
        printStations(stations, convo);
        convo.activate();
      });
    }
  });

  /**
   * Helper function for printing the status of a station.
   * @param {Object} bot The bot instance
   * @param {Object} message The message instance
   * @param {String} station The station name
   */
  function printStatusResult(bot, message, station) {
    bot.createConversation(message, function(err, convo) {
      mockData.forEach(element => {
        if (element.station === station) {
          convo.say(`Status of the station ${station}:`);
          convo.say(`Timestamp: ${element.status.ts}`);
          convo.say(`Variable: ${element.status.variable}`);
          convo.say(`Value: ${element.status.value}`);
        }
      });
      convo.activate();
    });
  }

  /**
   * Helper function for printing all stations that are defined on the server.
   * @param {Object} stations Stations object
   * @param {Object} convo Botkit conversastion object
   */
  function printStations(stations, convo) {
    convo.say("I have found the following stations:");
    for (const key of Object.keys(stations)) {
      convo.say(stations[key]);
    }
  }

  /**
   * Trigger for the intent machine-maintenance
   */
  controller.on(["machine-maintenance"], (bot, message) => {
    var entity = message.entities;

    // First case: No entity was defined -> print all stations which need maintennace
    if (entity.Stations === "" && entity.Maintenance === "") {
      printNeededMaintenance(bot, message);
    }

    // Second case: the station is defined but not last or next
    else if (entity.Stations !== "" && entity.Maintenance === "") {
      printSpecificMaintenance(entity.Stations, bot, message);
    }

    // Third case: station is defined and we want to know about the next maintenances
    else if (entity.Maintenance === "next") {
      printNextMaintenance(entity.Stations, bot, message);
    } else if (entity.Maintenance === "last") {
      printLastMaintenance(entity.Stations, bot, message);
    } else {
      bot.reply("Sorry I did not understand you. Can you try it again?");
    }
  });

  /**
   * Helper function:
   * Prints all stations which require maintennace
   * @param {Object} bot Botkit bot ojbect
   * @param {Object} message Botkit message object
   */
  function printNeededMaintenance(bot, message) {
    bot.createConversation(message, function(err, convo) {
      convo.say("The following stations require maintenance:");
      mockData.forEach(element => {
        if (element.maintenance.required) {
          convo.say(`Station: ${element.station} requires maintenance`);
        }
      });
      convo.activate();
    });
  }

  /**
   * Helper function:
   * Prints all stations upcomming maintenances
   * Specific station can be named otherwise all stations are printed.
   * @param {String} station stations name - can be empty
   * @param {Object} bot Botkit bot object
   * @param {Object} message Botkit message object
   */
  function printNextMaintenance(station, bot, message) {
    bot.createConversation(message, function(err, convo) {
      if (station !== "") {
        mockData.forEach(element => {
          if (element.station === station) {
            convo.say(
              `Station: ${element.station} needs maintenance on the ${
                element.maintenance.next
              }`
            );
          }
        });
      } else {
        convo.say(`The next maintenance dates for all stations are: `);
        mockData.forEach(element => {
          convo.say(
            `Station: ${element.station} - Date: ${element.maintenance.next}`
          );
        });
      }
      convo.activate();
    });
  }

  /**
   * Prints all stations last maintnenace dates
   * Specific stations can be named otherwise all stations are printed
   * @param {Station} station stations name - can be empty
   * @param {Object} bot Botkit bot object
   * @param {Object} message Botkit message object
   */
  function printLastMaintenance(station, bot, message) {
    bot.createConversation(message, function(err, convo) {
      if (station !== "") {
        mockData.forEach(element => {
          if (element.station === station) {
            convo.say(
              `Station: ${element.station} last maintenace was on the ${
                element.maintenance.last
              }`
            );
          }
        });
      } else {
        convo.say("The latest maintenaces dates for all stations are: ");
        mockData.forEach(element => {
          convo.say(
            `Station: ${element.station} - Date: ${element.maintenance.last}`
          );
        });
      }
      convo.activate();
    });
  }

  /**
   * Helper function:
   * Is used when a specific station is defined
   * Prints if the station requires maintenance
   * Otherwise it prints the latest stations maintenace date
   * @param {String} station Stations name
   * @param {Object} bot Botkit bot object
   * @param {Object} message Botkit message object
   */
  function printSpecificMaintenance(station, bot, message) {
    bot.createConversation(message, function(err, convo) {
      mockData.forEach(element => {
        if (element.station === station) {
          if (element.maintenance.required) {
            convo.say(
              `Station ${element.station} requires maintenance right now`
            );
          } else {
            convo.say(
              `No - For station ${
                element.station
              }the last maintenace was on the ${element.maintenance.last}`
            );
          }
        } else {
          convo.stop();
        }
      });
      convo.activate();
    });
  }
};
