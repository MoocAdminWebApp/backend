"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert("questions", [
      {
        type: "Single",
        content: "Which HTML tag is used to insert a line break?",
        difficulty: "Easy",
        createdBy: 1,
        updatedBy: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        type: "Multiple",
        content: "Which of the following are valid CSS units?",
        difficulty: "Easy",
        createdBy: 1,
        updatedBy: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        type: "TrueFalse",
        content: "CSS stands for Cascading Style Sheets.",
        difficulty: "Easy",
        createdBy: 1,
        updatedBy: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        type: "Single",
        content: "Which HTTP method is used to retrieve data from a server?",
        difficulty: "Easy",
        createdBy: 2,
        updatedBy: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        type: "Multiple",
        content: "Which of the following are backend languages?",
        difficulty: "Easy",
        createdBy: 2,
        updatedBy: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        type: "ShortAnswer",
        content: "What is the purpose of middleware in Express.js?",
        difficulty: "Hard",
        createdBy: 2,
        updatedBy: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        type: "Single",
        content: "Which SQL keyword is used to sort results?",
        difficulty: "Medium",
        createdBy: 3,
        updatedBy: 3,
        createdAt: now,
        updatedAt: now,
      },
      {
        type: "TrueFalse",
        content: "A primary key can have duplicate values in SQL.",
        difficulty: "Medium",
        createdBy: 3,
        updatedBy: 3,
        createdAt: now,
        updatedAt: now,
      },
      {
        type: "ShortAnswer",
        content: "Name one advantage of using indexes in a database.",
        difficulty: "Hard",
        createdBy: 3,
        updatedBy: 3,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("questions", null, {});
  },
};
