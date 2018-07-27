import React, { Component } from 'react'
import { HashRouter, Switch, Route } from 'react-router-dom'

import Layout from './components/Layout.jsx'

class Router extends Component {
  render () {
    return (
      <HashRouter>
        <Switch>
          <Route exact path='/' component={Layout} />
        </Switch>
      </HashRouter>
    )
  }
}

export default Router
