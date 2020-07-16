const fetch = require("node-fetch");
/**
 * Function for backend request. Returns all available processes as a list. (json)
 */
function getAllProcesses() {
  return fetch("http://localhost:4000/processes/")
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
exports.getAllProcesses = getAllProcesses;