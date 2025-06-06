const { Handler } = require("../helpers/helpers");
const {
  AddData,
  AddMany,
  FindAll,
  FindById,
  FindOne,
  GetTranslation,
  UpdateData,
  UpdateMany,
  ChangeState,
  TranslateData,
  UpdateOrdre,
  GetStatistiques,
  DeleteData,
} = require("../models/repositories/langueSite.repositorie");
const populate = "";

/**
 *
 * @type {Handler}
 */
exports.add = async (req, res) => {
  try {
    let data = await AddData(req, populate);
    return res.status(201).send(data);
  } catch (err) {
    return res.status(400).send(err);
  }
};

/**
 *
 * @type {Handler}
 */
exports.addMany = async (req, res) => {
  try {
    let data = await AddMany(req, populate);
    return res.status(201).send(data);
  } catch (err) {
    return res.status(400).send(err);
  }
};

/**
 *
 * @type {Handler}
 */
exports.getAll = async (req, res) => {
  try {
    let params = JSON.parse(req.query.params || "{}");
    let data = await FindAll(req, populate, params.condition, params.options);
    return res.status(200).send(data);
  } catch (err) {
    return res.status(400).send(err);
  }
};

/**
 *
 * @type {Handler}
 */
exports.getById = async (req, res) => {
  try {
    let params = JSON.parse(req.query.params || "{}");
    let data = await FindById(req, populate, params.options);
    if (!data) {
      return res.status(404).send({ message: "Data not found" });
    }
    return res.status(200).send(data);
  } catch (err) {
    return res.status(400).send(err);
  }
};

/**
 *
 * @type {Handler}
 */
exports.getOne = async (req, res) => {
  try {
    let params = JSON.parse(req.query.params || "{}");
    let data = await FindOne(req, populate, params.condition, params.options);
    if (!data) {
      return res.status(404).send({ message: "Data not found" });
    }
    return res.status(200).send(data);
  } catch (err) {
    return res.status(400).send(err);
  }
};

/**
 *
 * @type {Handler}
 */
exports.update = async (req, res) => {
  try {
    let data = await UpdateData(req, populate);
    if (!data) {
      return res.status(404).send({ message: "Data not found" });
    }
    return res.status(200).send(data);
  } catch (err) {
    return res.status(400).send(err);
  }
};

/**
 *
 * @type {Handler}
 */
exports.updateMany = async (req, res) => {
  try {
    let data = await UpdateMany(req, populate);
    return res.status(200).send(data);
  } catch (err) {
    return res.status(400).send(err);
  }
};

/**
 *
 * @type {Handler}
 */
exports.getTranslations = async (req, res) => {
  try {
    let data = await GetTranslation(req);
    if (!data) {
      return res.status(404).send({ message: "Data not found" });
    }
    return res.status(200).send(data);
  } catch (err) {
    return res.status(400).send(err);
  }
};

/**
 *
 * @type {Handler}
 */
exports.translateData = async (req, res) => {
  try {
    let data = await TranslateData(req);
    return res.status(200).send(data);
  } catch (err) {
    return res.status(400).send(err);
  }
};

/**
 *
 * @type {Handler}
 */
exports.updateOrdre = async (req, res) => {
  try {
    let data = await UpdateOrdre(req, populate);
    return res.status(200).send(data);
  } catch (err) {
    return res.status(400).send(err);
  }
};

/**
 *
 * @type {Handler}
 */
exports.updateState = async (req, res) => {
  try {
    let data = await ChangeState(req);
    return res.status(200).send(data);
  } catch (err) {
    return res.status(400).send(err);
  }
};

/**
 *
 * @type {Handler}
 */
exports.delete = async (req, res) => {
  try {
    let data = await DeleteData({ _id: { $in: [req.params.id] } });
    return res.status(204).send(data);
  } catch (err) {
    return res.status(400).send(err);
  }
};

/**
 *
 * @type {Handler}
 */
exports.getStatistique = async (req, res) => {
  try {
    let data = await GetStatistiques(req.body);
    return res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
};
