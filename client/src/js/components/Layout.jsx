import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Navbar from './Navbar.jsx'
import Alert from './Alert.jsx'

class Layout extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  render () {
    return (
      <div>
        <Navbar />

        <div className='container'>
          <div className='is-main'>
            <Alert />

            { this.props.children }
          </div>
        </div>
      </div>
    )
  }
}

export default Layout
