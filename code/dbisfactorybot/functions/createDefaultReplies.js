/**
 * Helper function for creating fast quick replies with "Yes", "No", "Cancel" buttons.
 */
function createDefaultReplies() {
  return (quick_replies = [
    {
      title: "Yes",
      payload: "yes"
    },
    {
      title: "No",
      payload: "no"
    },
    {
      title: "Cancel",
      payload: "cancel"
    }
  ]);
}
exports.createDefaultReplies = createDefaultReplies;