import React from 'react'
import Helmet from 'react-helmet'

/**
 * @param {string} name Mod Name
 * @param {string} version Mod Version
 * @param {string} author Mod Author
 * @param {string} title Mod Title
 * @returns {JSX.Element}
 */
const modMetaTags = (name, version, author, title) =>
  <Helmet>
    <title>{ `ModSaber | ${name}@${version}` }</title>
    <meta content={ `${name}@${version} // ${author}` } property='og:site_name' />
    <meta content={ title } property='og:title' />
    <meta content='View this mod on ModSaber for more info!' property='og:description' />
    <meta content='/favicon.png' property='og:image' />
  </Helmet>

export default modMetaTags
