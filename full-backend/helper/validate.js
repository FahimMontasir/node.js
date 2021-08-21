const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const validateCourse = (course) => {
  const schema = Joi.object({
    name: Joi.objectId().min(5).max(50).required(),
  });

  return schema.validate(course);
};

const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(15).required(),
    isGold: Joi.boolean(),
  });
  return schema.validate(user);
};
const validateCategory = (name) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
  });
  return schema.validate(name);
};
const validatePurchase = (purchase) => {
  const schema = Joi.object({
    userId: Joi.objectId().required(),
    courseId: Joi.objectId().required(),
  });
  return schema.validate(purchase);
};

module.exports.validateCourse = validateCourse;
module.exports.validateUser = validateUser;
module.exports.validateCategory = validateCategory;
module.exports.validatePurchase = validatePurchase;
