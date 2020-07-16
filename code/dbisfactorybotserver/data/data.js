// Generating of Mock Data for the chatbot to use.

// Example Data Schema
const exampleData = {
  station: "Furnance",
  maintenance: {
    required: false,
    last: new Date(Date.now()).toLocaleDateString(),
    next: new Date(Date.now()).toLocaleDateString(),
    documentation: "Furnance Maintennace"
  },
  status: {
    ts: new Date(Date.now()).toLocaleDateString(),
    station: "FUR",
    variable: "abc",
    value: Math.floor(Math.random() * (100 - 1) + 1)
  }
};

const stationValues = {
  0: "FUR",
  1: "SL",
  2: "VG",
  3: "HR"
};

const sensorVariable = {
  0: "SensorA",
  1: "SensorB",
  2: "SensorC",
  3: "SensorD"
};

/**
 * Helper function for generating a random data example based on the values above.
 * @returns Object (Take a look at exampleData in this file)
 * @param i Current counter of the loop.
 */
function generateRandomData(i) {
  // Generate Station Type
  const st_values = Object.values(stationValues);

  // For compelte random stations use the following implementation
  // const stationName = st_values[parseInt(Math.random() * (4 - 0) + 0)];

  // Otherwise use the count variable i to assure that all stations are created atleast once.
  const stationName = st_values[i];

  // Generate maintenance object
  const required = Math.random() >= 0.5;
  const last = new Date(Date.now()).toLocaleDateString();
  const next = new Date(Date.now()).toLocaleDateString();
  const documentation = stationName + " Maintenace";

  // Generate status
  const ts = new Date(Date.now()).toLocaleDateString();
  const se_values = Object.values(sensorVariable);
  const variable = se_values[parseInt(Math.random() * (4 - 0) + 0)];
  const value = Math.floor(Math.random() * (100 - 1) + 1);

  // Return mock data object filled with random values
  return (mockData = {
    station: stationName,
    maintenance: {
      required: required,
      last: last,
      next: next,
      documentation: documentation
    },
    status: {
      ts: ts,
      station: stationName,
      variable: variable,
      value: value
    }
  });
}

/**
 * Creates new datasets until max amount is reached.
 * @param {int} max The number of datasets you want to generate
 */
function generateDataSet(max) {
  const data = [];
  var i = 0;
  while (i < max) {
    data.push(generateRandomData(i));
    i++;
  }
  return data;
}

exports.generateDataSet = generateDataSet;
