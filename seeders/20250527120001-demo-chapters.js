"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Chapter",
      [
        {
          id: 1,
          chapterTitle: 'Introduction to JavaScript',        
          chapterDescription: 'Welcome to JavaScript programming', 
          courseId: 1,                                       
          orderNum: 1,                                       
          duration: 25,                                      
          status: 'Published',                                          
        },
      ],
      {}
    );
  },

  
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Chapter", null, {});
  },
};