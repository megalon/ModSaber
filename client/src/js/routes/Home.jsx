import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Layout from '../components/Layout.jsx'

class Home extends Component {
  static propTypes = { history: PropTypes.any }

  render () {
    return (
      <Layout history={ this.props.history } >
        <h1 className='is-size-1 has-text-weight-semibold'>ModSaber</h1>
      </Layout>
    )
  }
}

export default Home
