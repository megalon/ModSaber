const constants = {
  BASE_URL: process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : '/',
  MESSAGE_UNVERIFIED: `Your account is unverified. You cannot upload mods without first verifying your account.
Check the email address you used to sign up for an account. (Look in spam too)`,
}

export default constants
