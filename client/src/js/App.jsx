import React, { Component } from 'react'

import { UserProvider } from './Context.jsx'
import Router from './Router.jsx'

class App extends Component {
  render () {
    return (
      <div className='has-text-white'>
        <UserProvider>
          <Router />
        </UserProvider>
      </div>
    )
  }
}

export default App
