const Joi = require("joi");

const schema = Joi.object({
  message: Joi.string().min(5).required(),
  author: Joi.string()
    .required()
    .pattern(new RegExp("^[a-zA-Z]+([ ]+[a-zA-Z]+)+$")),
  ts: Joi.number().integer().required(),
});

module.exports = schema;
