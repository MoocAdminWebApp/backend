"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert("Question", [
      // Single choice
      {
        type: "single",
        content: "What is the capital of Australia?",
        createdAt: now,
        updatedAt: now,
      },
      {
        type: "single",
        content: "Which planet is known as the Red Planet?",
        createdAt: now,
        updatedAt: now,
      },
      {
        type: "single",
        content: "How many continents are there on Earth?",
        createdAt: now,
        updatedAt: now,
      },

      // Multiple choice
      {
        type: "multiple",
        content: "Which of the following are programming languages?",
        createdAt: now,
        updatedAt: now,
      },
      {
        type: "multiple",
        content: "Which countries are part of North America?",
        createdAt: now,
        updatedAt: now,
      },
      {
        type: "multiple",
        content: "Which animals are mammals?",
        createdAt: now,
        updatedAt: now,
      },

      // True/False
      {
        type: "truefalse",
        content: "The sun is a star.",
        createdAt: now,
        updatedAt: now,
      },
      {
        type: "truefalse",
        content: "Water freezes at 0 degrees Celsius.",
        createdAt: now,
        updatedAt: now,
      },
      {
        type: "truefalse",
        content: "Bananas grow on trees.",
        createdAt: now,
        updatedAt: now,
      },

      // Short answer
      {
        type: "shortanswer",
        content: 'Define the term "ecosystem".',
        createdAt: now,
        updatedAt: now,
      },
      {
        type: "shortanswer",
        content: "What is the chemical formula for water?",
        createdAt: now,
        updatedAt: now,
      },
      {
        type: "shortanswer",
        content: 'Who wrote "Romeo and Juliet"?',
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Question", null, {});
  },
};
