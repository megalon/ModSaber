/**
 * @param {string} username Username String
 * @param {number} [length] Maximum Length
 * @returns {string}
 */
export const sanitise = (username, length = 20) => username
  .toLowerCase()
  .replace(/ /g, '-')
  .replace(/[^a-z0-9\-_]/g, '')
  .substring(0, length)

export const BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : ''
export const MESSAGE_UNVERIFIED = `Your account is unverified. You cannot upload mods without first verifying your account.
Check the email address you used to sign up for an account. (Look in spam too)`
export const AUTH = {
  ERROR_UNKNOWN: 'Something went wrong...',
  PASSWORD_MISMATCH: 'Passwords do not match',
  INVALID_EITHER: 'Invalid Username or Password',
  INCORRECT_PASSWORD: 'Incorrect Password',
  INVALID_USERNAME: 'Invalid Username',
  INVALID_EMAIL: 'Invalid Email',
  INVALID_PASSWORD: 'Invalid Password',
  INVALID_RESET_TOKEN: 'Invalid reset token',
  UNKNOWN_EMAIL: 'An account with that email was not found',
}
