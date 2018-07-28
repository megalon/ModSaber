import React, { Component } from 'react'
import { HashRouter, Switch, Route } from 'react-router-dom'

import asyncComponent from './components/AsyncComponent.jsx'
import withContext from './components/WithContext.jsx'

import Home from './routes/Home.jsx'
import NotFound from './routes/NotFound.jsx'
const AsyncPrivacyPolicy = asyncComponent(() => import('./routes/PrivacyPolicy.jsx'))
const AsyncLogin = asyncComponent(() => import('./routes/Login.jsx'))
const AsyncForgot = asyncComponent(() => import('./routes/Forgot.jsx'))
const AsyncReset = asyncComponent(() => import('./routes/Reset.jsx'))
const AsyncRegister = asyncComponent(() => import('./routes/Register.jsx'))
const AsyncSettings = asyncComponent(() => import('./routes/Settings.jsx'))
const AsyncPublish = asyncComponent(() => import('./routes/Publish.jsx'))
const AsyncTransfer = asyncComponent(() => import('./routes/Transfer.jsx'))
const AsyncMod = asyncComponent(() => import('./routes/Mod.jsx'))

class Router extends Component {
  render () {
    return (
      <HashRouter>
        <Switch>
          <Route exact path='/' component={ Home } />
          <Route path='/privacy' component={ withContext(AsyncPrivacyPolicy) } />
          <Route path='/login' component={ withContext(AsyncLogin) } />
          <Route path='/forgot' component={ withContext(AsyncForgot) } />
          <Route path='/reset/:username/:resetToken' component={ withContext(AsyncReset) } />
          <Route path='/register' component={ withContext(AsyncRegister) } />
          <Route path='/settings' component={ withContext(AsyncSettings) } />
          <Route path='/publish/:name?' component={ withContext(AsyncPublish) } />
          <Route path='/transfer/:name' component={ withContext(AsyncTransfer) } />
          <Route path='/mod/:name/:version?' component={ withContext(AsyncMod) } />
          <Route path='/' component={ NotFound } />
        </Switch>
      </HashRouter>
    )
  }
}

export default Router
