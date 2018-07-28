/**
 * @param {string} to Recipient's Email Address
 * @param {string} subject Subject Line
 * @param {string} text Email Body
 */
const sendMail = (to, subject, text) => {
  console.log(`[MAIL] <${to}> -- ${subject}\n`) // eslint-disable-line
  console.log(`${text}\n`) // eslint-disable-line
}

/**
 * @param {string} username Username
 * @param {string} email User's Email Address
 * @param {string} url Verification Token URL
 */
const sendVerification = (username, email, url) => {
  sendMail(
    email, 'Account Verification',
    `Hello ${username}.\n\nPlease verify your account on ModSaber by clicking the link below.\n${url}`
  )
}

/**
 * @param {string} username Username
 * @param {string} email User's Email Address
 * @param {string} url Reset Token URL
 */
const sendReset = (username, email, url) => {
  sendMail(
    email, 'Password Reset',
    `Hello ${username}.\n\nTo reset your password please click the link below.\n${url}\n\nIf you did not request this, please ignore this email.`
  )
}

module.exports = { sendMail, sendVerification, sendReset }
