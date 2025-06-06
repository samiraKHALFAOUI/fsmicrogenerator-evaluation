const Joi = require("joi");

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
    const result = schema.validate(req.body);
    if (result.error) {
      const errors = [];
      result.error.details.forEach((element) => {
        const error = { path: element.path[0], message: element.message };
        errors.push(error);
      });
      return res
        .status(400)
        .json({ message: "Invalide data was provided", errors: errors });
    } else {
      next();
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


