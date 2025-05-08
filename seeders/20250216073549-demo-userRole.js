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
      "UserRole",
      [
        {
          userId: 1,
          roleId: 1,
        },
        {
          userId: 2,
          roleId: 2,
        },
        {
          userId: 2,
          roleId: 3,
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

    //  await queryInterface.bulkDelete("user", null, {});
    await queryInterface.bulkDelete("UserRole", null, {});
    // delete table if necessary   to use reset-db command in package.json
    await queryInterface.dropTable("UserRole");
  },
};
