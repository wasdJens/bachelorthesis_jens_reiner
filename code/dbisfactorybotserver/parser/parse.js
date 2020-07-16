var convert = require("xml-js");
const { cutFileFormat } = require("./../common/cutFileFormat");
var fs = require("fs");

// parseProcess();
function parseProcess() {
  fs.readdirSync(__dirname + "/processes/").forEach(file => {
    if (file.toString() === ".DS_Store") {
      console.log("found .DS file - skipping");
    } else {
      // Read the file
      var xml = fs.readFileSync(__dirname + "/processes/" + file);
      // Convert xml to json
      var json = convert.xml2json(xml, { compact: true, spaces: 4 });
      // Generate the new filename
      var name = cutFileFormat(file);
      // Save the json as a new file
      fs.writeFile(
        __dirname + "/converted/" + name + ".json",
        json,
        "utf8",
        err => {
          if (err) {
            return console.log(err);
          }
          console.log("[Parser]" + name + " was saved");
        }
      );
    }
  });
}

exports.parseProcess = parseProcess;
