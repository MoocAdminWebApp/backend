'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Carousel', [
      {
        title: 'First Slide',
        description: 'Welcome to our website!',
        orderNum: 1,
        imageUrl: 'https://www.notion.so/images/page-cover/nasa_the_blue_marble.jpg',
        linkUrl: 'https://example.com/page1',
        active: true,
        // createdAt: new Date(),
        // updatedAt: new Date(),
      },
      {
        title: 'Second Slide',
        description: 'Check out our products!',
        orderNum: 2,
        imageUrl: 'https://www.notion.so/images/page-cover/nasa_the_blue_marble.jpg',
        linkUrl: 'https://example.com/page2',
        active: true,
        // createdAt: new Date(),
        // updatedAt: new Date(),
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Carousel', null, {});
  }
};