import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'

import Layout from '../components/Layout.jsx'

class NotFound extends Component {
  static propTypes = { history: PropTypes.any }

  render () {
    return (
      <Layout history={ this.props.history } >
        <Helmet>
          <title>ModSaber | 404</title>
        </Helmet>

        <h1 className='is-size-1 has-text-weight-semibold'>ModSaber</h1>
        <p>
          You appear to have taken a wrong turn. This page doesn&#39;t exist. <br />
          Use the navbar above to get back on track.
        </p>
      </Layout>
    )
  }
}

export default NotFound
