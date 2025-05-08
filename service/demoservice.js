const Sequelize = require("sequelize");
const sequelizeOP = require("../db/sequelizedb");
const { Op } = require("sequelize");
const Demo = require("../models/demo");
const cacheHelper = require("../common/cache/cacheHelper");
const {
  EntityAlreadyExistsException,
  EntityNotFoundException,
} = require("../common/commonError");
/**
 * key
 * @returns all cache key
 */
// 获取所有缓存的键
function getALLCacheKey() {
  //Return all cached keys
  return "demo_all";
}

/**
 * Check if the title already exists (used when creating or updating)
 * @param {string} title - Title to be checked
 * @param {number|null} [id=null] - The current record ID passed in during update (can be left blank or null when created)
 * @returns {Promise<boolean>} - Return true to indicate that the title already exists, false to indicate that it does not exist
 */
const checkTitleExists = async (title, id = null) => {
  const whereClause = { title };

  //If it is an update operation, exclude the current record
  if (id) {
    whereClause.id = { [Sequelize.Op.ne]: id };
  }

  const existingDemo = await Demo.findOne({
    where: whereClause,
    attributes: ["id"], // Only querying the ID field improves efficiency
    raw: true, // Return pure JSON objects instead of model instances
  });

  if (existingDemo) {
    throw new EntityAlreadyExistsException("title already exists");
  }
};

/**
 * add demo
 * @param {*} demo
 * @returns
 */
const createAsync = async (demo) => {
  await checkTitleExists(demo.title);

  var newDemo = await Demo.create({
    title: demo.title,
    mark: demo.mark,
    count: demo.count,
    active: demo.active,
    dataTime: demo.dataTime,
  });

  await cacheHelper.delAsync(getALLCacheKey());

  return {
    isSuccess: newDemo.id > 0 ? true : false,
    message: "",
    data: newDemo,
  };
};

/**
 *
 * @param {*} id
 */
const checkDemoExists = async (id) => {
  var demo = await Demo.findByPk(id);
  if (!demo) {
    throw new EntityNotFoundException("demo not exists");
  }
};

/**
 *add demo
 * @param {*} demo
 */
const updateAsync = async (demo) => {
  await checkDemoExists(demo.id);

  await checkTitleExists(demo.title, demo.id);

  var updateDemo = await Demo.update(
    {
      title: demo.title,
      mark: demo.mark,
      count: demo.count,
      active: demo.active,
      dataTime: demo.dataTime,
    },
    {
      where: { id: demo.id },
    }
  );
  return { isSuccess: true, message: "", data: updateDemo };
};

/**
 * all demo
 * @returns
 */
const getAllAsync = async () => {
  let cacheValue = await cacheHelper.getAsync(getALLCacheKey());
  if (cacheValue) {
    return { isSuccess: true, message: "", data: JSON.parse(cacheValue) };
  }
  var allDemo = await Demo.findAll();
  if (allDemo) {
    await cacheHelper.setAsync(getALLCacheKey(), JSON.stringify(allDemo), 10);
  }
  return { isSuccess: true, message: "", data: allDemo };
};

/**
 *
 * @param {*} title
 * @param {*} page
 * @param {*} pageSize
 * @returns
 */
const pageAsync = async (title, page, pageSize) => {
  const offset = (page - 1) * pageSize;

  const whereClause = {};
  if (title !== undefined && title !== "undefined" && title !== "") {
    whereClause.title = {
      [Op.like]: `%${title}%`,
    };
  }

  const { count, rows } = await Demo.findAndCountAll({
    where: whereClause,
    limit: pageSize,
    offset: parseInt(offset),
    order: [["id", "ASC"]],
  });

  return { isSuccess: true, message: "", data: { total: count, items: rows } };
};

/**
 * delete demo by id
 * @param {*} id
 * @returns
 */
const deleteAsync = async (id) => {
  await checkDemoExists(id);

  var deleteDemo = await Demo.destroy({
    where: { id: id },
  });
  return { isSuccess: true, message: "", data: deleteDemo };
};

const getByIdAsync = async (id) => {
  var demo = await Demo.findByPk(id);
  if(!demo){
    throw new EntityNotFoundException("demo not exists");
  }
  return { isSuccess: true, message: "", data: demo };
}

module.exports = {
  createAsync,
  updateAsync,
  getAllAsync,
  pageAsync,
  deleteAsync,
  getByIdAsync,
};
