import React, { Component } from 'react'

import Layout from './components/Layout.jsx'
import constants from './constants.js'

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loggedIn: false,
      user: {},
    }

    this.loadUserState()
  }

  async loadUserState () {
    try {
      let user = await (await fetch(`${constants.BASE_URL}/api/self`, { credentials: 'include' })).json()
      this.setState({ loggedIn: true, user })
    } catch (err) {
      // Silently Fail
    }
  }

  render () {
    return (
      <Layout />
    )
  }
}

export default App
