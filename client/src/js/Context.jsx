import React, { Component } from 'react'
import PropTypes from 'prop-types'

import constants from './constants.js'

const { Provider, Consumer } = React.createContext()

export class UserProvider extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loggedIn: false,
      user: {},
      alert: null,
    }

    this.loadUserState()
    this.loadAlerts()
  }

  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  async loadUserState () {
    try {
      let user = await (await fetch(`${constants.BASE_URL}/api/state`, { credentials: 'include' })).json()
      this.setState({ loggedIn: true, user })
    } catch (err) {
      // Silently Fail
    }
  }

  async loadAlerts () {
    try {
      let { alert } = await (await fetch(`${constants.BASE_URL}/alert`, { credentials: 'include' })).json()
      this.setState({ alert })
    } catch (err) {
      // Silently Fail
    }
  }

  render () {
    const { children } = this.props

    return (
      <Provider
        value={{
          loggedIn: this.state.loggedIn,
          user: this.state.user,
          alert: this.state.alert,
        }}
      >
        {children}
      </Provider>
    )
  }
}

export const UserConsumer = Consumer
