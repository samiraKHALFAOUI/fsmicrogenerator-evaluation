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
const Transaction = require("../transaction.model");

exports.AddData = async (req, populate) => {
  const result = await addData(req, Transaction, populate);
  await cache.invalidateTag("transaction");
  return result;
};

exports.AddOrUpdateMany = async (req, populate) => {
  const result = await insertOrUpdateMany(req, Transaction, populate);
  await cache.invalidateTag("transaction");
  return result;
};

exports.AddMany = async (req, populate) => {
  const result = await addMany(req, Transaction, populate);
  await cache.invalidateTag("transaction");
  return result;
};

exports.FindAll = async (req, populate, condition, options = null) => {
  const key = cache.generateCacheKey("transaction", "all", {
    condition,
    populate,
    options,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getData(req, Transaction, populate, condition, options);
  if (result) await cache.set(key, result, ["transaction"]);
  return result;
};

exports.FindById = async (req, populate, options = null) => {
  const id = req.params.id;
  const key = cache.generateCacheKey("transaction", "byId", {
    id,
    populate,
    options,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getDataById(req, Transaction, populate, options);
  if (result) await cache.set(key, result, ["transaction"]);
  return result;
};

exports.FindOne = async (req, populate, condition, options = null) => {
  const key = cache.generateCacheKey("transaction", "one", {
    condition,
    populate,
    options,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getOne(req, Transaction, populate, condition, options);
  if (result) await cache.set(key, result, ["transaction"]);
  return result;
};

exports.UpdateData = async (req, populate) => {
  const result = await updateData(req, Transaction, populate);
  await cache.invalidateTag("transaction");
  return result;
};

exports.UpdateMany = async (req, populate) => {
  const result = await updateMany(req, Transaction, populate);
  await cache.invalidateTag("transaction");
  return result;
};

exports.ChangeState = async (condition) => {
  const result = await changeState(condition, Transaction);
  await cache.invalidateTag("transaction");
  return result;
};

exports.DeleteData = async (condition) => {
  const result = await deleteData(condition, Transaction);
  await cache.invalidateTag("transaction");
  return result;
};

exports.GetStatistiques = async (configuration) => {
  const key = cache.generateCacheKey("transaction", "statistiques", {
    configuration,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getStatistiques(configuration, Transaction);
  if (result) await cache.set(key, result, ["transaction"]);
  return result;
};
