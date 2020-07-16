/**
 * Helper function for creating the documentation message which some tasks may have.
 * It also generates a way to go back in the conversation flow
 * @param {Object} task
 */
function createDocumentation(task) {
  let msg = "";
  if (task.documentation) {
    if (task.documentation.text !== "") {
      msg =
        "I have found the following information about the task: \n " +
        task.documentation.text;
    }
    else {
      msg = "Sorry there is no documentation for this task";
    }
  }
  else {
    msg = "Sorry there is no documentation for this task";
  }
  const quick_replies = [];
  const reply = {
    title: "Continue",
    payload: "continue"
  };
  quick_replies.push(reply);
  const return_id = task.id;
  const thread_id = "help_" + task.id;
  return (documentation = { msg, quick_replies, return_id, thread_id });
}
exports.createDocumentation = createDocumentation;