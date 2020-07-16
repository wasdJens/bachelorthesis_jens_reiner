const fetch = require("node-fetch");
/**
 * Function for backend request. Needs a specific process and returns the whole process object with its information
 * @param {string} process
 */
function getSpecificProcess(process) {
  return fetch("http://localhost:4000/process?name=" + process)
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
exports.getSpecificProcess = getSpecificProcess;