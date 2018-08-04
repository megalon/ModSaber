import React, { Component } from 'react'
import { HashRouter, Switch, Route } from 'react-router-dom'

import asyncComponent from './components/AsyncComponent.jsx'
import withContext from './components/WithContext.jsx'

import Home from './routes/Home.jsx'
const NotFound = asyncComponent(() => import('./routes/NotFound.jsx'))
const FAQ = asyncComponent(() => import('./routes/FAQ.jsx'))
const PrivacyPolicy = asyncComponent(() => import('./routes/PrivacyPolicy.jsx'))
const Login = asyncComponent(() => import('./routes/Login.jsx'))
const Forgot = asyncComponent(() => import('./routes/Forgot.jsx'))
const Reset = asyncComponent(() => import('./routes/Reset.jsx'))
const Register = asyncComponent(() => import('./routes/Register.jsx'))
const Settings = asyncComponent(() => import('./routes/Settings.jsx'))
const Admin = asyncComponent(() => import('./routes/Admin.jsx'))
const Publish = asyncComponent(() => import('./routes/Publish.jsx'))
const Preview = asyncComponent(() => import('./routes/Preview.jsx'))
const Transfer = asyncComponent(() => import('./routes/Transfer.jsx'))
const Mod = asyncComponent(() => import('./routes/Mod.jsx'))

class Router extends Component {
  render () {
    return (
      <HashRouter>
        <Switch>
          <Route exact path='/' component={ Home } />
          <Route path='/faq' component={ withContext(FAQ) } />
          <Route path='/privacy' component={ withContext(PrivacyPolicy) } />
          <Route path='/login' component={ withContext(Login) } />
          <Route path='/forgot' component={ withContext(Forgot) } />
          <Route path='/reset/:username/:resetToken' component={ withContext(Reset) } />
          <Route path='/register' component={ withContext(Register) } />
          <Route path='/settings' component={ withContext(Settings) } />
          <Route path='/admin' component={ withContext(Admin) } />
          <Route path='/publish/:name?' component={ withContext(Publish) } />
          <Route path='/preview' component={ withContext(Preview) } />
          <Route path='/transfer/:name' component={ withContext(Transfer) } />
          <Route path='/mod/:name/:version?' component={ withContext(Mod) } />
          <Route path='/' component={ NotFound } />
        </Switch>
      </HashRouter>
    )
  }
}

export default Router
