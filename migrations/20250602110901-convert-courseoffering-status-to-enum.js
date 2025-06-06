"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. 新增一個暫時欄位 status_temp（INTEGER）
    await queryInterface.addColumn("CourseOfferings", "status_temp", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });

    // 2. 把原本 string 狀態轉成整數
    await queryInterface.sequelize.query(`
      UPDATE CourseOfferings
      SET status_temp = CASE
        WHEN status = 'open' THEN 0
        WHEN status = 'closed' THEN 1
        WHEN status = 'cancelled' THEN 2
        ELSE 0
      END;
    `);

    // 3. 刪除原本 string 欄位
    await queryInterface.removeColumn("CourseOfferings", "status");

    // 4. 將 status_temp 改名為 status
    await queryInterface.renameColumn("CourseOfferings", "status_temp", "status");
  },

  async down(queryInterface, Sequelize) {
    // 1. 新增 string 欄位 status_temp
    await queryInterface.addColumn("CourseOfferings", "status_temp", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "open",
    });

    // 2. 把整數轉回文字
    await queryInterface.sequelize.query(`
      UPDATE CourseOfferings
      SET status_temp = CASE
        WHEN status = 0 THEN 'open'
        WHEN status = 1 THEN 'closed'
        WHEN status = 2 THEN 'cancelled'
        ELSE 'open'
      END;
    `);

    // 3. 刪除整數欄位
    await queryInterface.removeColumn("CourseOfferings", "status");

    // 4. 改名回原欄位
    await queryInterface.renameColumn("CourseOfferings", "status_temp", "status");
  },
};
