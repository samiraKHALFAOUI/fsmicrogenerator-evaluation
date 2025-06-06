const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { PublishMessage, RPCRequest } = require("./communications");
const logger = require("../middlewares/winston.middleware");

//#region interService communication
module.exports.publishUpdate = (typeOperation, data, key, query) => {
  try {
    if (process.env.NODE_ENV != "test") {
      // Normalize data format
      if (["update_items", "publish_data"].includes(typeOperation)) {
        if (data?.$each) data = data.$each;
        if (!Array.isArray(data)) data = data ? [data] : [];
        data = data
          .filter(Boolean)
          .map((d) => d._id || d)
          .filter(Boolean);
      } else if (typeOperation === "update_item" && data.data && data.message) {
        data = data.data;
      }

      // Handle operations
      const operations = {
        add_item: () =>
          PublishMessage(key, {
            operation: "ADD_ITEM",
            data: { req: { body: data } }
          }),
        add_items: () => {
          if (data.length)
            PublishMessage(key, {
              operation: "ADD_ITEMS",
              data: { req: { body: data } }
            });
        },
        update_item: () => {
          if (data && data._id)
            PublishMessage(key, {
              operation: "UPDATE_ITEM",
              data: {
                req: {
                  params: { id: data._id.toString() },
                  body: data
                }
              }
            });
        },
        update_items: () => {
          if (data.length)
            PublishMessage(key, {
              operation: "UPDATE_ITEMS",
              data: {
                req: {
                  body: { ids: data, data: { [query.operation]: query.body } }
                }
              }
            });
        },
        publish_data: () => {
          if (Array.isArray(data) ? data.length : Object.keys(data).length)
            PublishMessage(key, {
              operation: "PUBLISH_DATA",
              data: { docs: data }
            });
        },
        pullAndPush: () => {
          const itemToPull = module.exports.getDiffArray(
            data.oldData,
            data.newData,
            query.path
          );
          const itemToPush = module.exports.getDiffArray(
            data.newData,
            data.oldData,
            query.path
          );

          if (itemToPull.length) {
            PublishMessage(key, {
              operation: "UPDATE_ITEMS",
              data: {
                req: {
                  body: {
                    ids: itemToPull.map((i) => i._id || i).filter(Boolean),
                    data: { [query.operation]: query.bodyPull }
                  }
                }
              }
            });
          }

          if (itemToPush.length) {
            const pushOp =
              query.operation === "$pull" ? "$addToSet" : query.operationPush;
            PublishMessage(key, {
              operation: "UPDATE_ITEMS",
              data: {
                req: {
                  body: {
                    ids: itemToPush.map((i) => i._id || i).filter(Boolean),
                    data: { [pushOp]: query.bodyPush }
                  }
                }
              }
            });
          }
        }
      };

      if (!operations[typeOperation]) {
        throw new Error(`No matching case for operation ${typeOperation}`);
      }

      operations[typeOperation]();
    } else {
      logger.info(`publish update : rabbitmq is disabled on test mode`);
    }
  } catch (error) {
    logger.error(
      `publishUpdate failed for ${key} - ${typeOperation}: ${error.message}`
    );
    throw {
      error: true,
      message: `An error occurred while publishUpdate to ${key}`,
      detail: error.message || error
    };
  }
};

