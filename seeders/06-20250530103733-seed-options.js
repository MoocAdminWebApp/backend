"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert("options", [
      // Q1: HTML line break
      {
        content: "<br>",
        isCorrect: true,
        questionId: 1,
        createdBy: 1,
        updatedBy: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        content: "<hr>",
        isCorrect: false,
        questionId: 1,
        createdBy: 1,
        updatedBy: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        content: "<div>",
        isCorrect: false,
        questionId: 1,
        createdBy: 2,
        updatedBy: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        content: "<p>",
        isCorrect: false,
        questionId: 1,
        createdBy: 2,
        updatedBy: 2,
        createdAt: now,
        updatedAt: now,
      },

      // Q2: CSS units
      {
        content: "px",
        isCorrect: true,
        questionId: 2,
        createdBy: 1,
        updatedBy: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        content: "em",
        isCorrect: true,
        questionId: 2,
        createdBy: 1,
        updatedBy: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        content: "pt",
        isCorrect: true,
        questionId: 2,
        createdBy: 3,
        updatedBy: 3,
        createdAt: now,
        updatedAt: now,
      },
      {
        content: "kg",
        isCorrect: false,
        questionId: 2,
        createdBy: 3,
        updatedBy: 3,
        createdAt: now,
        updatedAt: now,
      },

      // Q3: CSS stands for...
      {
        content: "True",
        isCorrect: true,
        questionId: 3,
        createdBy: 2,
        updatedBy: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        content: "False",
        isCorrect: false,
        questionId: 3,
        createdBy: 2,
        updatedBy: 2,
        createdAt: now,
        updatedAt: now,
      },

      // Q4: HTTP GET method
      {
        content: "POST",
        isCorrect: false,
        questionId: 4,
        createdBy: 1,
        updatedBy: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        content: "GET",
        isCorrect: true,
        questionId: 4,
        createdBy: 1,
        updatedBy: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        content: "PUT",
        isCorrect: false,
        questionId: 4,
        createdBy: 2,
        updatedBy: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        content: "DELETE",
        isCorrect: false,
        questionId: 4,
        createdBy: 2,
        updatedBy: 2,
        createdAt: now,
        updatedAt: now,
      },

      // Q5: Backend languages
      {
        content: "Node.js",
        isCorrect: true,
        questionId: 5,
        createdBy: 3,
        updatedBy: 3,
        createdAt: now,
        updatedAt: now,
      },
      {
        content: "Python",
        isCorrect: true,
        questionId: 5,
        createdBy: 3,
        updatedBy: 3,
        createdAt: now,
        updatedAt: now,
      },
      {
        content: "HTML",
        isCorrect: false,
        questionId: 5,
        createdBy: 1,
        updatedBy: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        content: "PHP",
        isCorrect: true,
        questionId: 5,
        createdBy: 1,
        updatedBy: 1,
        createdAt: now,
        updatedAt: now,
      },

      // Q7: SQL sort keyword
      {
        content: "ORDER BY",
        isCorrect: true,
        questionId: 7,
        createdBy: 2,
        updatedBy: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        content: "GROUP BY",
        isCorrect: false,
        questionId: 7,
        createdBy: 2,
        updatedBy: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        content: "SELECT",
        isCorrect: false,
        questionId: 7,
        createdBy: 3,
        updatedBy: 3,
        createdAt: now,
        updatedAt: now,
      },
      {
        content: "WHERE",
        isCorrect: false,
        questionId: 7,
        createdBy: 3,
        updatedBy: 3,
        createdAt: now,
        updatedAt: now,
      },

      // Q8: Primary key duplicate check
      {
        content: "True",
        isCorrect: false,
        questionId: 8,
        createdBy: 1,
        updatedBy: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        content: "False",
        isCorrect: true,
        questionId: 8,
        createdBy: 1,
        updatedBy: 1,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("options", null, {});
  },
};
