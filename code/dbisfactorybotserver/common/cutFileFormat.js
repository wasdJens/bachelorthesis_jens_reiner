/**
 * Helper function for removing the file extension of a provided file
 * Needed to create a name based on an uploaded file. 
 * @param {File} file 
 * @returns {File} file 
 */
function cutFileFormat(file) {
  return file
    .split(".")
    .slice(0, -1)
    .join(".");
}
exports.cutFileFormat = cutFileFormat;