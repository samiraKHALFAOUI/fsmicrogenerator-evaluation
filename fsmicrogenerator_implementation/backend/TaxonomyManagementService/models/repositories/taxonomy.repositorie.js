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
const Taxonomy = require("../taxonomy.model");

exports.AddData = async (req, populate) => {
  const result = await addData(req, Taxonomy, populate);
  await cache.invalidateTag("taxonomy");
  return result;
};

exports.AddOrUpdateMany = async (req, populate) => {
  const result = await insertOrUpdateMany(req, Taxonomy, populate);
  await cache.invalidateTag("taxonomy");
  return result;
};

exports.AddMany = async (req, populate) => {
  const result = await addMany(req, Taxonomy, populate);
  await cache.invalidateTag("taxonomy");
  return result;
};

exports.FindAll = async (req, populate, condition, options = null) => {
  const key = cache.generateCacheKey("taxonomy", "all", {
    condition,
    populate,
    options,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getData(req, Taxonomy, populate, condition, options);
  if (result) await cache.set(key, result, ["taxonomy"]);
  return result;
};

exports.FindById = async (req, populate, options = null) => {
  const id = req.params.id;
  const key = cache.generateCacheKey("taxonomy", "byId", {
    id,
    populate,
    options,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getDataById(req, Taxonomy, populate, options);
  if (result) await cache.set(key, result, ["taxonomy"]);
  return result;
};

exports.FindOne = async (req, populate, condition, options = null) => {
  const key = cache.generateCacheKey("taxonomy", "one", {
    condition,
    populate,
    options,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getOne(req, Taxonomy, populate, condition, options);
  if (result) await cache.set(key, result, ["taxonomy"]);
  return result;
};

exports.UpdateData = async (req, populate) => {
  const result = await updateData(req, Taxonomy, populate);
  await cache.invalidateTag("taxonomy");
  return result;
};

exports.GetTranslation = async (req) => {
  const { id } = req.params;
  const { lang } =
    req.headers[process.env.LANGUAGE_FIELD_NAME] ||
    req.headers[process.env.DEFAULT_LANGUAGE_FIELD_NAME];
  const key = cache.generateCacheKey("taxonomy", "translation", { id, lang });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getDataTranslations(req, Taxonomy);
  if (result) await cache.set(key, result, ["taxonomy"]);
  return result;
};

exports.TranslateData = async (req) => {
  const result = await updateData(req, Taxonomy);
  await cache.invalidateTag("taxonomy");
  return result;
};

exports.UpdateMany = async (req, populate) => {
  const result = await updateMany(req, Taxonomy, populate);
  await cache.invalidateTag("taxonomy");
  return result;
};

exports.ChangeState = async (condition) => {
  const result = await changeState(condition, Taxonomy);
  await cache.invalidateTag("taxonomy");
  return result;
};

exports.DeleteData = async (condition) => {
  const result = await deleteData(condition, Taxonomy);
  await cache.invalidateTag("taxonomy");
  return result;
};

exports.GetStatistiques = async (configuration) => {
  const key = cache.generateCacheKey("taxonomy", "statistiques", {
    configuration,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getStatistiques(configuration, Taxonomy);
  if (result) await cache.set(key, result, ["taxonomy"]);
  return result;
};
