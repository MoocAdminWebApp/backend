"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Course", [
      {
        courseCode: `TEMP-${Date.now()}-${Math.floor(Math.random() * 1000)}`, //temp placeholder for courseCode
        courseName: "JavaScript",
        courseDescription: "JavaScript",
        instructorId: 1,
        status: "Published",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Course", null, {});
  },
};