module.exports.sendRPCRequest = async (
  doc,
  key,
  attributes,
  operation = "VIEW_ITEMS",
  options = {}
) => {
  try {
    if (process.env.NODE_ENV != "test") {
      if (Array.isArray(attributes)) attributes = attributes.filter(Boolean);

      let result;

      if (operation === "VIEW_BY_CONDITION") {
        if (doc && Object.keys(doc).length) {
          result = await RPCRequest(key, {
            operation: "VIEW_ITEMS",
            data: { condition: doc, options }
          });
        }
        return Array.isArray(result) ? result : [];
      }

      if (operation === "VIEW_ITEM") {
        if (Array.isArray(attributes)) {
          if (attributes.length !== 1) {
            throw {
              error: true,
              message: `VIEW_ITEM requires a single attribute. Got: ${attributes}`
            };
          }
          attributes = attributes[0];
        }
        if (doc && attributes) {
          const data = this.getDataByPath(doc, attributes);
          if (data && key) {
            result = await RPCRequest(key, {
              operation: "VIEW_ITEM",
              data: {
                condition: { _id: data._id || data },
                options
              }
            });
          }
        }
      }

      if (operation === "VIEW_ITEMS") {
        const dataSet = new Set();
        const docs = Array.isArray(doc) ? doc : [doc];
        const attrs = Array.isArray(attributes) ? attributes : [attributes];

        for (const d of docs) {
          for (const attr of attrs) {
            const items = this.getDataByPath(d, attr);
            if (items) dataSet.add(items);
          }
        }

        const data = [...this.flattenArray([...dataSet])]
          .map((item) => item?._id || item)
          .filter(Boolean);

        if (data.length && key) {
          result = await RPCRequest(key, {
            operation: "VIEW_ITEMS",
            data: { condition: { _id: { $in: data } }, options }
          });
        }
      }

      if (operation.startsWith("ADD_ITEM") && doc) {
        const valid = Array.isArray(doc)
          ? doc.length > 0
          : Object.keys(doc).length > 0;
        if (valid) {
          result = await RPCRequest(key, {
            operation,
            data: { req: { body: doc } }
          });
        }
      }

      if (typeof result === "string") {
        return operation.endsWith("_ITEMS") ? [] : null;
      }

      return Array.isArray(result) ? result.filter(Boolean) : result;
    } else {
      logger.info(`send rpc request : rabbitmq is disabled on test mode`);
      return operation.endsWith("_ITEMS") ? [] : null;
    }
  } catch (error) {
    logger.error(
      `sendRPCRequest failed for ${key} - ${operation}: ${error.message}`
    );
    throw {
      error: true,
      message: `An error occurred while sendRPCRequest to ${key}`,
      detail: error.message || error
    };
  }
};

//#endregion

// #region Business Functions Helpers

/**
 * @template T
 * @template U
 * @typedef {T extends Record<U,any> ? true : false} HasAttribute<T,U>
 */
/**
 * @template T
 * @typedef {{[P in keyof T]:T[P]}} GetObjectType<T>
 */
/**
 * @template T
 * @template U
 * @typedef {T[U]} PropType<T,U>
 */
/**
 * @template A
 * @typedef {A extends (infer B)[] ? B : A} GetArrayType<A>
 */
/**
 * @template A
 * @typedef {A extends (infer B)[] ? ( HasAttribute<B, 'translations'> extends true ? ( PropType<B, 'translations'> extends (infer U)[] ? Omit<B, 'translations'> & { translations: U } : B )[] : A ) : ( HasAttribute<A, 'translations'> extends true ? PropType<A, 'translations'> extends (infer B)[] ? Omit<A, 'translations'> & { translations: B } : A : A ) } GetTranslations<A>
 */
/**
 * @template A
 * @param {A} data
 * @param {Request} req
 * @returns {GetTranslations<A>}
 */
module.exports.getTranslation = (data, req) => {
  function simplifyTranslations(obj, lang, defLang) {
    if (obj instanceof mongoose.Document) obj = obj.toObject();
    if (Array.isArray(obj?.translations)) {
      obj.translations =
        obj.translations.find((t) => t.language === lang) ||
        obj.translations.find((t) => t.language === defLang) ||
        obj.translations.find((t) => t.language);
    }

    for (const key in obj) {
      if (
        typeof obj[key] === "object" &&
        obj[key] &&
        Object.keys(obj[key]).length
      ) {
        obj[key] = simplifyTranslations(obj[key], lang, defLang);
      }
    }

    return obj;
  }

  if (!req?.headers) return data;

  const lang = req.headers[process.env.LANGUAGE_FIELD_NAME];
  const defLang = req.headers[process.env.DEFAULT_LANGUAGE_FIELD_NAME];

  if (!lang && !defLang) return data;

  if (Array.isArray(data)) {
    return data.map((item) => simplifyTranslations(item, lang, defLang));
  }

  return simplifyTranslations(data, lang, defLang);
};

/**
 * @typedef { {path: string, match:string, populate:Populate[]}[]}Populate
 * @param {string} populateFieldsPaths
 * @returns {Populate[]}
 */
