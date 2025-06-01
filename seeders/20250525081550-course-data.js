"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const courses = [];
    const now = new Date();

    for (let i = 1; i <= 20; i++) {
      courses.push({
        name: `Course name ${i}`,
        category_id: (i % 5) + 1, // 5 categories
        instructor_id: (i % 3) + 1, //3 instructors
        price: (i * 10).toFixed(2),
        duration: 60 + i * 5,
        level: ["elementary", "intermediate", "advanced"][i % 3],
        tags: JSON.stringify(["tag1", "tag2", `tag${i}`]),
        language: "Chinese",
        certificate: i % 2 === 0,
        description: `This is the description of ${i}`,
        enrolment_count: i * 2,
        rating: (Math.random() * 5).toFixed(1),
        is_featured: i % 4 === 0,
        status: ["draft", "published", "updated", "disabled"][i % 4],
        cover_image: `https://example.com/image${i}.jpg`,
        created_at: now,
        updated_at: now,
      });
    }

    await queryInterface.bulkInsert("courses", courses, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("courses", null, {});
  },
};
