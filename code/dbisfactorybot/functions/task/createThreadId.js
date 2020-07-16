/**
 * Helper function for creating the thread_id which we need to jump between different questions/messages.
 * @param {Object} task
 */
function createThreadId(task) {
  return task.id;
}
exports.createThreadId = createThreadId;