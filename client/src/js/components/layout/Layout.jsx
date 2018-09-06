import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import withContext from '../hoc/WithContext.jsx'

import navbar from './Navbar.jsx'
import Alert from './Alert.jsx'

const Navbar = withContext(navbar)

const Layout = props =>
  <Fragment>
    <Navbar history={ props.history } />

    <div className='container'>
      <div className='is-main'>
        <Alert />

        { props.children }
      </div>
    </div>
  </Fragment>

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  history: PropTypes.any.isRequired,
}

export default Layout
