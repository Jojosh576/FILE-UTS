const productsRepository = require('./products-repository');

/**
 * Get a list of products
 * @param {number} pageNumber - Page number
 * @param {number} pageSize - Page size
 * @param {string} sort - Sorting parameter
 * @param {string} search - Search parameter
 * @returns {Object} Pagination and data of products
 */
async function getProducts(pageNumber, pageSize, sort, search) {
  return await productsRepository.getProducts(
    pageNumber,
    pageSize,
    sort,
    search
  );
}

/**
 * Get product detail
 * @param {string} id - Product ID
 * @returns {Object|null} Product detail or null if not found
 */
async function getProduct(id) {
  const product = await productsRepository.getProduct(id);

  // Return null if product is not found
  if (!product) {
    return null;
  }

  return product;
}

/**
 * Create a new product
 * @param {Object} productData - Product data to create a new product
 * @returns {Object|null} Created product or null if creation failed
 */
async function createProduct(productData) {
  return await productsRepository.createProduct(productData);
}

/**
 * Update an existing product
 * @param {string} id - Product ID
 * @param {Object} productData - Product data to update
 * @returns {Object|null} Updated product or null if update failed
 */
async function updateProduct(id, productData) {
  // Check if the product exists
  const existingProduct = await productsRepository.getProduct(id);

  if (!existingProduct) {
    return null;
  }

  try {
    const updatedProduct = await productsRepository.updateProduct(
      id,
      productData
    );
    return updatedProduct;
  } catch (err) {
    return null;
  }
}

/**
 * Delete a product
 * @param {string} id - Product ID
 * @returns {boolean|null} True if deletion successful, null if deletion failed
 */
async function deleteProduct(id) {
  // Check if the product exists
  const existingProduct = await productsRepository.getProduct(id);

  if (!existingProduct) {
    return null;
  }

  try {
    const success = await productsRepository.deleteProduct(id);
    return success;
  } catch (err) {
    return null;
  }
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
