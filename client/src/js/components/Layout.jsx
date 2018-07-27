import React, { Component } from 'react'
import PropTypes from 'prop-types'

import withContext from './WithContext.jsx'

import navbar from './Navbar.jsx'
import Alert from './Alert.jsx'

const Navbar = withContext(navbar)

class Layout extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    history: PropTypes.any.isRequired,
  }

  render () {
    return (
      <div>
        <Navbar history={ this.props.history } />

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
