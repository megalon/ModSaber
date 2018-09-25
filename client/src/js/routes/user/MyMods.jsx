import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'

import Layout from '../../components/layout/Layout.jsx'
import { BASE_URL } from '../../constants.js'

class MyMods extends Component {
  constructor (props) {
    super(props)

    this.state = {
      mods: [],
    }
  }

  static propTypes = {
    context: PropTypes.any,
    history: PropTypes.any,
    match: PropTypes.any,
  }

  componentDidUpdate () {
    this.checkPermissions()
  }

  checkPermissions () {
    // Check for logged in state
    if (this.props.context.loggedIn === false) this.props.history.replace('')
  }

  render () {
    return (
      <Layout history={ this.props.history }>
        <Helmet>
          <title>ModSaber | My Mods</title>
        </Helmet>

        <h1 className='is-size-1 has-text-weight-semibold'>My Mods</h1>
        <p><i>View your uploaded mods here</i></p>
        <hr />
      </Layout>
    )
  }
}

export default MyMods
