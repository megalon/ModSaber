import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import constants from '../constants.js'

class Navbar extends Component {
  constructor (props) {
    super(props)

    this.state = {
      active: false,
    }
  }

  static propTypes = {
    context: PropTypes.any.isRequired,
    history: PropTypes.any.isRequired,
  }

  async logout () {
    await fetch(`${constants.BASE_URL}/auth/logout`, { credentials: 'include' })
    this.props.context.refresh()
    this.props.history.push('')
  }

  render () {
    return (
      <nav className='navbar has-shadow is-light is-fixed-top'>
        <div className='container'>
          <div className='navbar-brand'>
            <Link className='navbar-item' to='/'><b>ModSaber</b></Link>

            <a
              onClick={ () => this.setState({ active: !this.state.active }) }
              role='button'
              className={ `navbar-burger ${this.state.active ? 'is-active' : ''}` }
              aria-label='menu'
              aria-expanded='false'
            >
              <span aria-hidden='true'></span>
              <span aria-hidden='true'></span>
              <span aria-hidden='true'></span>
            </a>
          </div>

          <div className={ `navbar-menu ${this.state.active ? 'is-active' : ''}` }>
            <div className='navbar-start'>
              <a className='navbar-item'>Mod Installer</a>
              <a className='navbar-item' target='_blank' rel='noopener noreferrer' href='https://discord.gg/ZY8T8ky'>Modding Discord</a>
            </div>

            <div className='navbar-end'>
              <NavbarEnd
                loggedIn={ this.props.context.loggedIn }
                user={ this.props.context.user }
                logout={ () => this.logout() }
              />
            </div>
          </div>
        </div>
      </nav>
    )
  }
}

const NavbarEnd = props => {
  if (props.loggedIn) {
    return (
      <Fragment>
        <a className='navbar-item' onClick={ props.logout }><b>Logout</b></a>
      </Fragment>
    )
  } else {
    return (
      <Fragment>
        <Link className='navbar-item' to='/login'><b>Login</b></Link>
      </Fragment>
    )
  }
}

NavbarEnd.propTypes = {
  loggedIn: PropTypes.bool,
  user: PropTypes.object,
  logout: PropTypes.func,
}

export default Navbar
