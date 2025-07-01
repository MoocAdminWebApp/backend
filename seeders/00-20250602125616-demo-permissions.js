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
        {
          id: 4,
          permissionName: "menu:view",
          description: "view menu",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 5,
          permissionName: "menu:edit",
          description: "update an existing menu",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 6,
          permissionName: "menu:create",
          description: "create a new menu",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 7,
          permissionName: "menu:delete",
          description: "delete an existing menu from database",
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
