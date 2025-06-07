'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('question_courses', [
      // Course 1
      {
        questionId: 1,
        courseId: 1,
        createdBy: 1,
        updatedBy: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        questionId: 2,
        courseId: 1,
        createdBy: 1,
        updatedBy: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        questionId: 3,
        courseId: 1,
        createdBy: 1,
        updatedBy: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        questionId: 4,
        courseId: 1,
        createdBy: 1,
        updatedBy: 1,
        createdAt: now,
        updatedAt: now,
      },

      // Course 2
      {
        questionId: 5,
        courseId: 2,
        createdBy: 2,
        updatedBy: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        questionId: 6,
        courseId: 2,
        createdBy: 2,
        updatedBy: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        questionId: 7,
        courseId: 2,
        createdBy: 2,
        updatedBy: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        questionId: 8,
        courseId: 2,
        createdBy: 2,
        updatedBy: 2,
        createdAt: now,
        updatedAt: now,
      },

      // Course 3
      {
        questionId: 9,
        courseId: 3,
        createdBy: 3,
        updatedBy: 3,
        createdAt: now,
        updatedAt: now,
      },
      {
        questionId: 10,
        courseId: 3,
        createdBy: 3,
        updatedBy: 3,
        createdAt: now,
        updatedAt: now,
      },
      {
        questionId: 11,
        courseId: 3,
        createdBy: 3,
        updatedBy: 3,
        createdAt: now,
        updatedAt: now,
      },
      {
        questionId: 12,
        courseId: 3,
        createdBy: 3,
        updatedBy: 3,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('question_courses', null, {});
  },
};
