const authenticationRepository = require('./authentication-repository');
const { generateToken } = require('../../../utils/session-token');
const { passwordMatched } = require('../../../utils/password');

/**
 * Check username and password for login.
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {object} An object containing, among others, the JWT token if the email and password are matched. Otherwise returns null.
 */
async function checkLoginCredentials(email, password) {
  const user = await authenticationRepository.getUserByEmail(email);

  // We define default user password here as '<RANDOM_PASSWORD_FILTER>'
  // to handle the case when the user login is invalid. We still want to
  // check the password anyway, so that it prevents the attacker in
  // guessing login credentials by looking at the processing time.
  const userPassword = user ? user.password : '<RANDOM_PASSWORD_FILLER>';
  const passwordChecked = await passwordMatched(password, userPassword);

  // Because we always check the password (see above comment), we define the
  // login attempt as successful when the `user` is found (by email) and
  // the password matches.

  if (user && passwordChecked) {
    return {
      email: user.email,
      name: user.name,
      user_id: user.id,
      token: generateToken(user.email, user.id),
    };
  }

  return null;
}

const { UserAccess } = require('../../../models');
const ATTEMPT_LIMIT = 5; // Limit of failed login attempts
const TIME_WINDOW = 30 * 60 * 1000; // 30 minutes in milliseconds

// Function to handle a failed login attempt
async function handleFailedLogin(email) {
  const now = Date.now();
  let attempt = await UserAccess.findOne({ email });

  if (!attempt) {
    // Create a new record for this email if it doesn't exist
    attempt = new UserAccess({ email });
  } else {
    // Calculate the time elapsed since the first attempt
    const timeElapsed = now - attempt.firstAttempt;

    // If the time window has passed, reset the count and timestamp
    if (timeElapsed > TIME_WINDOW) {
      attempt.count = 0;
      attempt.firstAttempt = now;
    }
  }

  // Increment the attempt count
  attempt.count += 1;

  // Save the updated attempt record
  await UserAccess.findOneAndUpdate(
    { email },
    { $set: { count: attempt.count, firstAttempt: attempt.firstAttempt } },
    { upsert: true }
  );

  // Check if the attempt limit has been reached
  if (
    attempt.count >= ATTEMPT_LIMIT &&
    now - attempt.firstAttempt <= TIME_WINDOW
  ) {
    return { status: 403, message: 'Too many failed login attempts' };
  }

  return true;
}

// Function to handle a successful login
async function handleSuccessfulLogin(email) {
  // Reset the login attempt record for the email
  await UserAccess.deleteOne({ email });
}

module.exports = {
  checkLoginCredentials,
  handleFailedLogin,
  handleSuccessfulLogin,
};
