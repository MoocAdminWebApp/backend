"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // Insert 3 question sets
    await queryInterface.bulkInsert("question_sets", [
      {
        id: 1,
        title: "Frontend Fundamentals",
        description: "Covers HTML, CSS, and client-side basics",
        courseId: 1,
        createdBy: 1,
        updatedBy: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 2,
        title: "Backend Basics",
        description: "Covers server-side concepts and APIs",
        courseId: 1,
        createdBy: 1,
        updatedBy: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 3,
        title: "Database Essentials",
        description: "Covers SQL and indexing fundamentals",
        courseId: 1,
        createdBy: 1,
        updatedBy: 1,
        createdAt: now,
        updatedAt: now,
      }
    ]);

    // Link questions to sets
    
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("question_sets", null, {});
  }
};
