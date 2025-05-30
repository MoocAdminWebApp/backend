require("dotenv").config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});
const { sequelize } = require("../models");

(async () => {
  try {
    await sequelize.sync({ force: true });
    console.log("測試資料庫初始化成功！");
    process.exit(0);
  } catch (err) {
    console.error("初始化資料庫失敗：", err);
    process.exit(1);
  }
})();
