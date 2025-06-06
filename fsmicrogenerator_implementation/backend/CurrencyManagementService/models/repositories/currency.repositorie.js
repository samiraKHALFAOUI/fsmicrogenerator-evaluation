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
const Currency = require("../currency.model");

exports.AddData = async (req, populate) => {
  const result = await addData(req, Currency, populate);
  await cache.invalidateTag("currency");
  return result;
};

exports.AddOrUpdateMany = async (req, populate) => {
  const result = await insertOrUpdateMany(req, Currency, populate);
  await cache.invalidateTag("currency");
  return result;
};

exports.AddMany = async (req, populate) => {
  const result = await addMany(req, Currency, populate);
  await cache.invalidateTag("currency");
  return result;
};

exports.FindAll = async (req, populate, condition, options = null) => {
  const key = cache.generateCacheKey("currency", "all", {
    condition,
    populate,
    options,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getData(req, Currency, populate, condition, options);
  if (result) await cache.set(key, result, ["currency"]);
  return result;
};

exports.FindById = async (req, populate, options = null) => {
  const id = req.params.id;
  const key = cache.generateCacheKey("currency", "byId", {
    id,
    populate,
    options,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getDataById(req, Currency, populate, options);
  if (result) await cache.set(key, result, ["currency"]);
  return result;
};

exports.FindOne = async (req, populate, condition, options = null) => {
  const key = cache.generateCacheKey("currency", "one", {
    condition,
    populate,
    options,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getOne(req, Currency, populate, condition, options);
  if (result) await cache.set(key, result, ["currency"]);
  return result;
};

exports.UpdateData = async (req, populate) => {
  const result = await updateData(req, Currency, populate);
  await cache.invalidateTag("currency");
  return result;
};

exports.UpdateMany = async (req, populate) => {
  const result = await updateMany(req, Currency, populate);
  await cache.invalidateTag("currency");
  return result;
};

exports.ChangeState = async (condition) => {
  const result = await changeState(condition, Currency);
  await cache.invalidateTag("currency");
  return result;
};

exports.DeleteData = async (condition) => {
  const result = await deleteData(condition, Currency);
  await cache.invalidateTag("currency");
  return result;
};

exports.GetStatistiques = async (configuration) => {
  const key = cache.generateCacheKey("currency", "statistiques", {
    configuration,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getStatistiques(configuration, Currency);
  if (result) await cache.set(key, result, ["currency"]);
  return result;
};
