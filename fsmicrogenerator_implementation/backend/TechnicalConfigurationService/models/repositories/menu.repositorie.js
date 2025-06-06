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
const Menu = require("../menu.model");

exports.AddData = async (req, populate) => {
  const result = await addData(req, Menu, populate);
  await cache.invalidateTag("menu");
  return result;
};

exports.AddOrUpdateMany = async (req, populate) => {
  const result = await insertOrUpdateMany(req, Menu, populate);
  await cache.invalidateTag("menu");
  return result;
};

exports.AddMany = async (req, populate) => {
  const result = await addMany(req, Menu, populate);
  await cache.invalidateTag("menu");
  return result;
};

exports.FindAll = async (req, populate, condition, options = null) => {
  const key = cache.generateCacheKey("menu", "all", {
    condition,
    populate,
    options,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getData(req, Menu, populate, condition, options);
  if (result) await cache.set(key, result, ["menu"]);
  return result;
};

exports.FindById = async (req, populate, options = null) => {
  const id = req.params.id;
  const key = cache.generateCacheKey("menu", "byId", { id, populate, options });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getDataById(req, Menu, populate, options);
  if (result) await cache.set(key, result, ["menu"]);
  return result;
};

exports.FindOne = async (req, populate, condition, options = null) => {
  const key = cache.generateCacheKey("menu", "one", {
    condition,
    populate,
    options,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getOne(req, Menu, populate, condition, options);
  if (result) await cache.set(key, result, ["menu"]);
  return result;
};

exports.UpdateData = async (req, populate) => {
  const result = await updateData(req, Menu, populate);
  await cache.invalidateTag("menu");
  return result;
};

exports.GetTranslation = async (req) => {
  const { id } = req.params;
  const { lang } =
    req.headers[process.env.LANGUAGE_FIELD_NAME] ||
    req.headers[process.env.DEFAULT_LANGUAGE_FIELD_NAME];
  const key = cache.generateCacheKey("menu", "translation", { id, lang });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getDataTranslations(req, Menu);
  if (result) await cache.set(key, result, ["menu"]);
  return result;
};

exports.TranslateData = async (req) => {
  const result = await updateData(req, Menu);
  await cache.invalidateTag("menu");
  return result;
};

exports.UpdateMany = async (req, populate) => {
  const result = await updateMany(req, Menu, populate);
  await cache.invalidateTag("menu");
  return result;
};

exports.ChangeState = async (condition) => {
  const result = await changeState(condition, Menu);
  await cache.invalidateTag("menu");
  return result;
};

exports.DeleteData = async (condition) => {
  const result = await deleteData(condition, Menu);
  await cache.invalidateTag("menu");
  return result;
};

exports.GetStatistiques = async (configuration) => {
  const key = cache.generateCacheKey("menu", "statistiques", { configuration });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getStatistiques(configuration, Menu);
  if (result) await cache.set(key, result, ["menu"]);
  return result;
};
