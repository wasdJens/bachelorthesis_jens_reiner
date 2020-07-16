/**
 * Helper function for creating a quick reply where the user can choose from the list of available tasks without typing them.
 * @param {[]} processes
 */
function createProcessSelect(processes) {
  var quick_replies = [];
  processes.forEach(process => {
    var reply = {
      title: process,
      payload: "select " + process
    };
    quick_replies.push(reply);
  });
  const cancel = {
    title: "Cancel",
    payload: "cancel"
  };
  quick_replies.push(cancel);
  return quick_replies;
}
exports.createProcessSelect = createProcessSelect;