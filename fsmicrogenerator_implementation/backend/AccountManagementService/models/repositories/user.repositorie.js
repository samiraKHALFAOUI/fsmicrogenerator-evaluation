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
const User = require("../user.model");

exports.AddData = async (req, populate) => {
  const result = await addData(req, User, populate);
  await cache.invalidateTag("user");
  return result;
};

exports.AddOrUpdateMany = async (req, populate) => {
  const result = await insertOrUpdateMany(req, User, populate);
  await cache.invalidateTag("user");
  return result;
};

exports.AddMany = async (req, populate) => {
  const result = await addMany(req, User, populate);
  await cache.invalidateTag("user");
  return result;
};

exports.FindAll = async (req, populate, condition, options = null) => {
  const key = cache.generateCacheKey("user", "all", {
    condition,
    populate,
    options,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getData(req, User, populate, condition, options);
  if (result) await cache.set(key, result, ["user"]);
  return result;
};

exports.FindById = async (req, populate, options = null) => {
  const id = req.params.id;
  const key = cache.generateCacheKey("user", "byId", { id, populate, options });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getDataById(req, User, populate, options);
  if (result) await cache.set(key, result, ["user"]);
  return result;
};

exports.FindOne = async (req, populate, condition, options = null) => {
  const key = cache.generateCacheKey("user", "one", {
    condition,
    populate,
    options,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getOne(req, User, populate, condition, options);
  if (result) await cache.set(key, result, ["user"]);
  return result;
};

exports.UpdateData = async (req, populate) => {
  const result = await updateData(req, User, populate);
  await cache.invalidateTag("user");
  return result;
};

exports.GetTranslation = async (req) => {
  const { id } = req.params;
  const { lang } =
    req.headers[process.env.LANGUAGE_FIELD_NAME] ||
    req.headers[process.env.DEFAULT_LANGUAGE_FIELD_NAME];
  const key = cache.generateCacheKey("user", "translation", { id, lang });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getDataTranslations(req, User);
  if (result) await cache.set(key, result, ["user"]);
  return result;
};

exports.TranslateData = async (req) => {
  const result = await updateData(req, User);
  await cache.invalidateTag("user");
  return result;
};

exports.UpdateMany = async (req, populate) => {
  const result = await updateMany(req, User, populate);
  await cache.invalidateTag("user");
  return result;
};

exports.ChangeState = async (condition) => {
  const result = await changeState(condition, User);
  await cache.invalidateTag("user");
  return result;
};

exports.DeleteData = async (condition) => {
  const result = await deleteData(condition, User);
  await cache.invalidateTag("user");
  return result;
};

exports.GetStatistiques = async (configuration) => {
  const key = cache.generateCacheKey("user", "statistiques", { configuration });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getStatistiques(configuration, User);
  if (result) await cache.set(key, result, ["user"]);
  return result;
};
