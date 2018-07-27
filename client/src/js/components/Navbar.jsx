import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import { UserConsumer } from '../Context.jsx'

class Navbar extends Component {
  constructor (props) {
    super(props)

    this.state = {
      active: false,
    }
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
              <UserConsumer>
                { ({ loggedIn, user }) => <NavbarEnd loggedIn={ loggedIn } user={ user } /> }
              </UserConsumer>
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
      </Fragment>
    )
  } else {
    return (
      <Fragment>
        <Link className='navbar-item' to='/login'><b>Log In</b></Link>
      </Fragment>
    )
  }
}

NavbarEnd.propTypes = {
  loggedIn: PropTypes.bool,
  user: PropTypes.object,
}

export default Navbar
