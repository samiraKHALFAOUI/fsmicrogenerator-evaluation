const Joi = require("joi");

/**
 * @param {object} object
 * @param {string} fieldName
 */
const joiObject = (object = Joi.any(), fieldName) =>
  Joi.object(object)
    .messages({
      "object.base": `${fieldName} must be an object`
    })
    .options({ abortEarly: false });
/**
 * @param {object} object
 * @param {string} fieldName
 */
const joiObjectRequired = (object = Joi.any(), fieldName) =>
  Joi.object(object)
    .required()
    .messages({
      "object.base": `${fieldName} must be an object`
    })
    .options({ abortEarly: false });

/**
 * @param {string} fieldName
 * @param {object} [messages={}]
 */
const stringRequired = (fieldName, messages = {}) =>
  Joi.string().trim().required().messages(
    fieldName
      ? {
        "string.base": `${fieldName} should be a type of string.`,
        "string.empty": `${fieldName} cannot be empty.`,
        "any.required": `${fieldName} is required.`,
        ...messages
      }
      : {}
  );
/**
 * @param {string} fieldName
 * @param {object} [messages={}]
 */
const string = (fieldName, messages = {}) =>
  Joi.string().trim().allow("").messages(
    fieldName
      ? {
        "string.base": `${fieldName} should be a type of string.`,
        "string.empty": `${fieldName} cannot be empty.`,
        ...messages
      }
      : {}
  );

/**
 * @param {string} fieldName
 * @param {object} [messages={}]
 */
const booleanRequired = (fieldName, messages = {}) =>
  Joi.boolean().required().messages(
    fieldName
      ? {
        "boolean.base": `${fieldName} must be a boolean.`,
        "any.required": `${fieldName} is required.`,
        ...messages
      }
      : {}
  );
/**
 * @param {string} fieldName
 * @param {object} [messages={}]
 */
const boolean = (fieldName, messages = {}) =>
  Joi.boolean().messages(
    fieldName
      ? {
        "boolean.base": `${fieldName} must be a boolean.`,
        ...messages
      }
      : {}
  );

/**
 * @param {string} fieldName
 * @param {import(Joi).SchemaLikeWithoutArray} items
 * @param {object} [messages={}]
 */
const arrayRequired = (fieldName, items = Joi.any(), messages = {}) =>
  Joi.array().items(items).required().messages(
    fieldName
      ? {
        "array.base": `${fieldName} should be an array.`,
        "any.required": `${fieldName} is required.`,
        ...messages
      }
      : {}
  );
/**
 * @param {string} fieldName
 * @param {import(Joi).SchemaLikeWithoutArray} items
 * @param {object} [messages={}]
 */
const array = (fieldName, items = Joi.any(), messages = {}) =>
  Joi.array().items(items).messages(
    fieldName
      ? {
        "array.base": `${fieldName} should be an array.`,
        ...messages
      }
      : {}
  );

/**
 * @param {string} fieldName
 * @param {object} [messages={}]
 */
const numberRequired = (fieldName, messages = {}) =>
  Joi.number().messages(
    fieldName
      ? {
        "number.base": `${fieldName} should be a number.`,
        "number.empty": `${fieldName} cannot be empty.`,
        "any.required": `${fieldName} is required.`,
        ...messages
      }
      : {}
  );

/**
 * @param {string} fieldName
 * @param {object} [messages={}]
 */
const number = (fieldName, messages = {}) =>
  Joi.number().messages(
    fieldName
      ? {
        "number.base": `${fieldName} should be a number.`,
        "number.empty": `${fieldName} cannot be empty.`,
        ...messages
      }
      : {}
  );

/**
 * @param {string} fieldName
 * @param {object} [messages={}]
 */
const objectIdRequired = (fieldName, messages = {}) =>
  Joi.string().trim().required().pattern(/^[0-9A-Fa-f]{24}$/).messages(
    fieldName
      ? {
        "string.base": `${fieldName} should be a type of string.`,
        "string.empty": `${fieldName} cannot be empty.`,
        "string.pattern.base": `${fieldName} must be a single String of 24 hex characters`,
        "any.required": `${fieldName} is required.`,
        ...messages
      }
      : {}
  );

/**
 * @param {string} fieldName
 * @param {object} [messages={}]
 */
