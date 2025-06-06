const demoservice = require("../service/demoservice");

/**
 * add demo
 * @param {*} req
 * @param {*} res
 */
const createAsync = async (req, res) => {
  let demo = {};
  demo.title = req.body.title;
  demo.mark = req.body.mark;
  demo.count = req.body.count;
  demo.active = req.body.active;
  demo.dataTime = req.body.dataTime;

  let result = await demoservice.createAsync(demo);
  if (result.isSuccess) {
    res.sendCommonValue(200, "success", result.data);
  } else {
    res.sendCommonValue(400, "fail");
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 */
const updateAsync = async (req, res) => {
  let demo = {};
  demo.id = req.body.id;
  demo.title = req.body.title;
  demo.mark = req.body.mark;
  demo.count = req.body.count;
  demo.active = req.body.active;
  demo.dataTime = req.body.dataTime;

  let result = await demoservice.updateAsync(demo);
  if (result.isSuccess) {
    res.sendCommonValue(200, "success", result.data);
  } else {
    res.sendCommonValue(400, "fail");
  }
};

/**
 * get all demo
 * @param {*} req
 * @param {*} res
 */
const getAllAsync = async (req, res) => {
  let result = await demoservice.getAllAsync();
  res.sendCommonValue(200, "success", result.data);
};

/**
 * page demo
 * @param {*} req
 * @param {*} res
 */
const pageAsync = async (req, res) => {
  let title = req.query.title || "";
  let page = parseInt(req.params.page);
  let pageSize = parseInt(req.params.pageSize);
  let result = await demoservice.pageAsync(title, page, pageSize);
  if (result.isSuccess) {
    res.sendCommonValue(200, "success", result.data);
  } else {
    res.sendCommonValue(400, "fail");
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 */
const deleteAsync = async (req, res) => {
  let id = req.params.id;
  let result = await demoservice.deleteAsync(id);
  if (result.isSuccess) {
    res.sendCommonValue(200, "success", result.data);
  } else {
    res.sendCommonValue(400, "fail");
  }
};

const getByIdAsync = async (req, res) => {
  let id = req.params.id;
  let result = await demoservice.getByIdAsync(id);
  res.sendCommonValue(200, "success", result.data);
};

module.exports = {
  createAsync,
  updateAsync,
  getAllAsync,
  pageAsync,
  deleteAsync,
  getByIdAsync,
};
