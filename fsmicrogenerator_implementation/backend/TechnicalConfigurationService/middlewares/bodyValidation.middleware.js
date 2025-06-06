const Joi = require("joi");
const logger = require('./winston.middleware')

module.exports.validateParam = (schema, name) => {
  return (req, res, next) => {
    const result = schema.validate({ param: req["params"][name] });
    if (result.error) {
      return res.status(400).json({
        message: "invalide parameter was provided",
        error: result.error,
      });
    } else {
      next();
    }
  };
};

module.exports.validateBody = (schema) => {
  return async (req, res, next) => {
    try {
      const result = schema.validate(req.body, {
        abortEarly: false,
        allowUnknown: false,
        errors: {
          label: "key",
          wrap: { label: "" },
        },
      });

      if (result.error) {
        const errors = result.error.details.map((err) => ({
          path: err.path.join("."),
          message: err.message
        }));

        return res.status(400).json({
          message: "Invalid data was provided",
          errors,
        });
      }

      next();
    } catch (err) {
      logger.error(`Joi validation error: ${err}`);
      return res.status(500).json({
        message: "Server validation error",
        error: err.message,
      });
    }
  };
};

module.exports.schemas = {
  idSchema: Joi.object().keys({
    param: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        "string.base": `"the classe id" of author  should be a type of 'string'.`,
        "string.regex": `"the classe id" of author  doesn't mutch the patern.`,
        "string.empty": `"the classe id" of author  cannot be an empty field.`,
        "any.required": `"the classe id" of author  is required.`,
      }),
  }),
};