function generatePopulateArray(populateFieldsPaths) {
  let populateFields = new Map();
  if (populateFieldsPaths) {
    for (let path of populateFieldsPaths.split(/\s+/)) {
      let findPath = (path, parent) => {
        if (
          parent &&
          !path.includes(".") &&
          (path.includes("-") || path.includes("$"))
        ) {
          if (!parent.select) {
            parent.select = `${path.replace("$", "")}`;
          } else {
            parent.select = `${parent.select} ${path.replace("$", "")}`;
          }
        } else {
          let [first, ...rest] = path.split(".");
          let obj = populateFields.get(first) ||
            parent?.populate?.find((item) => item.path === first) || {
            path: first,
            match: { etatObjet: "code-1" },
            populate: []
          };
          if (!parent) {
            populateFields.set(first, obj);
          } else if (!parent.populate.find((item) => item.path === first)) {
            parent.populate.push(obj);
          }
          if (rest.length) findPath(rest.join("."), obj);
        }
      };
      findPath(path);
    }
  }

  return Array.from(populateFields.values());
}
/**
 * @param {Request} req
 * @template T
 * @param {import('mongoose').Model<T>} Model
 * @param {string} populatedFields
 */
module.exports.addData = async (req, Model, populatedFields = "") => {
  try {
    // Add language if missing
    if (
      req &&
      req.headers &&
      req.body.translations &&
      !req.body.translations.language &&
      !Array.isArray(req.body.translations)
    ) {
      req.body.translations.language =
        req.headers[process.env.LANGUAGE_FIELD_NAME];
    }

    // Create new document
    const model = new Model(req.body);
    if (!model._id) model._id = new mongoose.Types.ObjectId();

    const savedDoc = await model.save();
    const populateField = generatePopulateArray(populatedFields);

    let newDoc = await Model.populate(savedDoc, populateField);
    newDoc = this.getTranslation(newDoc, req);
    return newDoc;
  } catch (error) {
    logger.error(`addData error (${Model.modelName}): ${error.message}`);
    throw {
      error: true,
      message: "An error occurred while adding data",
      detail: error.message || error
    };
  }
};

/**
 * @param {Request} req
 * @template T
 * @param {import('mongoose').Model<T>} Model
 * @param {string} populatedFields
 */

module.exports.insertOrUpdateMany = async (
  req,
  Model,
  populatedFields = ""
) => {
  try {
    const documents = req.body;

    const ids = documents
      .map((doc) => doc._id)
      .filter(Boolean)
      .map((id) => id.toString());

    const existingDocs = await Model.find({ _id: { $in: ids } }).select("_id");

    const toUpdate = [];
    const toInsert = [];

    for (const doc of documents) {
      const exists = existingDocs.find(
        (item) => doc._id?.toString() === item._id.toString()
      );
      exists ? toUpdate.push(doc) : toInsert.push(doc);
    }

    const updatePromises = toUpdate.map((doc) =>
      this.updateData(
        { body: doc, params: { id: doc._id } },
        Model,
        populatedFields
      )
    );

    const insertPromise = this.addMany(
      { body: toInsert },
      Model,
      populatedFields
    );

    const results = await Promise.all([...updatePromises, insertPromise]);

    return results.flatMap((r) =>
      Array.isArray(r) ? r : r?.data && r?.message ? [r.data] : [r]
    );
  } catch (error) {
    logger.error(
      `insertOrUpdateMany error (${Model.modelName}): ${error.message}`
    );
    throw {
      error: true,
      message: "An error occurred while inserting or updating documents",
      detail: error.message || error
    };
  }
};

/**
 * @param {Request} req
 * @template T
 * @param {import('mongoose').Model<T>} Model
 * @param {string} populatedFields
 */
module.exports.addMany = async (req, Model, populatedFields = "") => {
  try {
    // Preprocess input data and assign _id
    req.body = req.body.map((item) => {
      if (
        req &&
        req.headers &&
        item.translations &&
        !item.translations.language &&
        !Array.isArray(item.translations)
      ) {
        item.translations.language =
          req.headers[process.env.LANGUAGE_FIELD_NAME];
      }
      const model = new Model(item);
      if (!model._id) model._id = new mongoose.Types.ObjectId();
      return model;
    });

    const savedDocs = await Model.insertMany(req.body);
    const populateField = generatePopulateArray(populatedFields);

    let newDocs = await Model.populate(savedDocs, populateField);
    newDocs = this.getTranslation(newDocs, req);
    return newDocs;
  } catch (error) {
    logger.error(`addMany error (${Model.modelName}): ${error.message}`);
    throw {
      error: true,
      message: "An error occurred while adding multiple documents",
      detail: error.message || error
    };
  }
};

