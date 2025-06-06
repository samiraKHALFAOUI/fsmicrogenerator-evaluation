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
const ExchangeRate = require("../exchangeRate.model");

exports.AddData = async (req, populate) => {
  const result = await addData(req, ExchangeRate, populate);
  await cache.invalidateTag("exchangerate");
  return result;
};

exports.AddOrUpdateMany = async (req, populate) => {
  const result = await insertOrUpdateMany(req, ExchangeRate, populate);
  await cache.invalidateTag("exchangerate");
  return result;
};

exports.AddMany = async (req, populate) => {
  const result = await addMany(req, ExchangeRate, populate);
  await cache.invalidateTag("exchangerate");
  return result;
};

exports.FindAll = async (req, populate, condition, options = null) => {
  const key = cache.generateCacheKey("exchangerate", "all", {
    condition,
    populate,
    options,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getData(req, ExchangeRate, populate, condition, options);
  if (result) await cache.set(key, result, ["exchangerate"]);
  return result;
};

exports.FindById = async (req, populate, options = null) => {
  const id = req.params.id;
  const key = cache.generateCacheKey("exchangerate", "byId", {
    id,
    populate,
    options,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getDataById(req, ExchangeRate, populate, options);
  if (result) await cache.set(key, result, ["exchangerate"]);
  return result;
};

exports.FindOne = async (req, populate, condition, options = null) => {
  const key = cache.generateCacheKey("exchangerate", "one", {
    condition,
    populate,
    options,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getOne(req, ExchangeRate, populate, condition, options);
  if (result) await cache.set(key, result, ["exchangerate"]);
  return result;
};

exports.UpdateData = async (req, populate) => {
  const result = await updateData(req, ExchangeRate, populate);
  await cache.invalidateTag("exchangerate");
  return result;
};

exports.UpdateMany = async (req, populate) => {
  const result = await updateMany(req, ExchangeRate, populate);
  await cache.invalidateTag("exchangerate");
  return result;
};

exports.ChangeState = async (condition) => {
  const result = await changeState(condition, ExchangeRate);
  await cache.invalidateTag("exchangerate");
  return result;
};

exports.DeleteData = async (condition) => {
  const result = await deleteData(condition, ExchangeRate);
  await cache.invalidateTag("exchangerate");
  return result;
};

exports.GetStatistiques = async (configuration) => {
  const key = cache.generateCacheKey("exchangerate", "statistiques", {
    configuration,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getStatistiques(configuration, ExchangeRate);
  if (result) await cache.set(key, result, ["exchangerate"]);
  return result;
};
