import React, { Component } from 'react'

import { UserProvider } from './Context.jsx'
import Router from './Router.jsx'

class App extends Component {
  render () {
    return (
      <UserProvider>
        <Router />
      </UserProvider>
    )
  }
}

export default App
