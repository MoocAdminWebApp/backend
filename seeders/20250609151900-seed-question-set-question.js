'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert("question_set_questions", [
      // Frontend: questions 1–3
      { 
        questionSetId: 1, 
        questionId: 1, 
        createdBy: 1,
        updatedBy: 1,
        createdAt: now, 
        updatedAt: now 
      },
      { 
        questionSetId: 1, 
        questionId: 2, 
        createdBy: 1,
        updatedBy: 1,
        createdAt: now, 
        updatedAt: now 
      },
      { 
        questionSetId: 1, 
        questionId: 3, 
        createdBy: 1,
        updatedBy: 1,
        createdAt: now, 
        updatedAt: now 
      },

      // Backend: questions 4–6
      { 
        questionSetId: 2, 
        questionId: 4, 
        createdBy: 1,
        updatedBy: 1,
        createdAt: now, 
        updatedAt: now 
      },
      { 
        questionSetId: 2, 
        questionId: 5, 
        createdBy: 1,
        updatedBy: 1,
        createdAt: now,
        updatedAt: now 
      },
      { 
        questionSetId: 2, 
        questionId: 6, 
        createdBy: 1,
        updatedBy: 1,
        createdAt: now, 
        updatedAt: now 
      },

      // Database: questions 7–9
      { 
        questionSetId: 3, 
        questionId: 7, 
        createdBy: 1,
        updatedBy: 1,
        createdAt: now, 
        updatedAt: now 
      },
      { 
        questionSetId: 3, 
        questionId: 8, 
        createdBy: 1,
        updatedBy: 1,
        createdAt: now, 
        updatedAt: now 
      },
      { 
        questionSetId: 3, 
        questionId: 9, 
        createdBy: 1,
        updatedBy: 1,
        createdAt: now, 
        updatedAt: now 
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("question_set_questions", null, {})
  }
};
