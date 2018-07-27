import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'

import Layout from '../components/Layout.jsx'

class Publish extends Component {
  static propTypes = { history: PropTypes.any }

  render () {
    return (
      <Layout history={ this.props.history } >
        <Helmet>
          <title>ModSaber | Publish</title>
        </Helmet>

        <h1 className='is-size-1 has-text-weight-semibold'>Publish a Mod</h1>
      </Layout>
    )
  }
}

export default Publish
