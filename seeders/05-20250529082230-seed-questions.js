"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert("questions", [
      // Single choice
      {
        type: "single",
        content: "What is the capital of Australia?",
        createdBy: 1,
        updatedBy: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        type: "single",
        content: "Which planet is known as the Red Planet?",
        createdBy: 1,
        updatedBy: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        type: "single",
        content: "How many continents are there on Earth?",
        createdBy: 1,
        updatedBy: 1,
        createdAt: now,
        updatedAt: now,
      },

      // Multiple choice
      {
        type: "multiple",
        content: "Which of the following are programming languages?",
        createdBy: 2,
        updatedBy: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        type: "multiple",
        content: "Which countries are part of North America?",
        createdBy: 2,
        updatedBy: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        type: "multiple",
        content: "Which animals are mammals?",
        createdBy: 2,
        updatedBy: 2,
        createdAt: now,
        updatedAt: now,
      },

      // True/False
      {
        type: "truefalse",
        content: "The sun is a star.",
        createdBy: 3,
        updatedBy: 3,
        createdAt: now,
        updatedAt: now,
      },
      {
        type: "truefalse",
        content: "Water freezes at 0 degrees Celsius.",
        createdBy: 3,
        updatedBy: 3,
        createdAt: now,
        updatedAt: now,
      },
      {
        type: "truefalse",
        content: "Bananas grow on trees.",
        createdBy: 3,
        updatedBy: 3,
        createdAt: now,
        updatedAt: now,
      },

      // Short answer
      {
        type: "shortanswer",
        content: 'Define the term "ecosystem".',
        createdBy: 4,
        updatedBy: 4,
        createdAt: now,
        updatedAt: now,
      },
      {
        type: "shortanswer",
        content: "What is the chemical formula for water?",
        createdBy: 4,
        updatedBy: 4,
        createdAt: now,
        updatedAt: now,
      },
      {
        type: "shortanswer",
        content: 'Who wrote "Romeo and Juliet"?',
        createdBy: 4,
        updatedBy: 4,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("questions", null, {});
  },
};
