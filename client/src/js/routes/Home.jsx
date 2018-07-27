import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'

import Layout from '../components/Layout.jsx'

class Home extends Component {
  static propTypes = { history: PropTypes.any }

  render () {
    return (
      <Layout history={ this.props.history } >
        <Helmet>
          <title>ModSaber</title>
        </Helmet>

        <h1 className='is-size-1 has-text-weight-semibold'>ModSaber</h1>
      </Layout>
    )
  }
}

export default Home
