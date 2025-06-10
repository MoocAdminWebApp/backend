"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert("student_answers", [
      {
        studentId: 1,
        questionId: 1,
        optionId: 1,
        answerText: null,
        isCorrect: true,
        submittedAt: now,
        createdBy: 1,
        updatedBy: 1,
      },

      {
        studentId: 2,
        questionId: 2,
        optionId: 5,
        answerText: null,
        isCorrect: true,
        submittedAt: now,
        createdBy: 2,
        updatedBy: 2,
      },

      {
        studentId: 2,
        questionId: 2,
        optionId: 6,
        answerText: null,
        isCorrect: true,
        submittedAt: now,
        createdBy: 2,
        updatedBy: 2,
      },

      {
        studentId: 2,
        questionId: 2,
        optionId: 7,
        answerText: null,
        isCorrect: true,
        submittedAt: now,
        createdBy: 2,
        updatedBy: 2,
      },

      {
        studentId: 3,
        questionId: 3,
        optionId: 10,
        answerText: null,
        isCorrect: false,
        submittedAt: now,
        createdBy: 3,
        updatedBy: 3,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("student_answers", null, {});
  }
};