/**
 * @param {Request} req
 * @template T
 * @param {import('mongoose').Model<T>} Model
 * @param {string} populatedFields
 * @param {{ projection: import('mongoose').ProjectionType<T> ,queryOptions: import('mongoose').QueryOptions<T> }} options
 */
module.exports.getData = async (
  req,
  Model,
  populatedFields = "",
  condition = {},
  options = null
) => {
  try {
    const finalCondition = { etatObjet: "code-1", ...condition };
    const populateField = generatePopulateArray(populatedFields);

    const docs = await Model.find(
      finalCondition,
      options?.projection,
      options?.queryOptions
    )
      .sort({ createdAt: -1 })
      .populate(populateField)
      .lean()
      .exec();

    return this.getTranslation(docs, req);
  } catch (error) {
    logger.error(`getData error (${Model.modelName}): ${error.message}`);
    throw {
      error: true,
      message: "An error occurred while retrieving data",
      detail: error.message || error
    };
  }
};

/**
 *
 * @param {Request} req
 * @template T
 * @param {import('mongoose').Model<T>} Model
 * @param {string} populatedFields
 * @param {{ projection: import('mongoose').ProjectionType<T> ,queryOptions: import('mongoose').QueryOptions<T> }} options
 */
module.exports.getDataById = async (
  req,
  Model,
  populatedFields = "",
  options = null
) => {
  try {
    const populateField = generatePopulateArray(populatedFields);

    let doc = await Model.findById(
      req.params.id,
      options?.projection,
      options?.queryOptions
    )
      .populate(populateField)
      .lean()
      .exec();

    return this.getTranslation(doc, req);
  } catch (error) {
    logger.error(`getDataById error (${Model.modelName}): ${error.message}`);
    throw {
      error: true,
      message: "An error occurred while retrieving document by ID",
      detail: error.message || error
    };
  }
};

/**
 *
 * @param {Request} req
 * @template T
 * @param {import('mongoose').Model<T>} Model
 * @param {string} populatedFields
 * @param {{ projection: import('mongoose').ProjectionType<T> ,queryOptions: import('mongoose').QueryOptions<T> }} options
 */
module.exports.getOne = async (
  req,
  Model,
  populatedFields = "",
  condition = {},
  options = null
) => {
  try {
    const populateField = generatePopulateArray(populatedFields);

    const doc = await Model.findOne(
      condition,
      options?.projection,
      options?.queryOptions
    )
      .populate(populateField)
      .lean()
      .exec();

    return this.getTranslation(doc, req);
  } catch (error) {
    logger.error(
      `getOne error (${Model.modelName}) - condition: ${JSON.stringify(
        condition
      )} - ${error.message}`
    );
    throw {
      error: true,
      message: "An error occurred while retrieving a single document",
      detail: error.message || error
    };
  }
};

/**
 *
 * @param {Request} req
 * @template T
 * @param {import('mongoose').Model<T>} Model
 * @param {string} populatedFields
 * @param {{ projection: import('mongoose').ProjectionType<T> ,queryOptions: import('mongoose').QueryOptions<T> }} options
 */
module.exports.getDataTranslations = async (req, Model) => {
  try {
    const doc = await Model.findById(req.params.id).lean().exec();
    return doc;
  } catch (error) {
    logger.error(
      `getDataTranslations error (${Model.modelName}) - id: ${req.params.id} - ${error.message}`
    );
    throw {
      error: true,
      message: "An error occurred while retrieving document translations",
      detail: error.message || error
    };
  }
};

/**
 *
 * @param {Request} req
 * @template T
 * @param {import('mongoose').Model<T>} Model
 * @param {string} [populatedFields]
 */
