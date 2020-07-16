var fs = require("fs");
const { cutFileFormat } = require("./../common/cutFileFormat");

//createFormat();
function createFormat() {
  fs.readdirSync(__dirname + "/converted/").forEach(file => {
    if (file.toString() === ".DS_Store") {
      console.log("found .DS file - skipping");
    } else {
      // Read the converted json file
      var obj = require("./converted/" + file);
      var processes = [];

      if (Array.isArray(obj.definitions.process)) {
        obj.definitions.process.forEach(pro => {
          const p = createProcessObject(pro);
          processes.push(p);
        });
      } else {
        const p = createProcessObject(obj.definitions.process);
        processes.push(p);
      }
      writeFile(processes, cutFileFormat(file));
    }
  });
}

exports.createFormat = createFormat;

/**
 * Returns the process object in a better format without meta informations
 * @param {{}} obj The process object inside the xml file
 */
function createProcessObject(obj) {
  // Create new json objects
  var tasks = parseTasks(obj);
  var startEvent = parseStartEvent(obj);
  var endEvent = parseEndEvent(obj);
  var processInformation = parseProcessInformation(obj);
  var sequenceFlow = parseSequenceFlow(obj);
  if (obj.inclusiveGateway || obj.exclusiveGateway) {
    var gateways = parseGateway(obj);
  }

  // merge each object into a single object
  const process = {
    processInformation,
    startEvent,
    endEvent,
    sequenceFlow,
    tasks,
    gateways
  };
  // Return the new process object which is now in the format the bot can understand and work with.
  return process;
}

/**
 * Helper function
 * @param {Obj} process the converted process object
 * @param {String} name the name of the output file
 */
function writeFile(process, name) {
  // Create a new file which is now in the custom process format - needed by the chatbot
  fs.writeFile(
    __dirname + "/output/" + name + ".json",
    JSON.stringify(process),
    "utf8",
    err => {
      if (err) {
        return console.error(err);
      }
      console.log("[Format] " + "Created a new process: " + name);
    }
  );
}

/**
 * Function to extract the task definitons
 */
function parseTasks(obj) {
  // Variable to hold all tasks
  let tasks = [];

  // Loop through our json file and each task. Create a new task object.
  obj.task.forEach(element => {
    // Create an empty task object
    let task = {};
    // Read attributes
    if (element._attributes) {
      const id = element._attributes.id;
      const name = element._attributes.name;
      const completionQuantity = element._attributes.completionQuantity;
      const startQuantity = element._attributes.startQuantity;
      const isForCompensation = element._attributes.isForCompensation;

      // Fill the task object with the obtained information
      task = {
        isGateway: false,
        id,
        name,
        completionQuantity,
        startQuantity,
        isForCompensation
      };
    }
    // Read documentation
    if (element.documentation) {
      const documentation = {
        id: element.documentation._attributes.id,
        text: element.documentation._text ? element.documentation._text : ""
      };

      // Fill the task object with the obtained information
      task = { ...task, documentation };
    }
    // Read incoming
    if (element.incoming) {
      const incoming = element.incoming._text;

      // Fill the task object with the obtained information
      task = { ...task, incoming };
    }
    // Read outgoing
    if (element.outgoing) {
      const outgoing = element.outgoing._text;

      // Fill the task object with the obtained information
      task = { ...task, outgoing };
    }

    // Add each task to our tasks array.
    tasks.push(task);
  });
  // Return all tasks
  return tasks;
}

/**
 * Function to extract the start event of the process
 */
function parseStartEvent(obj) {
  const startEvent = {
    id: obj.startEvent._attributes.id,
    outgoing: obj.startEvent.outgoing._text
  };

  return startEvent;
}

/**
 * Function to extract the end event of the process
 */
function parseEndEvent(obj) {
  const endEvent = {
    id: obj.endEvent._attributes.id,
    incoming: obj.endEvent.incoming._text
  };

  return endEvent;
}

/**
 * Function to extract the process id
 */
function parseProcessInformation(obj) {
  const processInformation = {
    id: obj._attributes.id,
    name: obj._attributes.name ? obj._attributes.name : ""
  };

  return processInformation;
}

function parseSequenceFlow(obj) {
  let sequenceFlow = [];

  obj.sequenceFlow.forEach(element => {
    const sequence = {
      id: element._attributes.id,
      sourceRef: element._attributes.sourceRef,
      targetRef: element._attributes.targetRef,
      name: element._attributes.name ? element._attributes.name : ""
    };
    sequenceFlow.push(sequence);
  });

  return sequenceFlow;
}

function parseGateway(obj) {
  let gateways = [];

  if (obj.inclusiveGateway) {
    obj.inclusiveGateway.forEach(element => {
      let gateway = { isGateway: true };

      if (element._attributes) {
        const id = element._attributes.id;
        let name;
        if (element._attributes.name) {
          name = element._attributes.name;
        } else {
          name = "";
        }

        gateway = { ...gateway, id, name };
      }
      if (element.incoming) {
        if (Array.isArray(element.incoming)) {
          let incoming = [];
          element.incoming.forEach(text => {
            incoming.push({ text: text._text });
          });
          gateway = { ...gateway, incoming };
        } else {
          const incoming = element.incoming._text;
          gateway = { ...gateway, incoming };
        }
      }
      if (element.outgoing) {
        if (Array.isArray(element.outgoing)) {
          let outgoing = [];
          element.outgoing.forEach(text => {
            outgoing.push({ text: text._text });
          });
          gateway = { ...gateway, outgoing };
        } else {
          const outgoing = element.outgoing._text;
          gateway = { ...gateway, outgoing };
        }
      }

      gateways.push(gateway);
    });
  }

  if (obj.exclusiveGateway) {
    obj.exclusiveGateway.forEach(element => {
      let gateway = { isGateway: true };

      if (element._attributes) {
        const id = element._attributes.id;
        let name;
        if (element._attributes.name) {
          name = element._attributes.name;
        } else {
          name = "";
        }

        gateway = { ...gateway, id, name };
      }
      if (element.incoming) {
        if (Array.isArray(element.incoming)) {
          let incoming = [];
          element.incoming.forEach(text => {
            incoming.push({ text: text._text });
          });
          gateway = { ...gateway, incoming };
        } else {
          const incoming = element.incoming._text;
          gateway = { ...gateway, incoming };
        }
      }
      if (element.outgoing) {
        if (Array.isArray(element.outgoing)) {
          let outgoing = [];
          element.outgoing.forEach(text => {
            outgoing.push({ text: text._text });
          });
          gateway = { ...gateway, outgoing };
        } else {
          const outgoing = element.outgoing._text;
          gateway = { ...gateway, outgoing };
        }
      }

      gateways.push(gateway);
    });
  }

  return gateways;
}
