"use strict";

const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const saltRounds = 10;

    const users = [
      {
        email: "alice@gmail.com",
        password: bcrypt.hashSync("password12", saltRounds),
        firstName: "Alice",
        lastName: "Anderson",
        access: "ADMIN",
        active: true,
        createdBy: null,
        updatedBy: null,
      },
      {
        email: "bob@gmail.com",
        password: bcrypt.hashSync("password34", saltRounds),
        firstName: "Bob",
        lastName: "Brown",
        access: "TEACHER",
        active: true,
        createdBy: 1,
        updatedBy: 1,
      },
      {
        email: "charlie@gmail.com",
        password: bcrypt.hashSync("password56", saltRounds),
        firstName: "Charlie",
        lastName: "Clark",
        access: "STUDENT",
        active: true,
        createdBy: 1,
        updatedBy: 2,
      },
      {
        email: "diana@gmail.com",
        password: bcrypt.hashSync("password78", saltRounds),
        firstName: "Diana",
        lastName: "Davis",
        access: "TEACHER",
        active: false,
        createdBy: 2,
        updatedBy: 2,
      },
      {
        email: "edward@gmail.com",
        password: bcrypt.hashSync("password90", saltRounds),
        firstName: "Edward",
        lastName: "Evans",
        access: "STUDENT",
        active: false,
        createdBy: 1,
        updatedBy: 3,
      },
    ];

    await queryInterface.bulkInsert("users", users, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