module.exports.updateData = async (req, Model, populatedFields = "") => {
  try {
    const populateField = generatePopulateArray(populatedFields);
    const id = req.params.id || req.params._id;

    // No translation or no headers → normal update
    if (
      !req.headers ||
      (req.body.translations && Array.isArray(req.body.translations))
    ) {
      const result = await Model.findOneAndUpdate(
        { _id: id },
        { $set: req.body },
        { new: true, upsert: true, useFindAndModify: false }
      )
        .populate(populateField)
        .lean()
        .exec();

      return {
        message: "Data updated successfully",
        data: this.getTranslation(result, req)
      };
    }

    // Translation update with specific language
    const lang =
      req.body.translations?.language ||
      req.headers[process.env.LANGUAGE_FIELD_NAME];
    if (req.body.translations) req.body.translations.language = lang;

    const _translations = { ...req.body.translations, language: lang };
    delete req.body.translations;
    delete req.body._id;

    const body = {
      ...Object.fromEntries(
        Object.entries({ "translations.$": _translations })
      ),
      ...req.body
    };

    const doc = await Model.findOne({
      $and: [{ _id: id }, { "translations.language": lang }]
    })
      .lean()
      .exec();

    let result;

    if (doc) {
      result = await Model.findOneAndUpdate(
        { _id: id, "translations.language": lang },
        { $set: body },
        { new: true }
      )
        .populate(populateField)
        .lean()
        .exec();

      return {
        message: "Object updated successfully",
        data: this.getTranslation(result, req)
      };
    } else if (lang) {
      result = await Model.findOneAndUpdate(
        { _id: id },
        { $push: { translations: _translations }, $set: req.body },
        { new: true, useFindAndModify: false }
      )
        .populate(populateField)
        .lean()
        .exec();

      return {
        message: "Translation added successfully",
        data: this.getTranslation(result, req)
      };
    }

    result = await Model.findOneAndUpdate(
      { _id: id },
      { $set: req.body },
      { new: true, useFindAndModify: false }
    )
      .populate(populateField)
      .lean()
      .exec();

    return {
      message: "Data updated successfully",
      data: this.getTranslation(result, req)
    };
  } catch (error) {
    logger.error(
      `updateData error (${Model.modelName}) - id: ${req.params.id || req.params._id
      } - ${error.message}`
    );
    throw {
      error: true,
      message: "An error occurred while updating data",
      detail: error.message || error
    };
  }
};

/**
 *
 * @param {Request} req
 * @template T
 * @param {import('mongoose').Model<T>} Model
 */
module.exports.updateMany = async (req, Model) => {
  try {
    let options = {};

    if (Object.keys(req.body.data).length === 1 && req.body.data["$addToSet"]) {
      options = { timestamps: false };
    }

    if (req.body.ids?.["$in"]) {
      req.body.ids = req.body.ids["$in"];
      options = { timestamps: false };
    }

    const result = await Model.updateMany(
      { _id: { $in: req.body.ids } },
      req.body.data,
      options
    ).exec();

    return result;
  } catch (error) {
    logger.error(`updateMany error (${Model.modelName}) - ${error.message}`);
    throw {
      error: true,
      message: "An error occurred while updating multiple documents",
      detail: error.message || error
    };
  }
};

/**
 *
 * @param {Request} req
 * @template T
 * @param {import('mongoose').Model<T>} Model
 */
module.exports.updateOrdre = async (req, Model) => {
  try {
    const updateData = (id, index) =>
      Model.updateOne(
        { _id: id.toString() },
        { $set: { [req.body.attributName]: index } }
      );

    const promises = req.body.ids.map((id, index) => updateData(id, index + 1));
    const result = await Promise.all(promises);

    return result;
  } catch (error) {
    logger.error(`updateOrdre error (${Model.modelName}) - ${error.message}`);
    throw {
      error: true,
      message: "An error occurred while updating order",
      detail: error.message || error
    };
  }
};

/**
 *
 * @param {Request} req
 * @template T
 * @param {import('mongoose').Model<T>} Model
 */
