/**
 * Helper function for fast creation of messages. thread_id must be provieded seperatly.
 * @param {String} msg The text you want to be displayed
 * @param {String} action [undefined] - Botkit quick action
 * @param {[]} quickReplies  [undefined] - Botkit quick replies
 */
function createMessage(msg, action, quickReplies) {
  const message = {
    text: msg ? msg : null,
    action: action ? action : null,
    quick_replies: quickReplies ? quickReplies : null
  };
  return message;
}
exports.createMessage = createMessage;