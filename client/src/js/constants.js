const constants = {
  BASE_URL: process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : '/',
  MESSAGE_UNVERIFIED: `Your account is unverified. You cannot upload mods without first verifying your account.
Check the email address you used to sign up for an account. (Look in spam too)`,
}

/**
 * @param {string} username Username String
 * @returns {string}
 */
export const sanitiseUsername = username => username
  .toLowerCase()
  .replace(/ /g, '-')
  .replace(/[^a-z0-9\-_]/g, '')
  .substring(0, 20)

export default constants
