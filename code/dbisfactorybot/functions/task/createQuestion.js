/**
 * Helper function for creation the question of our dynamic generated tasks. Question here is more like an instruction what to do next.
 * @param {Object} task Task object
 */
function createQuestion(task) {
  const question = {
    text: task.name,
    quick_replies: [
      {
        title: "Next",
        payload: "next"
      },
      {
        title: "Previous",
        payload: "previous",
      },
      {
        title: "Abort",
        payload: "cancel"
      },
      {
        title: "Documentation",
        payload: "help"
      }
    ]
  };
  return question;
}
exports.createQuestion = createQuestion;