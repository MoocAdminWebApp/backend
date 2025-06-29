const courseofferingService = require("../service/courseofferingservice");

const getAll = async (req, res) => {
  const result = await courseofferingService.getAllAsync();
  if (result.isSuccess) {
    res.sendCommonValue(200, "success", result.data);
  } else {
    res.sendCommonValue(500, "fail", result.message);
  }
};

const getById = async (req, res) => {
  const id = req.params.id;
  const result = await courseofferingService.getByIdAsync(id);
  if (result.isSuccess) {
    res.sendCommonValue(200, "success", result.data);
  } else {
    res.sendCommonValue(404, "fail", result.message);
  }
};

const create = async (req, res) => {
  const payload = req.body;
  const result = await courseofferingService.createAsync(payload);
  if (result.isSuccess) {
    res.sendCommonValue(201, "success", result.data);
  } else {
    res.sendCommonValue(400, "fail", result.message);
  }
};

const update = async (req, res) => {
  const id = req.params.id;
  const payload = req.body;
  const result = await courseofferingService.updateAsync(id, payload);
  if (result.isSuccess) {
    res.sendCommonValue(200, "success", result.data);
  } else {
    res.sendCommonValue(result.statusCode || 400, "fail", result.message);
  }
};

const deleteOne = async (req, res) => {
  const id = req.params.id;
  const result = await courseofferingService.deleteAsync(id);
  if(!result.isSuccess&&result.statusCode===404){
    return res.sendStatus(204);
  }
  if(result.isSuccess){
    return res.sendStatus(204);
  }

  return res.sendCommonValue(result.statusCode || 400, "fail", result.message);
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  deleteOne,
};

