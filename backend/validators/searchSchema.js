const Joi = require('joi');

const searchSchema = Joi.object({
  query: Joi.string().min(2).required(),
  sort: Joi.string().valid('featured', 'price-low', 'price-high', 'newest').default('featured'),
  page: Joi.number().integer().min(0).default(1),
  limit: Joi.number().integer().min(1).max(50).default(6),
  filter: Joi.string().valid('all', 'rent', 'sale').default('all'),
  priceRange: Joi.array()
  .items(Joi.number().min(0).max(Number.MAX_SAFE_INTEGER))
  .length(2)
  .optional()
});

module.exports = searchSchema;
