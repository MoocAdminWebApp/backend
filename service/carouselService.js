const db = require("../models"); 
const Carousel = db.Carousel; // 
const { Op } = require("sequelize");
const cacheHelper = require("../common/cache/cacheHelper");
const { EntityAlreadyExistsException, EntityNotFoundException } = require("../common/commonError");
/**
 * key
 * @returns all cache key
 */
function getALLCacheKey() {
  //Return all cached keys
  return "carousel_all";
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
    whereClause.id = { [Op.ne]: id };
  }

  const existingCarousel = await Carousel.findOne({
    where: whereClause,
    attributes: ["id"], // Only querying the ID field improves efficiency
    raw: true, // Return pure JSON objects instead of model instances
  });

  if (existingCarousel) {
    throw new EntityAlreadyExistsException("title already exists");
  }
};

/**
 * add carousel
 * @param {*} carousel
 * @returns
 */
const createAsync = async carousel => {
  await checkTitleExists(carousel.title);

  var newCarousel = await Carousel.create({
    title: carousel.title,
    description: carousel.description,
    orderNum: carousel.orderNum,
    imageUrl: carousel.imageUrl,
    linkUrl: carousel.linkUrl,
    active: carousel.active,
  });

  await cacheHelper.delAsync(getALLCacheKey());

  return {
    isSuccess: newCarousel.id > 0 ? true : false,
    message: "",
    data: newCarousel,
  };
};

/**
 *
 * @param {*} id
 */
const checkCarouselExists = async id => {
  var carousel = await Carousel.findByPk(id);
  if (!carousel) {
    throw new EntityNotFoundException("carousel not exists");
  }
};

/**
 *update carousel
 * @param {*} carousel
 */
const updateAsync = async carousel => {
  await checkCarouselExists(carousel.id);

  await checkTitleExists(carousel.title, carousel.id);

  var updateCarousel = await Carousel.update(
    {
      title: carousel.title,
      description: carousel.description,
      orderNum: carousel.orderNum,
      imageUrl: carousel.imageUrl,
      linkUrl: carousel.linkUrl,
      active: carousel.active,
    },
    {
      where: { id: carousel.id },
    }
  );
  return { isSuccess: true, message: "", data: updateCarousel };
};

/**
 * all carousel
 * @returns
 */
const getAllAsync = async () => {
  let cacheValue = await cacheHelper.getAsync(getALLCacheKey());
  if (cacheValue) {
    return { isSuccess: true, message: "", data: JSON.parse(cacheValue) };
  }
  var allCarousel = await Carousel.findAll();
  if (allCarousel) {
    await cacheHelper.setAsync(getALLCacheKey(), JSON.stringify(allCarousel), 10);
  }
  return { isSuccess: true, message: "", data: allCarousel };
};

/**
 * paginate carousel
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

  const { count, rows } = await Carousel.findAndCountAll({
    where: whereClause,
    limit: pageSize,
    offset: parseInt(offset),
    order: [["id", "ASC"]],
  });

  return { isSuccess: true, message: "", data: { total: count, items: rows } };
};

/**
 * delete carousel by id
 * @param {*} id
 * @returns
 */
const deleteAsync = async id => {
  await checkCarouselExists(id);

  var deleteCarousel = await Carousel.destroy({
    where: { id: id },
  });
  return { isSuccess: true, message: "", data: deleteCarousel };
};

/**
 * get carousel by id
 * @param {*} id
 * @returns
 */
const getByIdAsync = async id => {
  var carousel = await Carousel.findByPk(id);
  if (!carousel) {
    throw new EntityNotFoundException("carousel not exists");
  }
  return { isSuccess: true, message: "", data: carousel };
};

module.exports = {
  createAsync,
  updateAsync,
  getAllAsync,
  pageAsync,
  deleteAsync,
  getByIdAsync,
};
