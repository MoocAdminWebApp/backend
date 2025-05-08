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
      "RoleMenu",
      [
        {
          roleId: 1,
          menuId: 1,
        },
        {
          roleId: 1,
          menuId: 2,
        },
        {
          roleId: 2,
          menuId: 1,
        },
        {
          roleId: 2,
          menuId: 2,
        },
        {
          roleId: 3,
          menuId: 1,
        },
        {
          roleId: 3,
          menuId: 2,
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
    await queryInterface.bulkDelete("RoleMenu", null, {});
    // delete table if necessary   to use reset-db command in package.json
    await queryInterface.dropTable("RoleMenu");
  },
};
