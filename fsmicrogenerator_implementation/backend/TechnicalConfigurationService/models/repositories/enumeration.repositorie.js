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
const Enumeration = require("../enumeration.model");

exports.AddData = async (req, populate) => {
  const result = await addData(req, Enumeration, populate);
  await cache.invalidateTag("enumeration");
  return result;
};

exports.AddOrUpdateMany = async (req, populate) => {
  const result = await insertOrUpdateMany(req, Enumeration, populate);
  await cache.invalidateTag("enumeration");
  return result;
};

exports.AddMany = async (req, populate) => {
  const result = await addMany(req, Enumeration, populate);
  await cache.invalidateTag("enumeration");
  return result;
};

exports.FindAll = async (req, populate, condition, options = null) => {
  const key = cache.generateCacheKey("enumeration", "all", {
    condition,
    populate,
    options,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getData(req, Enumeration, populate, condition, options);
  if (result) await cache.set(key, result, ["enumeration"]);
  return result;
};

exports.FindById = async (req, populate, options = null) => {
  const id = req.params.id;
  const key = cache.generateCacheKey("enumeration", "byId", {
    id,
    populate,
    options,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getDataById(req, Enumeration, populate, options);
  if (result) await cache.set(key, result, ["enumeration"]);
  return result;
};

exports.FindOne = async (req, populate, condition, options = null) => {
  const key = cache.generateCacheKey("enumeration", "one", {
    condition,
    populate,
    options,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getOne(req, Enumeration, populate, condition, options);
  if (result) await cache.set(key, result, ["enumeration"]);
  return result;
};

exports.UpdateData = async (req, populate) => {
  const result = await updateData(req, Enumeration, populate);
  await cache.invalidateTag("enumeration");
  return result;
};

exports.GetTranslation = async (req) => {
  const { id } = req.params;
  const { lang } =
    req.headers[process.env.LANGUAGE_FIELD_NAME] ||
    req.headers[process.env.DEFAULT_LANGUAGE_FIELD_NAME];
  const key = cache.generateCacheKey("enumeration", "translation", {
    id,
    lang,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getDataTranslations(req, Enumeration);
  if (result) await cache.set(key, result, ["enumeration"]);
  return result;
};

exports.TranslateData = async (req) => {
  const result = await updateData(req, Enumeration);
  await cache.invalidateTag("enumeration");
  return result;
};

exports.UpdateMany = async (req, populate) => {
  const result = await updateMany(req, Enumeration, populate);
  await cache.invalidateTag("enumeration");
  return result;
};

exports.ChangeState = async (condition) => {
  const result = await changeState(condition, Enumeration);
  await cache.invalidateTag("enumeration");
  return result;
};

exports.DeleteData = async (condition) => {
  const result = await deleteData(condition, Enumeration);
  await cache.invalidateTag("enumeration");
  return result;
};

exports.GetStatistiques = async (configuration) => {
  const key = cache.generateCacheKey("enumeration", "statistiques", {
    configuration,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getStatistiques(configuration, Enumeration);
  if (result) await cache.set(key, result, ["enumeration"]);
  return result;
};