const objectId = (fieldName, messages = {}) =>
  Joi.string().trim().pattern(/^[0-9A-Fa-f]{24}$/).messages(
    fieldName
      ? {
        "string.base": `${fieldName} should be a type of string.`,
        "string.empty": `${fieldName} cannot be empty.`,
        "string.pattern.base": `${fieldName} must be a single String of 24 hex characters`,
        ...messages
      }
      : {}
  );

/**
 * @param {string} [fieldName="email"]
 * @param {object} [messages={}]
 */
const emailRequired = (fieldName = "email", messages = {}) =>
  Joi.string().trim().required().email().messages(
    fieldName
      ? {
        "string.base": `${fieldName} should be a type of string.`,
        "string.empty": `${fieldName} cannot be empty.`,
        "string.email": `${fieldName} should be in a valid format`,
        "any.required": `${fieldName} is required.`,
        ...messages
      }
      : {}
  );
/**
 * @param {string} [fieldName="email"]
 * @param {object} [messages={}]
 */
const email = (fieldName = "email", messages = {}) =>
  Joi.string().trim().email().messages(
    fieldName
      ? {
        "string.base": `${fieldName} should be a type of string.`,
        "string.empty": `${fieldName} cannot be empty.`,
        "string.email": `${fieldName} should be in a valid format`,
        ...messages
      }
      : {}
  );

/**
 * @param {string} [fieldName="password"]
 * @param {object} [messages={}]
 */
const passwordRequired = (fieldName = "password", messages = {}) =>
  Joi.string()
    .required()
    .trim()
    .pattern(
      /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/
    )
    .messages(
      fieldName
        ? {
          "string.base": `${fieldName} should be a type of string`,
          "string.min": `${fieldName} should have a minimum length of {#limit}`,
          "string.max": `${fieldName} should have a maximum length of {#limit}`,
          "string.pattern.base": `${fieldName} should contain at least one uppercase character and one lowercase character and one number and one special character [!@#$%^&*]`,
          "any.required": `${fieldName} is required.`,
          ...messages
        }
        : {}
    );
/**
 * @param {string} [fieldName="password"]
 * @param {object} [messages={}]
 */
const password = (fieldName = "password", messages = {}) =>
  Joi.string()
    .trim()
    .min(8)
    .max(20)
    .pattern(
      /(?=^.{8,20}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/
    )
    .messages(
      fieldName
        ? {
          "string.base": `${fieldName} should be a type of string`,
          "string.min": `${fieldName} should have a minimum length of {#limit}`,
          "string.max": `${fieldName} should have a maximum length of {#limit}`,
          "string.pattern.base": `${fieldName} should contain at least one uppercase character and one lowercase character and one number and one special character [!@#$%^&*]`,
          ...messages
        }
        : {}
    );
/**
 *
 * @param {string} fieldName
 * @param {object} [messages = {}]
 */
const dateRequired = (fieldName, messages = {}) =>
  Joi.date().required().messages(
    fieldName
      ? {
        "date.base": `${fieldName} must be a valid date`,
        ...messages
      }
      : {}
  );
/**
 *
 * @param {string} fieldName
 * @param {object} [messages = {}]
 */
const date = (fieldName, messages = {}) =>
  Joi.date().messages(
    fieldName
      ? {
        "date.base": `${fieldName} must be a valid date`,
        ...messages
      }
      : {}
  );

const any = () => Joi.any();

/**
 * @module commonTypesValidation
 * @property {function} joiObjectRequired
 * @property {function} joiObject
 * @property {function} stringRequired
 * @property {function} string
 * @property {function} arrayRequired
 * @property {function} array
 * @property {function} numberRequired
 * @property {function} number
 * @property {function} objectIdRequired
 * @property {function} objectId
 * @property {function} booleanRequired
 * @property {function} boolean
 * @property {function} dateRequired
 * @property {function} date
 * @property {function} any
 */
module.exports = {
  joiObjectRequired,
  joiObject,
  stringRequired,
  string,
  arrayRequired,
  array,
  numberRequired,
  number,
  objectIdRequired,
  objectId,
  emailRequired,
  email,
  passwordRequired,
  password,
  booleanRequired,
  boolean,
  dateRequired,
  date,
  any
};
