"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Chapter",
      [
        {
          chapterNumber: 1,
          chapterTitle: "Introduction to JavaScript",
          chapterDescription: "Welcome to JavaScript programming",

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
          status: "Published",
          isFree: true,
          objectives: JSON.stringify([
            "Understand what JavaScript is",
            "Set up development environment",
            "Write first JavaScript program",
          ]),
          resources: JSON.stringify([
            {
              title: "MDN JavaScript Guide",
              url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
              type: "documentation",
            },
          ]),
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
    await queryInterface.bulkDelete("Chapter", null, {});
  },
};
