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

    const roleDatas = [{ roleName: "admin", mark: "admin" }];

    for (let i = 1; i <= 35; i++) {
      roleDatas.push({
        roleName: `role ${i}`,
        mark: `description ${i.toString().padStart(6, "0")}`,
      });
    }

    await queryInterface.bulkInsert("Role", roleDatas, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    //  await queryInterface.bulkDelete("user", null, {});
    await queryInterface.bulkDelete("Role", null, {});
    // delete table if necessary   to use reset-db command in package.json
    await queryInterface.dropTable("Role");
  },
};
