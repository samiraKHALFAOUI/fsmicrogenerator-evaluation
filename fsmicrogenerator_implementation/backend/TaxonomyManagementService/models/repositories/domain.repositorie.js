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
const Domain = require("../domain.model");

exports.AddData = async (req, populate) => {
  const result = await addData(req, Domain, populate);
  await cache.invalidateTag("domain");
  return result;
};

exports.AddOrUpdateMany = async (req, populate) => {
  const result = await insertOrUpdateMany(req, Domain, populate);
  await cache.invalidateTag("domain");
  return result;
};

exports.AddMany = async (req, populate) => {
  const result = await addMany(req, Domain, populate);
  await cache.invalidateTag("domain");
  return result;
};

exports.FindAll = async (req, populate, condition, options = null) => {
  const key = cache.generateCacheKey("domain", "all", {
    condition,
    populate,
    options,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getData(req, Domain, populate, condition, options);
  if (result) await cache.set(key, result, ["domain"]);
  return result;
};

exports.FindById = async (req, populate, options = null) => {
  const id = req.params.id;
  const key = cache.generateCacheKey("domain", "byId", {
    id,
    populate,
    options,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getDataById(req, Domain, populate, options);
  if (result) await cache.set(key, result, ["domain"]);
  return result;
};

exports.FindOne = async (req, populate, condition, options = null) => {
  const key = cache.generateCacheKey("domain", "one", {
    condition,
    populate,
    options,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getOne(req, Domain, populate, condition, options);
  if (result) await cache.set(key, result, ["domain"]);
  return result;
};

exports.UpdateData = async (req, populate) => {
  const result = await updateData(req, Domain, populate);
  await cache.invalidateTag("domain");
  return result;
};

exports.GetTranslation = async (req) => {
  const { id } = req.params;
  const { lang } =
    req.headers[process.env.LANGUAGE_FIELD_NAME] ||
    req.headers[process.env.DEFAULT_LANGUAGE_FIELD_NAME];
  const key = cache.generateCacheKey("domain", "translation", { id, lang });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getDataTranslations(req, Domain);
  if (result) await cache.set(key, result, ["domain"]);
  return result;
};

exports.TranslateData = async (req) => {
  const result = await updateData(req, Domain);
  await cache.invalidateTag("domain");
  return result;
};

exports.UpdateMany = async (req, populate) => {
  const result = await updateMany(req, Domain, populate);
  await cache.invalidateTag("domain");
  return result;
};

exports.ChangeState = async (condition) => {
  const result = await changeState(condition, Domain);
  await cache.invalidateTag("domain");
  return result;
};

exports.DeleteData = async (condition) => {
  const result = await deleteData(condition, Domain);
  await cache.invalidateTag("domain");
  return result;
};

exports.GetStatistiques = async (configuration) => {
  const key = cache.generateCacheKey("domain", "statistiques", {
    configuration,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getStatistiques(configuration, Domain);
  if (result) await cache.set(key, result, ["domain"]);
  return result;
};
