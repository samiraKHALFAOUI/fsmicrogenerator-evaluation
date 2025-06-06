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
  updateOrdre,
  getDataTranslations,
  getStatistiques,
} = require("../../helpers/helpers");

const cache = require("../../cache/redis.service");
const LangueSite = require("../langueSite.model");

exports.AddData = async (req, populate) => {
  const result = await addData(req, LangueSite, populate);
  await cache.invalidateTag("languesite");
  return result;
};

exports.AddOrUpdateMany = async (req, populate) => {
  const result = await insertOrUpdateMany(req, LangueSite, populate);
  await cache.invalidateTag("languesite");
  return result;
};

exports.AddMany = async (req, populate) => {
  const result = await addMany(req, LangueSite, populate);
  await cache.invalidateTag("languesite");
  return result;
};

exports.FindAll = async (req, populate, condition, options = null) => {
  const key = cache.generateCacheKey("languesite", "all", {
    condition,
    populate,
    options,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getData(req, LangueSite, populate, condition, options);
  if (result) await cache.set(key, result, ["languesite"]);
  return result;
};

exports.FindById = async (req, populate, options = null) => {
  const id = req.params.id;
  const key = cache.generateCacheKey("languesite", "byId", {
    id,
    populate,
    options,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getDataById(req, LangueSite, populate, options);
  if (result) await cache.set(key, result, ["languesite"]);
  return result;
};

exports.FindOne = async (req, populate, condition, options = null) => {
  const key = cache.generateCacheKey("languesite", "one", {
    condition,
    populate,
    options,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getOne(req, LangueSite, populate, condition, options);
  if (result) await cache.set(key, result, ["languesite"]);
  return result;
};

exports.UpdateData = async (req, populate) => {
  const result = await updateData(req, LangueSite, populate);
  await cache.invalidateTag("languesite");
  return result;
};

exports.GetTranslation = async (req) => {
  const { id } = req.params;
  const { lang } =
    req.headers[process.env.LANGUAGE_FIELD_NAME] ||
    req.headers[process.env.DEFAULT_LANGUAGE_FIELD_NAME];
  const key = cache.generateCacheKey("languesite", "translation", { id, lang });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getDataTranslations(req, LangueSite);
  if (result) await cache.set(key, result, ["languesite"]);
  return result;
};

exports.TranslateData = async (req) => {
  const result = await updateData(req, LangueSite);
  await cache.invalidateTag("languesite");
  return result;
};

exports.UpdateMany = async (req, populate) => {
  const result = await updateMany(req, LangueSite, populate);
  await cache.invalidateTag("languesite");
  return result;
};

exports.UpdateOrdre = async (req) => {
  return await updateOrdre(req, LangueSite);
};

exports.ChangeState = async (condition) => {
  const result = await changeState(condition, LangueSite);
  await cache.invalidateTag("languesite");
  return result;
};

exports.DeleteData = async (condition) => {
  const result = await deleteData(condition, LangueSite);
  await cache.invalidateTag("languesite");
  return result;
};

exports.GetStatistiques = async (configuration) => {
  const key = cache.generateCacheKey("languesite", "statistiques", {
    configuration,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getStatistiques(configuration, LangueSite);
  if (result) await cache.set(key, result, ["languesite"]);
  return result;
};
