"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "chapters",
      [
        {
          chapterNumber: 1,
          title: "Introduction to JavaScript",
          description: "Welcome to JavaScript programming",

          courseId: 1,
          content: JSON.stringify({
            sections: [
              "What is JavaScript?",
              "Setting up development environment",
              "Writing your first program",
            ],
          }),
          videoUrl: "https://example.com/videos/js-intro.mp4",
          duration: 25,
          orderNum: 1,
          status: "PUBLISHED",
          createdBy: 1,
          updatedBy: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("chapters", null, {});
  },
};
