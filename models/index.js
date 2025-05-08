"use strict";

const fs = require("fs");
const path = require("path");
const process = require("process");

const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];
const db = {};

console.log("Models index __dirname:", __dirname);

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    try {
      const model = require(path.join(__dirname, file));
      if (model && model.name) {
        db[model.name] = model;
      } else {
        console.warn(`Skipping ${file} as it does not export a valid model.`);
      }
    } catch (err) {
      console.error(`Error loading model from ${file}:`, err);
    }
  });

console.log("Loaded models:", Object.keys(db));

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
    console.log(`Associated ${modelName}`);
  } else {
    console.warn(
      `Skipping association for ${modelName} as it does not have an associate method.`
    );
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
