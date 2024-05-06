const joi = require('joi');

module.exports = {
  createProduct: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      price: joi.number().positive().required().label('Price'),
      description: joi.string().min(1).max(500).required().label('Description'),
      stock: joi.number().integer().min(0).required().label('Stock'),
    },
  },

  updateProduct: {
    body: {
      name: joi.string().min(1).max(100).optional().label('Name'),
      price: joi.number().positive().optional().label('Price'),
      description: joi.string().min(1).max(500).optional().label('Description'),
      stock: joi.number().integer().min(0).optional().label('Stock'),
    },
  },
};
