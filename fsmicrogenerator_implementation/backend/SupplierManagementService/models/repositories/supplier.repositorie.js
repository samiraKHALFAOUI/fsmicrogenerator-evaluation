const {
  addData,
  insertOrUpdateMany,
  addMany,
  getData,
  getDataById,
  getOne,
  updateData,
  getDataTranslations,
  updateMany,
  changeState,
  deleteData,
  getStatistiques,
} = require("../../helpers/helpers");

const cache = require("../../cache/redis.service");
const Supplier = require("../supplier.model");

exports.AddData = async (req, populate) => {
  const result = await addData(req, Supplier, populate);
  await cache.invalidateTag("supplier");
  return result;
};

exports.AddOrUpdateMany = async (req, populate) => {
  const result = await insertOrUpdateMany(req, Supplier, populate);
  await cache.invalidateTag("supplier");
  return result;
};

exports.AddMany = async (req, populate) => {
  const result = await addMany(req, Supplier, populate);
  await cache.invalidateTag("supplier");
  return result;
};

exports.FindAll = async (req, populate, condition, options = null) => {
  const key = cache.generateCacheKey("supplier", "all", {
    condition,
    populate,
    options,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getData(req, Supplier, populate, condition, options);
  if (result) await cache.set(key, result, ["supplier"]);
  return result;
};

exports.FindById = async (req, populate, options = null) => {
  const id = req.params.id;
  const key = cache.generateCacheKey("supplier", "byId", {
    id,
    populate,
    options,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getDataById(req, Supplier, populate, options);
  if (result) await cache.set(key, result, ["supplier"]);
  return result;
};

exports.FindOne = async (req, populate, condition, options = null) => {
  const key = cache.generateCacheKey("supplier", "one", {
    condition,
    populate,
    options,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getOne(req, Supplier, populate, condition, options);
  if (result) await cache.set(key, result, ["supplier"]);
  return result;
};

exports.UpdateData = async (req, populate) => {
  const result = await updateData(req, Supplier, populate);
  await cache.invalidateTag("supplier");
  return result;
};

exports.GetTranslation = async (req) => {
  const { id } = req.params;
  const { lang } =
    req.headers[process.env.LANGUAGE_FIELD_NAME] ||
    req.headers[process.env.DEFAULT_LANGUAGE_FIELD_NAME];
  const key = cache.generateCacheKey("supplier", "translation", { id, lang });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getDataTranslations(req, Supplier);
  if (result) await cache.set(key, result, ["supplier"]);
  return result;
};

exports.TranslateData = async (req) => {
  const result = await updateData(req, Supplier);
  await cache.invalidateTag("supplier");
  return result;
};

exports.UpdateMany = async (req, populate) => {
  const result = await updateMany(req, Supplier, populate);
  await cache.invalidateTag("supplier");
  return result;
};

exports.ChangeState = async (condition) => {
  const result = await changeState(condition, Supplier);
  await cache.invalidateTag("supplier");
  return result;
};

exports.DeleteData = async (condition) => {
  const result = await deleteData(condition, Supplier);
  await cache.invalidateTag("supplier");
  return result;
};

exports.GetStatistiques = async (configuration) => {
  const key = cache.generateCacheKey("supplier", "statistiques", {
    configuration,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getStatistiques(configuration, Supplier);
  if (result) await cache.set(key, result, ["supplier"]);
  return result;
};
