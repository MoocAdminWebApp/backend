"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.bulkInsert(
      "User",
      [
        {
          username: "user1",
          password:
            "$2b$10$ig9HBJNu6OgmwSnbPn/jWupbPPq1LC4Ee5uptADcG/Ho3M1e3VM1S",
          email: "user1@example.com",
          age: 30,
          gender: "Other",
        },
        {
          username: "admin",
          password:
            "$2b$10$ig9HBJNu6OgmwSnbPn/jWupbPPq1LC4Ee5uptADcG/Ho3M1e3VM1S",
          email: "admin@example.com",
          age: 31,
          gender: "Other",
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
    await queryInterface.bulkDelete("User", null, {});
    // delete table if necessary   to use reset-db command in package.json
    await queryInterface.dropTable("User");
  },
};
