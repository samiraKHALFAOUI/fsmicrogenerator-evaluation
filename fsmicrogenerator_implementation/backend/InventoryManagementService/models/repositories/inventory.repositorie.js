const {
  addData,
  insertOrUpdateMany,
  addMany,
  getData,
  getDataById,
  getOne,
  updateData,
  updateMany,
  changeState,
  deleteData,
  getStatistiques,
} = require("../../helpers/helpers");

const cache = require("../../cache/redis.service");
const Inventory = require("../inventory.model");

exports.AddData = async (req, populate) => {
  const result = await addData(req, Inventory, populate);
  await cache.invalidateTag("inventory");
  return result;
};

exports.AddOrUpdateMany = async (req, populate) => {
  const result = await insertOrUpdateMany(req, Inventory, populate);
  await cache.invalidateTag("inventory");
  return result;
};

exports.AddMany = async (req, populate) => {
  const result = await addMany(req, Inventory, populate);
  await cache.invalidateTag("inventory");
  return result;
};

exports.FindAll = async (req, populate, condition, options = null) => {
  const key = cache.generateCacheKey("inventory", "all", {
    condition,
    populate,
    options,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getData(req, Inventory, populate, condition, options);
  if (result) await cache.set(key, result, ["inventory"]);
  return result;
};

exports.FindById = async (req, populate, options = null) => {
  const id = req.params.id;
  const key = cache.generateCacheKey("inventory", "byId", {
    id,
    populate,
    options,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getDataById(req, Inventory, populate, options);
  if (result) await cache.set(key, result, ["inventory"]);
  return result;
};

exports.FindOne = async (req, populate, condition, options = null) => {
  const key = cache.generateCacheKey("inventory", "one", {
    condition,
    populate,
    options,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getOne(req, Inventory, populate, condition, options);
  if (result) await cache.set(key, result, ["inventory"]);
  return result;
};

exports.UpdateData = async (req, populate) => {
  const result = await updateData(req, Inventory, populate);
  await cache.invalidateTag("inventory");
  return result;
};

exports.UpdateMany = async (req, populate) => {
  const result = await updateMany(req, Inventory, populate);
  await cache.invalidateTag("inventory");
  return result;
};

exports.ChangeState = async (condition) => {
  const result = await changeState(condition, Inventory);
  await cache.invalidateTag("inventory");
  return result;
};

exports.DeleteData = async (condition) => {
  const result = await deleteData(condition, Inventory);
  await cache.invalidateTag("inventory");
  return result;
};

exports.GetStatistiques = async (configuration) => {
  const key = cache.generateCacheKey("inventory", "statistiques", {
    configuration,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getStatistiques(configuration, Inventory);
  if (result) await cache.set(key, result, ["inventory"]);
  return result;
};
