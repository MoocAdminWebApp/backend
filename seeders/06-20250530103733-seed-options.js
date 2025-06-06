"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert("Option", [
      // Question ID 1 - What is the capital of Australia?
      {
        content: "Canberra",
        isCorrect: true,
        questionId: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        content: "Sydney",
        isCorrect: false,
        questionId: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        content: "Melbourne",
        isCorrect: false,
        questionId: 1,
        createdAt: now,
        updatedAt: now,
      },

      // Question ID 2 - Which planet is known as the Red Planet?
      {
        content: "Mars",
        isCorrect: true,
        questionId: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        content: "Jupiter",
        isCorrect: false,
        questionId: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        content: "Venus",
        isCorrect: false,
        questionId: 2,
        createdAt: now,
        updatedAt: now,
      },

      // Question ID 3 - How many continents are there on Earth?
      {
        content: "7",
        isCorrect: true,
        questionId: 3,
        createdAt: now,
        updatedAt: now,
      },
      {
        content: "5",
        isCorrect: false,
        questionId: 3,
        createdAt: now,
        updatedAt: now,
      },
      {
        content: "6",
        isCorrect: false,
        questionId: 3,
        createdAt: now,
        updatedAt: now,
      },

      // Question ID 4 - Which of the following are programming languages?
      {
        content: "Python",
        isCorrect: true,
        questionId: 4,
        createdAt: now,
        updatedAt: now,
      },
      {
        content: "JavaScript",
        isCorrect: true,
        questionId: 4,
        createdAt: now,
        updatedAt: now,
      },
      {
        content: "HTML",
        isCorrect: false,
        questionId: 4,
        createdAt: now,
        updatedAt: now,
      },

      // Question ID 5 - Which countries are part of North America?
      {
        content: "Canada",
        isCorrect: true,
        questionId: 5,
        createdAt: now,
        updatedAt: now,
      },
      {
        content: "Mexico",
        isCorrect: true,
        questionId: 5,
        createdAt: now,
        updatedAt: now,
      },
      {
        content: "Germany",
        isCorrect: false,
        questionId: 5,
        createdAt: now,
        updatedAt: now,
      },

      // Question ID 6 - Which animals are mammals?
      {
        content: "Whale",
        isCorrect: true,
        questionId: 6,
        createdAt: now,
        updatedAt: now,
      },
      {
        content: "Dolphin",
        isCorrect: true,
        questionId: 6,
        createdAt: now,
        updatedAt: now,
      },
      {
        content: "Shark",
        isCorrect: false,
        questionId: 6,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Options", null, {});
  },
};
