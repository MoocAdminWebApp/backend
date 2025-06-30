const carouselService = require("../service/carouselService");

/**
 * add carousel
 * @param {*} req
 * @param {*} res
 */
const createAsync = async (req, res) => {
  let carousel = {};
  carousel.title = req.body.title;
  carousel.description = req.body.description;
  carousel.orderNum = req.body.orderNum;
  carousel.imageUrl = req.body.imageUrl;
  carousel.linkUrl = req.body.linkUrl;
  carousel.active = req.body.active;

  let result = await carouselService.createAsync(carousel);
  if (result.isSuccess) {
    res.sendCommonValue(200, "success", result.data);
  } else {
    res.sendCommonValue(400, "fail");
  }
};

/**
 * update carousel
 * @param {*} req
 * @param {*} res
 */
const updateAsync = async (req, res) => {
  let carousel = {};
  carousel.title = req.body.title;
  carousel.description = req.body.description;
  carousel.orderNum = req.body.orderNum;
  carousel.imageUrl = req.body.imageUrl;
  carousel.linkUrl = req.body.linkUrl;
  carousel.active = req.body.active;

  let result = await carouselService.updateAsync(carousel);
  if (result.isSuccess) {
    res.sendCommonValue(200, "success", result.data);
  } else {
    res.sendCommonValue(400, "fail");
  }
};

/**
 * get all carousel
 * @param {*} req
 * @param {*} res
 */
const getAllAsync = async (req, res) => {
  let result = await carouselService.getAllAsync();
  res.sendCommonValue(200, "success", result.data);
};

/**
 * page carousel
 * @param {*} req
 * @param {*} res
 */
const pageAsync = async (req, res) => {
  let title = req.query.title || "";
  let page = parseInt(req.params.page);
  let pageSize = parseInt(req.params.pageSize);
  let result = await carouselService.pageAsync(title, page, pageSize);
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
  let result = await carouselService.deleteAsync(id);
  if (result.isSuccess) {
    res.sendCommonValue(200, "success", result.data);
  } else {
    res.sendCommonValue(400, "fail");
  }
};

const getByIdAsync = async (req, res) => {
  let id = req.params.id;
  let result = await carouselService.getByIdAsync(id);
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
