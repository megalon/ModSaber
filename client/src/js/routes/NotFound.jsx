import React from 'react'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'

import Layout from '../components/Layout.jsx'

const NotFound = props =>
  <Layout history={ props.history } >
    <Helmet>
      <title>ModSaber | 404</title>
    </Helmet>

    <h1 className='is-size-1 has-text-weight-semibold'>ModSaber</h1>
    <p>
      You appear to have taken a wrong turn. This page doesn&#39;t exist. <br />
      Use the navbar above to get back on track.
    </p>
  </Layout>

NotFound.propTypes = { history: PropTypes.any }

export default NotFound
