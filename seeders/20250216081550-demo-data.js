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
    const demoDatas = [];
    const baseTime = new Date();

    for (let i = 1; i <= 55; i++) {
      demoDatas.push({
        title: `title${i}`,
        mark: `mark ${i.toString().padStart(6, "0")}`,
        count: i,
        acitve: i % 2 === 0, //
        dataTime: new Date(baseTime.getTime() + i * 1000),
      });
    }

    await queryInterface.bulkInsert("Demo", demoDatas, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete("Demo", null, {});
    // delete table if necessary   to use reset-db command in package.json
    await queryInterface.dropTable("Demo");
  },
};
