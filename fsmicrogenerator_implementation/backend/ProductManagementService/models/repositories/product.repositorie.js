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
const Product = require("../product.model");

exports.AddData = async (req, populate) => {
  const result = await addData(req, Product, populate);
  await cache.invalidateTag("product");
  return result;
};

exports.AddOrUpdateMany = async (req, populate) => {
  const result = await insertOrUpdateMany(req, Product, populate);
  await cache.invalidateTag("product");
  return result;
};

exports.AddMany = async (req, populate) => {
  const result = await addMany(req, Product, populate);
  await cache.invalidateTag("product");
  return result;
};

exports.FindAll = async (req, populate, condition, options = null) => {
  const key = cache.generateCacheKey("product", "all", {
    condition,
    populate,
    options,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getData(req, Product, populate, condition, options);
  if (result) await cache.set(key, result, ["product"]);
  return result;
};

exports.FindById = async (req, populate, options = null) => {
  const id = req.params.id;
  const key = cache.generateCacheKey("product", "byId", {
    id,
    populate,
    options,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getDataById(req, Product, populate, options);
  if (result) await cache.set(key, result, ["product"]);
  return result;
};

exports.FindOne = async (req, populate, condition, options = null) => {
  const key = cache.generateCacheKey("product", "one", {
    condition,
    populate,
    options,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getOne(req, Product, populate, condition, options);
  if (result) await cache.set(key, result, ["product"]);
  return result;
};

exports.UpdateData = async (req, populate) => {
  const result = await updateData(req, Product, populate);
  await cache.invalidateTag("product");
  return result;
};

exports.GetTranslation = async (req) => {
  const { id } = req.params;
  const { lang } =
    req.headers[process.env.LANGUAGE_FIELD_NAME] ||
    req.headers[process.env.DEFAULT_LANGUAGE_FIELD_NAME];
  const key = cache.generateCacheKey("product", "translation", { id, lang });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getDataTranslations(req, Product);
  if (result) await cache.set(key, result, ["product"]);
  return result;
};

exports.TranslateData = async (req) => {
  const result = await updateData(req, Product);
  await cache.invalidateTag("product");
  return result;
};

exports.UpdateMany = async (req, populate) => {
  const result = await updateMany(req, Product, populate);
  await cache.invalidateTag("product");
  return result;
};

exports.ChangeState = async (condition) => {
  const result = await changeState(condition, Product);
  await cache.invalidateTag("product");
  return result;
};

exports.DeleteData = async (condition) => {
  const result = await deleteData(condition, Product);
  await cache.invalidateTag("product");
  return result;
};

exports.GetStatistiques = async (configuration) => {
  const key = cache.generateCacheKey("product", "statistiques", {
    configuration,
  });
  const cached = await cache.get(key);
  if (cached) return cached;
  const result = await getStatistiques(configuration, Product);
  if (result) await cache.set(key, result, ["product"]);
  return result;
};
