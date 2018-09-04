import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import { BASE_URL } from '../../constants.js'

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
    await fetch(`${BASE_URL}/auth/logout`, { credentials: 'include' })
    this.props.context.refresh()
    this.props.history.push('')
  }

  render () {
    return (
      <nav className='navbar has-shadow is-light is-fixed-top'>
        <div className='container'>
          <div className='navbar-brand'>
            <Link className='navbar-item' to='/'><b>ModSaber <sup style={{ fontWeight: 'initial', fontStyle: 'italic' }}>BETA</sup></b></Link>

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
              <a className='navbar-item' target='_blank' rel='noopener noreferrer'
                href='https://github.com/Umbranoxio/BeatSaberModInstaller/releases'>Mod Installer</a>
              <a className='navbar-item' target='_blank' rel='noopener noreferrer' href='https://discord.gg/beatsabermods'>Modding Discord</a>
              {
                !this.props.context.loggedIn ?
                  null :
                  this.props.context.user.verified ?
                    <Link className='navbar-item' to='/publish'>Publish a Mod</Link> :
                    null
              }
            </div>

            <div className='navbar-end'>
              {
                !this.props.context.loggedIn ?
                  <Link className='navbar-item' to='/login'><b>Login</b></Link> :
                  <Fragment>
                    {
                      !this.props.context.user.admin ? null :
                        <Link className='navbar-item' to='/admin'>Admin</Link>
                    }
                    <Link className='navbar-item' to='/settings'>{ this.props.context.user.username }</Link>
                    <a className='navbar-item' onClick={ () => this.logout() }><b>Logout</b></a>
                  </Fragment>
              }
            </div>
          </div>
        </div>
      </nav>
    )
  }
}

export default Navbar
