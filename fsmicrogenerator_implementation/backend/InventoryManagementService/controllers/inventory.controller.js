const { Handler } = require("../helpers/helpers");

const logger = require("../middlewares/winston.middleware");
const {
  AddData,
  AddOrUpdateMany,
  AddMany,
  FindAll,
  FindById,
  FindOne,
  UpdateData,
  UpdateMany,
  DeleteData,
  ChangeState,
  GetStatistiques,
} = require("../models/repositories/inventory.repositorie");
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

exports.subscribeEvents = async (payload) => {
  const { operation, data } = payload;
  try {
    switch (operation) {
      case "ADD_ITEM":
        await AddData(data.req, populate);
        break;
      case "ADD_ITEMS":
        await AddOrUpdateMany(data.req, populate);
        break;
      case "UPDATE_ITEM":
        await UpdateData(data.req, populate);
        break;
      case "UPDATE_ITEMS":
        await UpdateMany(data.req, populate);
        break;
      case "REMOVE_ITEMS":
        await DeleteData(data.condition);
        break;
      default:
        logger.warn("no matching case for inventory subscribeEvents");
        break;
    }
  } catch (error) {
    logger.error(`inventory subscribeEvents error: ${error}`);
  }
};

exports.serveRPCRequest = async (payload) => {
  const { operation, data } = payload;
  switch (operation) {
    case "VIEW_ITEM":
      return await FindOne(data.req, populate, data.condition, data.options);
    case "VIEW_ITEMS":
      return await FindAll(data.req, populate, data.condition, data.options);
    case "ADD_ITEM":
      return await AddData(data.req, populate);
    case "ADD_ITEMS":
      return await AddOrUpdateMany(data.req, populate);
    default:
      logger.warn("no matching case for inventory serveRPCRequest");
      break;
  }
};
