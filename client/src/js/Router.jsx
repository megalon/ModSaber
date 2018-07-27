import React, { Component } from 'react'
import { HashRouter, Switch, Route } from 'react-router-dom'

import asyncComponent from './components/AsyncComponent.jsx'
import withContext from './components/WithContext.jsx'

import Home from './routes/Home.jsx'
const AsyncLogin = asyncComponent(() => import('./routes/Login.jsx'))
const AsyncRegister = asyncComponent(() => import('./routes/Register.jsx'))
const AsyncPublish = asyncComponent(() => import('./routes/Publish.jsx'))

class Router extends Component {
  render () {
    return (
      <HashRouter>
        <Switch>
          <Route exact path='/' component={ Home } />
          <Route path='/login' component={ withContext(AsyncLogin) } />
          <Route path='/register' component={ withContext(AsyncRegister) } />
          <Route path='/publish' component={ withContext(AsyncPublish) } />
        </Switch>
      </HashRouter>
    )
  }
}

export default Router
