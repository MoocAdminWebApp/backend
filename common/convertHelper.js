/**
 * Convert string to boolean value
 * @param {*} str
 * @returns
 */
function stringToBoolean(str) {
  if (typeof str === "boolean") return str;
  if (typeof str !== "string") return false;
  return str.toLowerCase() === "true";
}

/**
 * Obtain file extension based on base64 prefix
 * For example: data:image/png; base64,  Will return. png
 * @param {*} base64String 
 * @returns 
 */
function getBase64Extension(base64String) {
  //Regular expressions are used to match MIME types in Base64 prefixes
  const match = base64String.match(/^data:(image\/([a-zA-Z]+));base64,/);

  if (match && match.length > 2) {
    const mimeType = match[1]; //The complete MIME type, such as "image/jpeg"
    const extension = match[2]; //Only the file type section, such as' JPEG '

    //Return the lowercase file extension
    return `.${extension.toLowerCase()}`;
  }
 
  return ".png";
}
module.exports = { stringToBoolean, getBase64Extension };
