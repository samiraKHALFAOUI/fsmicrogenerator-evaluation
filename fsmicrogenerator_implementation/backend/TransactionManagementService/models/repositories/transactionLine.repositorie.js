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
const TransactionLine = require("../transactionLine.model");

exports.AddData = async (req, populate) => {
  const result = await addData(req, TransactionLine, populate);
  await cache.invalidateTag("transactionline");
  return result;
};

exports.AddOrUpdateMany = async (req, populate) => {
  const result = await insertOrUpdateMany(req, TransactionLine, populate);
  await cache.invalidateTag("transactionline");
  return result;
};

exports.AddMany = async (req, populate) => {
  const result = await addMany(req, TransactionLine, populate);
  await cache.invalidateTag("transactionline");
  return result;
};

exports.FindAll = async (req, populate, condition, options = null) => {
  const key = cache.generateCacheKey("transactionline", "all", {
    condition,
    populate,
    options,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getData(
    req,
    TransactionLine,
    populate,
    condition,
    options
  );
  if (result) await cache.set(key, result, ["transactionline"]);
  return result;
};

exports.FindById = async (req, populate, options = null) => {
  const id = req.params.id;
  const key = cache.generateCacheKey("transactionline", "byId", {
    id,
    populate,
    options,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getDataById(req, TransactionLine, populate, options);
  if (result) await cache.set(key, result, ["transactionline"]);
  return result;
};

exports.FindOne = async (req, populate, condition, options = null) => {
  const key = cache.generateCacheKey("transactionline", "one", {
    condition,
    populate,
    options,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getOne(
    req,
    TransactionLine,
    populate,
    condition,
    options
  );
  if (result) await cache.set(key, result, ["transactionline"]);
  return result;
};

exports.UpdateData = async (req, populate) => {
  const result = await updateData(req, TransactionLine, populate);
  await cache.invalidateTag("transactionline");
  return result;
};

exports.UpdateMany = async (req, populate) => {
  const result = await updateMany(req, TransactionLine, populate);
  await cache.invalidateTag("transactionline");
  return result;
};

exports.ChangeState = async (condition) => {
  const result = await changeState(condition, TransactionLine);
  await cache.invalidateTag("transactionline");
  return result;
};

exports.DeleteData = async (condition) => {
  const result = await deleteData(condition, TransactionLine);
  await cache.invalidateTag("transactionline");
  return result;
};

exports.GetStatistiques = async (configuration) => {
  const key = cache.generateCacheKey("transactionline", "statistiques", {
    configuration,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getStatistiques(configuration, TransactionLine);
  if (result) await cache.set(key, result, ["transactionline"]);
  return result;
};
