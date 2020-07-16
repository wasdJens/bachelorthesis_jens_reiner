const fetch = require("node-fetch");

function getAllStations() {
  return fetch("http://localhost:4000/stations")
    .then(response => {
      return response.json();
    })
    .then(json => {
      return json;
    })
    .catch(error => {
      console.log(error);
    });
}

exports.getAllStations = getAllStations;

function getData(max) {
  return fetch("http://localhost:4000/data?max=" + max)
    .then(response => {
      return response.json();
    })
    .then(json => {
      return json;
    })
    .catch(error => {
      console.log(error);
    });
}

exports.getData = getData;