module.exports.changeState = async (req, Model) => {
  try {
    let options = {};
    if (req.body.id && req.body.id["$in"]) {
      req.body.id = req.body.id["$in"];
      options = { timestamps: false };
    }

    const result = await Model.updateMany(
      { _id: { $in: req.body.id } },
      { $set: { etatObjet: req.body.etat } },
      options
    ).exec();

    return result;
  } catch (error) {
    logger.error(`changeState error (${Model.modelName}) - ${error.message}`);
    throw {
      error: true,
      message: "An error occurred while changing state",
      detail: error.message || error
    };
  }
};

/**
 *
 * @param {Request} req
 * @template T
 * @param {import('mongoose').Model<T>} Model
 */
module.exports.deleteData = async (condition, Model) => {
  try {
    const result = await Model.deleteMany(condition).exec();
    return result;
  } catch (error) {
    logger.error(`deleteData error (${Model.modelName}) - ${error.message}`);
    throw {
      error: true,
      message: "An error occurred while deleting data",
      detail: error.message || error
    };
  }
};

/**
 *
 * @template T
 * @param {import('mongoose').Model<T>} Model
 */
module.exports.getStatistiques = async (condition, Model) => {
  try {
    const processMatch = (item) => {
      for (let key of Object.keys(item)) {
        if (typeof item[key] === "string") {
          if (item[key].includes("mongoose.Types.ObjectId")) {
            item[key] = mongoose.Types.ObjectId(
              item[key].match(/([0-9a-fA-F]{24})/)[1]
            );
          } else if (
            !item[key].includes("code-") &&
            !isNaN(Date.parse(item[key]))
          ) {
            item[key] = new Date(item[key]);
          }
        } else if (Array.isArray(item[key])) {
          item[key] = item[key].map((subItem) =>
            typeof subItem === "object" && subItem !== null
              ? processMatch(subItem)
              : subItem
          );
        } else if (typeof item[key] === "object" && item[key] !== null) {
          processMatch(item[key]);
        }
      }
      return item;
    };

    let pipeline = [];

    if (Array.isArray(condition)) {
      for (let item of condition) {
        processMatch(item);
      }
      pipeline = condition;
    } else if (typeof condition === "object" && Object.keys(condition).length) {
      if (condition.match) {
        pipeline.push({ $match: processMatch(condition.match) });
      }
      if (condition.configuration) {
        pipeline.push(
          Object.keys(condition.configuration).length > 1
            ? { $facet: { ...condition.configuration } }
            : condition.configuration
        );
      }
      if (condition.options) {
        Array.isArray(condition.options)
          ? pipeline.push(...condition.options)
          : pipeline.push(condition.options);
      }
    }

    if (pipeline.length) {
      const result = await Model.aggregate(pipeline);
      return result;
    }

    throw {
      error: true,
      message: `Expected aggregation pipeline, got: ${JSON.stringify(
        condition
      )}`
    };
  } catch (error) {
    logger.error(
      `getStatistiques error (${Model.modelName}) - ${error.message}`
    );
    throw {
      error: true,
      message: `An error occurred while getting statistics from ${Model.modelName}`,
      detail: error.message || error
    };
  }
};

// #endregion

// #region File Upload Helpers
/**
 *
 * @param {string} destinationFolder
 * @param {'single'|'array'|'fields'} uploadType
 * @param {({fileName:string,count?:number}|{name:string,maxCount:number}[])} [options]
 */
