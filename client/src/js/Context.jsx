import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { BASE_URL } from './constants.js'
const { Provider, Consumer } = React.createContext()

export class UserProvider extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loggedIn: false,
      user: {},
      alert: null,
    }
  }

  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  componentDidMount () { this.refresh() }

  refresh () {
    this.loadUserState()
    this.loadAlerts()
  }

  async loadUserState () {
    try {
      let user = await (await fetch(`${BASE_URL}/api/secure/self`, { credentials: 'include' })).json()
      this.setState({ loggedIn: true, user })
    } catch (err) {
      this.setState({ loggedIn: false, user: {} })
    }
  }

  async loadAlerts () {
    try {
      let { alert } = await (await fetch(`${BASE_URL}/api/public/alert`, { credentials: 'include' })).json()
      this.setState({ alert })
    } catch (err) {
      // Silently Fail
    }
  }

  render () {
    let { refresh, state, props: { children } } = this

    return (
      <Provider
        value={{
          loggedIn: state.loggedIn,
          user: state.user,
          alert: state.alert,
          refresh: () => { refresh() },
        }}
      >
        {children}
      </Provider>
    )
  }
}

export const UserConsumer = Consumer
