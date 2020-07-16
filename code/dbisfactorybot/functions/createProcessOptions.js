/**
 * Helper function for creating quick replies if a process includes multiple processes.
 */
function createProcessOptions(processes) {
  var quick_replies = [];
  processes.forEach(process => {
    var reply = {
      title: process.processInformation.name,
      payload: process.processInformation.id,
    }
    quick_replies.push(reply);
  });
  const cancel = {
    title: "Cancel",
    payload: "cancel"
  }
  quick_replies.push(cancel);
  return quick_replies;
}

exports.createProcessOptions = createProcessOptions;