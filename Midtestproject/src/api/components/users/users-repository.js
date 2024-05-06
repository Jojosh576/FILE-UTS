const { User } = require('../../../models');

/**
 * Get a list of users
 * @returns {Promise}
 */
async function getUsers(pageNumber, pageSize, sort, search) {
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
    sortQuery['email'] = 1; // Default sorting by email ascending
  }

  // Calculate skip based on the page number and size
  const skip = (pageNumber - 1) * pageSize;

  // Query database with filtering, sorting, and pagination
  let users = await User.find(query).sort(sortQuery).skip(skip).limit(pageSize);

  // Iterate through the list of users and remove the password field
  users = users.map((user) => {
    const userObject = user.toObject(); // Convert user to object
    delete userObject.password; // Remove the password field from the object
    delete userObject.__v; // Remove the version field from the object
    return userObject; // Return object without the password field
  });

  // Fetch the total number of users that match the query for pagination data
  const totalUsers = await User.countDocuments(query);

  return {
    page_number: pageNumber,
    page_size: pageSize,
    count: totalUsers,
    total_pages: Math.ceil(totalUsers / pageSize),
    has_previous_page: pageNumber > 1,
    has_next_page: pageNumber < Math.ceil(totalUsers / pageSize),
    data: users,
  };
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getUser(id) {
  return User.findById(id);
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createUser(name, email, password) {
  return User.create({
    name,
    email,
    password,
  });
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateUser(id, name, email) {
  return User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
}

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

/**
 * Get user by email to prevent duplicate email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

/**
 * Update user password
 * @param {string} id - User ID
 * @param {string} password - New hashed password
 * @returns {Promise}
 */
async function changePassword(id, password) {
  return User.updateOne({ _id: id }, { $set: { password } });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  changePassword,
};
