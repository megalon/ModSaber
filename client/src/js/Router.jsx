import React, { Component } from 'react'
import { HashRouter, Switch, Route } from 'react-router-dom'

import asyncComponent from './components/AsyncComponent.jsx'

import Home from './routes/Home.jsx'
const AsyncLogin = asyncComponent(() => import('./routes/Login.jsx'))

class Router extends Component {
  render () {
    return (
      <HashRouter>
        <Switch>
          <Route exact path='/' component={ Home } />
          <Route path='/login' component={ AsyncLogin } />
        </Switch>
      </HashRouter>
    )
  }
}

export default Router
