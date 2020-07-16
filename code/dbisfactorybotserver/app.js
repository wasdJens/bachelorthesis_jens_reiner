const { cutFileFormat } = require("./common/cutFileFormat");
const { parseProcess } = require("./parser/parse");
const { createFormat } = require("./parser/createFormat");
const { generateDataSet } = require("./data/data");

const express = require("express");

const app = express();
const port = 4000;
const fileUpload = require("express-fileupload");

var fs = require("fs");
var cors = require("cors");

app.use(express.static("public"));
app.use(fileUpload());
app.use(cors());

/**
 * File upload handler
 */
app.post("/upload", function(req, res) {
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send("No files were uploaded");
  }

  let process = req.files.process;

  if (process === undefined) {
    return res.status(500).send("Undefined file upload");
  } else {
    process.mv("./parser/processes/" + req.files.process.name, function(err) {
      if (err) {
        return res.status(500).send(err);
      }
      res.send("File uploaded!");
    });
  }
});

app.post("/parse", function(req, res) {
  try {
    parseProcess();
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
  res.send("Done parsing");
});

app.post("/convert", function(req, res) {
  try {
    createFormat();
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
  res.send("Done converting");
});

/**
 * Return all available processes
 */
app.get("/processes/", function(req, res) {
  var processes = [];
  fs.readdirSync("./parser/output/").forEach(file => {
    if (file.toString() === ".DS_Store") {
      console.log("found .DS file - skipping");
    } else {
      var name = cutFileFormat(file);
      processes.push(name);
    }
  });
  res.json(processes);
});

app.get("/data", function(req, res) {
  res.json(generateDataSet(req.query.max));
});

app.get("/stations", function(req, res) {
  const stations = {
    FUR: "FUR",
    SL: "SL",
    VG: "VG",
    HR: "HR"
  };
  res.json(stations);
});

/**
 * Return a specific process as json
 */
app.get("/process", function(req, res) {
  // fs.readdirSync("./parser/output/").forEach(file => {
  //   var name = cutFileFormat(file);
  //   if (name === req.query.name) {
  //     var process = require("./parser/output/" + file);
  //     res.json(process);
  //   }
  // });
  const stations = {
    FUR: "Furnance",
    SL: "SortingLine",
    VG: "VacuumGripper",
    HR: "HighRack"
  };

  Object.entries(stations).forEach(([key, value]) => {
    if (key === req.query.name) {
      var process = require("./parser/output/" + value + ".json");
      res.json(process);
    }
  });
});

app.listen(port, () =>
  console.log(`Chatbot server listening on port ${port}!`)
);
