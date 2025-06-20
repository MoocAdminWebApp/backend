"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "permissions",
      [
        {
          id: 1,
          permissionName: "admin permission",
          description: "admin's permission",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          permissionName: "teacher permission",
          description: "teacher's permission",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          permissionName: "student permission",
          description: "student's permission",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("permissions", null, {});
  },
};
