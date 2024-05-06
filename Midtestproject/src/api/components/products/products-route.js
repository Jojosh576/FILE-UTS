const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const productsControllers = require('./products-controller');
const productsValidator = require('./products-validator');

const route = express.Router();

module.exports = (app) => {
  // Use the '/products' route prefix for all product-related routes
  app.use('/products', route);

  // Get a list of products
  route.get('/', authenticationMiddleware, productsControllers.getProducts);

  // Create a new product
  route.post(
    '/',
    authenticationMiddleware,
    celebrate(productsValidator.createProduct),
    productsControllers.createProduct
  );

  // Get product details
  route.get('/:id', authenticationMiddleware, productsControllers.getProduct);

  // Update an existing product
  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate(productsValidator.updateProduct),
    productsControllers.updateProduct
  );

  // Delete a product
  route.delete(
    '/:id',
    authenticationMiddleware,
    productsControllers.deleteProduct
  );
};
