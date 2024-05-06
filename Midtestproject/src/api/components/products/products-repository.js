const { Product } = require('../../../models');

/**
 * Get a list of products
 * @returns {Promise}
 */
async function getProducts(pageNumber, pageSize, sort, search) {
  let query = {};

  // Implement search functionality
  if (search) {
    const [field, key] = search.split(':');
    if (field && key) {
      query[field] = { $regex: key, $options: 'i' }; // Case insensitive search
    }
  }

  // Parse sort parameter
  let sortQuery = {};
  if (sort) {
    const [field, order] = sort.split(':');
    sortQuery[field] = order === 'desc' ? -1 : 1;
  } else {
    sortQuery['name'] = 1; // Default sorting by name ascending
  }

  // Calculate skip based on the page number and size
  const skip = (pageNumber - 1) * pageSize;

  // Query database with filtering, sorting, and pagination
  const products = await Product.find(query)
    .sort(sortQuery)
    .skip(skip)
    .limit(pageSize);

  // Fetch the total number of products that match the query for pagination data
  const totalProducts = await Product.countDocuments(query);

  return {
    page_number: pageNumber,
    page_size: pageSize,
    count: totalProducts,
    total_pages: Math.ceil(totalProducts / pageSize),
    has_previous_page: pageNumber > 1,
    has_next_page: pageNumber < Math.ceil(totalProducts / pageSize),
    data: products,
  };
}

/**
 * Get product detail
 * @param {string} id - Product ID
 * @returns {Promise}
 */
async function getProduct(id) {
  return Product.findById(id);
}

/**
 * Create a new product
 * @param {object} productData - Product data to create a new product
 * @returns {Promise}
 */
async function createProduct(productData) {
  return Product.create({
    ...productData,
    price: parseFloat(productData.price),
    stock: parseInt(productData.stock),
  });
}

/**
 * Update an existing product
 * @param {string} id - Product ID
 * @param {object} productData - Product data to update
 * @returns {Promise}
 */
async function updateProduct(id, productData) {
  return Product.updateOne({ _id: id }, { $set: productData });
}

/**
 * Delete a product
 * @param {string} id - Product ID
 * @returns {Promise}
 */
async function deleteProduct(id) {
  return Product.deleteOne({ _id: id });
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
