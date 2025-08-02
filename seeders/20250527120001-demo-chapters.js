"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "chapters",
      [
        {
          chapterNumber: 1,
          title: "Introduction to JavaScript",
          description: "Welcome to JavaScript programming",
          courseId: 1,
          content: JSON.stringify({
            sections: [
              "What is JavaScript?",
              "Setting up development environment",
              "Writing your first program",
            ],
          }),
          videoUrl: "https://example.com/videos/js-intro.mp4",
          duration: 25,
          orderNum: 1,
          status: "PUBLISHED",
          createdBy: 1,
          updatedBy: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          chapterNumber: 2,
          title: "JavaScript Basics",
          description: "Variables, data types, and operators",
          courseId: 1,
          content: JSON.stringify({
            sections: [
              "Declaring variables",
              "Data types in JavaScript",
              "Operators and expressions",
            ],
          }),
          videoUrl: "https://example.com/videos/js-basics.mp4",
          duration: 30,
          orderNum: 2,
          status: "PUBLISHED",
          createdBy: 1,
          updatedBy: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          chapterNumber: 3,
          title: "Control Flow",
          description: "Learn how to use conditionals and loops",
          courseId: 1,
          content: JSON.stringify({
            sections: [
              "If-else statements",
              "Switch case",
              "Loops: for, while, do-while",
            ],
          }),
          videoUrl: "https://example.com/videos/js-flow.mp4",
          duration: 35,
          orderNum: 3,
          status: "DRAFT",
          createdBy: 2,
          updatedBy: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          chapterNumber: 4,
          title: "Functions and Scope",
          description: "Understanding functions and variable scope",
          courseId: 1,
          content: JSON.stringify({
            sections: [
              "Function declaration and expressions",
              "Arrow functions",
              "Scope and closures",
            ],
          }),
          videoUrl: "https://example.com/videos/js-functions.mp4",
          duration: 40,
          orderNum: 4,
          status: "PUBLISHED",
          createdBy: 1,
          updatedBy: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          chapterNumber: 5,
          title: "DOM Manipulation",
          description: "Interacting with the webpage",
          courseId: 1,
          content: JSON.stringify({
            sections: [
              "Document Object Model",
              "Selecting elements",
              "Updating content dynamically",
            ],
          }),
          videoUrl: "https://example.com/videos/dom.mp4",
          duration: 50,
          orderNum: 5,
          status: "HIDDEN",
          createdBy: 3,
          updatedBy: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("chapters", null, {});
  },
};
