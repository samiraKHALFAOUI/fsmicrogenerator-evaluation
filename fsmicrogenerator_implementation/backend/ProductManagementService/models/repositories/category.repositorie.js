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
const Category = require("../category.model");

exports.AddData = async (req, populate) => {
  const result = await addData(req, Category, populate);
  await cache.invalidateTag("category");
  return result;
};

exports.AddOrUpdateMany = async (req, populate) => {
  const result = await insertOrUpdateMany(req, Category, populate);
  await cache.invalidateTag("category");
  return result;
};

exports.AddMany = async (req, populate) => {
  const result = await addMany(req, Category, populate);
  await cache.invalidateTag("category");
  return result;
};

exports.FindAll = async (req, populate, condition, options = null) => {
  const key = cache.generateCacheKey("category", "all", {
    condition,
    populate,
    options,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getData(req, Category, populate, condition, options);
  if (result) await cache.set(key, result, ["category"]);
  return result;
};

exports.FindById = async (req, populate, options = null) => {
  const id = req.params.id;
  const key = cache.generateCacheKey("category", "byId", {
    id,
    populate,
    options,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getDataById(req, Category, populate, options);
  if (result) await cache.set(key, result, ["category"]);
  return result;
};

exports.FindOne = async (req, populate, condition, options = null) => {
  const key = cache.generateCacheKey("category", "one", {
    condition,
    populate,
    options,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getOne(req, Category, populate, condition, options);
  if (result) await cache.set(key, result, ["category"]);
  return result;
};

exports.UpdateData = async (req, populate) => {
  const result = await updateData(req, Category, populate);
  await cache.invalidateTag("category");
  return result;
};

exports.GetTranslation = async (req) => {
  const { id } = req.params;
  const { lang } =
    req.headers[process.env.LANGUAGE_FIELD_NAME] ||
    req.headers[process.env.DEFAULT_LANGUAGE_FIELD_NAME];
  const key = cache.generateCacheKey("category", "translation", { id, lang });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getDataTranslations(req, Category);
  if (result) await cache.set(key, result, ["category"]);
  return result;
};

exports.TranslateData = async (req) => {
  const result = await updateData(req, Category);
  await cache.invalidateTag("category");
  return result;
};

exports.UpdateMany = async (req, populate) => {
  const result = await updateMany(req, Category, populate);
  await cache.invalidateTag("category");
  return result;
};

exports.ChangeState = async (condition) => {
  const result = await changeState(condition, Category);
  await cache.invalidateTag("category");
  return result;
};

exports.DeleteData = async (condition) => {
  const result = await deleteData(condition, Category);
  await cache.invalidateTag("category");
  return result;
};

exports.GetStatistiques = async (configuration) => {
  const key = cache.generateCacheKey("category", "statistiques", {
    configuration,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getStatistiques(configuration, Category);
  if (result) await cache.set(key, result, ["category"]);
  return result;
};