module.exports.uploadFile = (destinationFolder, uploadType, options) => {
  return (req, res, next) => {
    try {
      const dest = process.env.UPLOAD_DESTINATION + destinationFolder;

      // ✅ Secure: upload limits are enforced below (fileSize, fieldSize, fields)
      const storage = multer.diskStorage({
        destination: (req, file, cb) => {
          if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
          cb(null, dest);
        },
        filename: (req, file, cb) => {
          const name =
            uploadType !== "any"
              ? "1_" +
              file.originalname.replace(/\d+_/g, "").replace(/-\d+/g, "") +
              "-" +
              Date.now() +
              path.extname(file.originalname)
              : file.originalname;
          cb(null, name);
        }
      });

      const destination = process.env.UPLOAD_DESTINATION.includes("frontend/")
        ? `assets${destinationFolder}`
        : destinationFolder;

      const setValueToField = (obj, field, value) => {
        const [first, ...rest] = field.split(".");
        if (rest.length) {
          setValueToField(obj[first], rest.join("."), value);
        } else {
          obj[first] = value;
        }
      };

      const limits = {
        fileSize: 5 * 1024 * 1024,
        fieldSize: 5 * 1024 * 1024,
        fields: 5 * 1024 * 1024
      };

      let upload;
      switch (uploadType) {
        case "single":
          upload = multer({ limits, storage }).single(options.fileName);
          break;
        case "array":
          upload = multer({ limits, storage }).array(
            options.fileName,
            options.count || 1
          );
          break;
        case "fields":
          upload = multer({ limits, storage }).fields(options);
          break;
        default:
          upload = multer({ limits, storage }).any();
          break;
      }

      upload(req, res, (error) => {
        if (error) {
          logger.error(`uploadFile error: ${error.message}`);
          res.status(400).send({
            message: "Something went wrong during file upload!",
            data: error,
            detail: error.message || error
          });
          return;
        }

        this.parseData(req.body);

        if (uploadType === "single" && req.file) {
          setValueToField(
            req.body,
            options.fileName,
            `${destination}/${req.file.filename}`
          );
        } else if (uploadType === "array" && req.files.length) {
          if (options.fileName.includes("$")) {
            req.files.forEach((file, index) => {
              setValueToField(
                req.body,
                options.fileName.replace("$", index),
                `${destination}/${file.filename}`
              );
            });
          } else {
            setValueToField(
              req.body,
              options.fileName,
              req.files.map((file) => `${destination}/${file.filename}`)
            );
          }
        } else if (
          uploadType === "fields" &&
          Object.keys(req.files || {}).length
        ) {
          options.forEach((option) => {
            if (option.maxCount === 1 && req.files[option.name]?.[0]) {
              req.body[option.name] = `${destination}/${req.files[option.name][0].filename
                }`;
            } else if (req.files[option.name]) {
              req.body[option.name] = req.files[option.name].map(
                (file) => `${destination}/${file.filename}`
              );
            }
          });
        }

        next();
      });
    } catch (error) {
      logger.error(`uploadFile fatal error: ${error.message}`);
      res.status(400).send({
        message: "An error occurred while uploading file",
        detail: error.message || error
      });
    }
  };
};

module.exports.parseData = (body) => {
  const keys = Object.keys(body);
  for (let key of keys) {
    if (body[key]) {
      try {
        body[key] = JSON.parse(body[key]);
      } catch (e) {
        logger.warn(`parseData warning: unable to parse value for key ${key}`);
      }
    }
  }
};

// #endregion

//#region jwt

module.exports.jwtSign = (
  data,
  expiresIn = process.env.TOKEN_EXPIRATION_DURATION_IN_MILLISECOND
) => jwt.sign(data, process.env.TOKEN_KEY, expiresIn ? { expiresIn } : {});

module.exports.jwtVerify = (token) => jwt.verify(token, process.env.TOKEN_KEY);

//#endregion jwt

// #region Functions Types
/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('mongoose').CallbackError} CallbackError
 * @typedef {(req:Request,res:Response)=>void} Handler
 */
// #endregion

// #region others

function getValueByPath(obj, path) {
  try {
    if (!obj || !path) return obj;
    const [first, ...rest] = path.split(".");
    return rest.length
      ? Array.isArray(obj[first]) && isNaN(+rest[0])
        ? obj[first].map((d) => getValueByPath(d, rest.join(".")))
        : getValueByPath(obj[first], rest.join("."))
      : obj[first];
  } catch (error) {
    logger.error(`getValueByPath error - path: ${path} - ${error.message}`);
    throw {
      error: true,
      message: "An error occurred while executing getValueByPath",
      detail: error.message || error
    };
  }
}

function parseObject(data) {
  if (data instanceof mongoose.Document) {
    data = data.toObject();
  }
  return data;
}

