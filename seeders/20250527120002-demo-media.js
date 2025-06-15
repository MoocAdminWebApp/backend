"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Media",
      [
        {
          id: 1,
          chapterId: 1, 
          fileName: "js_intro_001.mp4",
          originalName: "JavaScript Introduction Video.mp4",
          filePath: "/uploads/courses/js001/chapter1/js_intro_001.mp4",
          fileSize: 125829120, 
          mimeType: "video/mp4",
          mediaType: "Video",
          duration: 1500, 
          uploadedBy: 12, 
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Media", null, {});
  },
};