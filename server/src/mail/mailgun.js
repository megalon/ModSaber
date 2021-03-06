const mailgunJS = require('mailgun-js')

// Environment Variables
const { MAILGUN_KEY, MAILGUN_DOMAIN } = process.env

// Mailgun Setup
const mailgun = mailgunJS({ apiKey: MAILGUN_KEY, domain: MAILGUN_DOMAIN })

/**
 * @param {string} to Recipient's Email Address
 * @param {string} subject Subject Line
 * @param {string} text Email Body
 */
const sendMail = (to, subject, text) => {
  let data = {
    from: `ModSaber Admin <noreply@${MAILGUN_DOMAIN.replace(/^[^.]+\./g, '')}>`,
    to, subject, html: text,
  }

  mailgun.messages().send(data)
}

/**
 * @param {string} username Username
 * @param {string} email User's Email Address
 * @param {string} url Verification Token URL
 */
const sendVerification = (username, email, url) => {
  sendMail(
    email, 'Account Verification',
    `<b>Hello ${username}.</b><br /><br />Please verify your account on ModSaber by clicking the link below.<br /><a href='${url}'>${url}</a>`
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
    `<b>Hello ${username}.</b><br /><br />To reset your password please click the link below.` +
    `<br /><a href='${url}'>${url}</a><br /><br />If you did not request this, please ignore this email.`
  )
}

module.exports = { sendMail, sendVerification, sendReset }