module.exports.GroupBy = (data, groupBy) => {
  try {
    let items = {};
    if (data && !Array.isArray(data)) data = [data];

    if (groupBy.includes(".")) {
      const [parent, ...children] = groupBy.split(".");
      const newData = [];

      for (let d of data) {
        d = parseObject(d);
        const item = getValueByPath(d, parent);
        if (Array.isArray(item)) {
          item.forEach((i) => newData.push({ ...d, ...i }));
        } else {
          newData.push({ ...d, ...item });
        }
      }

      items = this.GroupBy(newData, children.join("."));
    } else {
      for (let d of data) {
        d = parseObject(d);
        if (d[groupBy]) {
          if (!items[d[groupBy]]) items[d[groupBy]] = [];
          items[d[groupBy]].push(d);
        }
      }
    }

    return items;
  } catch (error) {
    logger.error(`GroupBy error - field: ${groupBy} - ${error.message}`);
    throw {
      error: true,
      message: "An error occurred while executing GroupBy",
      detail: error.message || error
    };
  }
};

module.exports.filter = (lang, doc) => {
  try {
    const apply = (obj) => {
      if (obj?.translations) {
        const t = obj.translations.find((x) => x.language === lang);
        obj.translations = t ? t : [];
      }
    };

    if (Array.isArray(doc)) {
      doc.forEach(apply);
    } else {
      apply(doc);
    }
  } catch (error) {
    logger.error(`filter error - lang: ${lang} - ${error.message}`);
    throw {
      error: true,
      message: "An error occurred while executing filter function",
      detail: error.message || error
    };
  }
};

function extratNumber(value) {
  try {
    const match = /^[\s\S]*?(\d+)$/.exec(value);
    return match ? parseInt(match[1], 10) : Infinity;
  } catch (error) {
    logger.error(`extratNumber error - value: ${value} - ${error.message}`);
    return value;
  }
}

module.exports.sortStringByNumericPart = (data, attribut) => {
  return data.sort(
    (a, b) => extratNumber(a[attribut] || a) - extratNumber(b[attribut] || b)
  );
};

module.exports.flatDeep = (arr, attribute = null) => {
  try {
    return arr.reduce(
      (acc, val) =>
        acc.concat(
          (attribute ? val[attribute] : val) &&
            (attribute ? val[attribute] : val).length
            ? [val].concat(
              this.flatDeep(attribute ? val[attribute] : val, attribute)
            )
            : val
        ),
      []
    );
  } catch (error) {
    logger.error(`flatDeep error - attr: ${attribute} - ${error.message}`);
    throw {
      error: true,
      message: "An error occurred while executing flatDeep",
      detail: error.message || error
    };
  }
};

module.exports.flattenArray = (arr) => {
  try {
    return arr.reduce((acc, item) => {
      if (Array.isArray(item)) return acc.concat(this.flattenArray(item));
      return acc.concat(item);
    }, []);
  } catch (error) {
    logger.error(`flattenArray error - ${error.message}`);
    throw {
      error: true,
      message: "An error occurred while executing flattenArray",
      detail: error.message || error
    };
  }
};

module.exports.getDataByPath = (data, path, visited = new Set()) => {
  try {
    if (!path || data === null) return undefined;
    if (visited.has(data)) return undefined;
    visited.add(data);

    if (Array.isArray(data)) {
      return data.map((item) => this.getDataByPath(item, path, visited));
    }

    const [currentKey, ...restPath] = path.split(".");
    const nextData = data[currentKey];

    return restPath.length === 0
      ? nextData
      : this.getDataByPath(nextData, restPath.join("."), visited);
  } catch (error) {
    logger.error(`getDataByPath error - path: ${path} - ${error.message}`);
    throw {
      error: true,
      message: "An error occurred while executing getDataByPath",
      detail: error.message || error
    };
  }
};

module.exports.getDiffArray = (array1, array2, path) => {
  try {
    const a1 = Array.isArray(array1)
      ? array1.filter(Boolean)
      : [array1].filter(Boolean);
    const a2 = Array.isArray(array2)
      ? array2.filter(Boolean)
      : [array2].filter(Boolean);

    const diff = a1.filter(
      (item1) =>
        !a2.some(
          (item2) =>
            this.getDataByPath(item2, path)?.toString() ===
            this.getDataByPath(item1, path)?.toString()
        )
    );

    return diff;
  } catch (error) {
    logger.error(`getDiffArray error - path: ${path} - ${error.message}`);
    throw {
      error: true,
      message: "An error occurred while executing getDiffArray",
      detail: error.message || error
    };
  }
};

// #endregion others
