const { Menu } = require("../models");

const titlePattern = /^[A-Za-z0-9 ]+$/;

const MenuValidator = async data => {
  const validTypes = ["DIRECTORY", "MENU", "BUTTON"];
  const validStatuses = ["ACTIVE", "INACTIVE", "DRAFT", "ARCHIVED"];
  /**
   * Title field should satisfy:
   * 1) is a non-null string
   * 2) only contains letters, space, and numbers
   * 3) no longer than 50 characters
   */
  const isValidTitle = title =>
    typeof title === "string" &&
    title.trim() !== "" &&
    titlePattern.test(title) &&
    title.length <= 50;

  /**
   * Type field should satisfy:
   * 1) is a non-null string
   * 2) should belong to one of the existing type
   */
  const isValidType = type => !!type && validTypes.includes(type);

  /**
   * Status field should satisfy:
   * 1) is a non-null string
   * 2) should belong to one of the existing status value
   */
  const isValidStatus = status => !!status && validStatuses.includes(status);

  /**
   * Comment field should be no longer than 255 characters
   */
  const isValidComment = comment => comment == null || comment.length <= 255;

  // TODO: edit the following validations after implementing frontend
  // const isValidPath =
  // const isValidComponent =
  // const isValidPermission =

  const result = {
    title: isValidTitle(data.title),
    type: isValidType(data.type),
    status: isValidStatus(data.status),
    comment: isValidComment(data.comment),
    // path:,
    // component:,
    // permission:,
  };
  const invalidKeys = Object.keys(result).filter(key => result[key] === false);

  return {
    ...result,
    invalidKeys,
    finalResult: invalidKeys.length === 0,
  };
};

module.exports = {
  MenuValidator,
};
