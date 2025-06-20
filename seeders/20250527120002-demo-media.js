"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "media",
      [
        {
          chapterId: 1,
          fileName: "js_intro_video_001.mp4",
          originalName: "JavaScript简介.mp4",
          filePath: "/uploads/courses/js001/chapter1/js_intro_video_001.mp4",
          fileSize: 125829120,
          mimeType: "video/mp4",
          mediaType: "Video",
          duration: 3600,
          uploadedBy: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("media", null, {});
  },
};
