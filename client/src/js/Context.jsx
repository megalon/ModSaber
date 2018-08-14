import React, { Component } from 'react'
import PropTypes from 'prop-types'
import nothis from 'nothis/nothisAll'

import { BASE_URL } from './constants.js'
const { Provider, Consumer } = React.createContext()

export class UserProvider extends Component {
  constructor (props) {
    super(props)
    nothis(this)
  }

  state = {
    loggedIn: false,
    user: {},
    alert: null,
  }

  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  componentDidMount ({ refresh }) {
    refresh()
  }

  refresh ({ loadUserState, loadAlerts }) {
    loadUserState()
    loadAlerts()
  }

  async loadUserState ({ setState }) {
    try {
      let user = await (await fetch(`${BASE_URL}/api/secure/self`, { credentials: 'include' })).json()
      setState({ loggedIn: true, user })
    } catch (err) {
      setState({ loggedIn: false, user: {} })
    }
  }

  async loadAlerts ({ setState }) {
    try {
      let { alert } = await (await fetch(`${BASE_URL}/api/public/alert`, { credentials: 'include' })).json()
      setState({ alert })
    } catch (err) {
      // Silently Fail
    }
  }

  render ({ refresh, state, props: { children } }) {
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
