import React from 'react'
import { HashRouter, Switch, Route } from 'react-router-dom'

import asyncComponent from './components/hoc/AsyncComponent.jsx'
import withContext from './components/hoc/WithContext.jsx'

import Home from './routes/main/Home.jsx'
const NotFound = asyncComponent(() => import('./routes/NotFound.jsx'))
const FAQ = asyncComponent(() => import('./routes/main/FAQ.jsx'))
const PrivacyPolicy = asyncComponent(() => import('./routes/main/PrivacyPolicy.jsx'))

const Login = asyncComponent(() => import('./routes/login/Login.jsx'))
const Forgot = asyncComponent(() => import('./routes/login/Forgot.jsx'))
const Reset = asyncComponent(() => import('./routes/login/Reset.jsx'))
const Register = asyncComponent(() => import('./routes/login/Register.jsx'))

const Mod = asyncComponent(() => import('./routes/mod/Mod.jsx'))
const Publish = asyncComponent(() => import('./routes/mod/Publish.jsx'))
const Preview = asyncComponent(() => import('./routes/mod/Preview.jsx'))
const Edit = asyncComponent(() => import('./routes/mod/Edit.jsx'))
const Transfer = asyncComponent(() => import('./routes/mod/Transfer.jsx'))

const Settings = asyncComponent(() => import('./routes/user/Settings.jsx'))
const Admin = asyncComponent(() => import('./routes/user/Admin.jsx'))

const Router = () =>
  <HashRouter>
    <Switch>
      <Route exact path='/' component={ Home } />
      <Route path='/faq' component={ withContext(FAQ) } />
      <Route path='/privacy' component={ withContext(PrivacyPolicy) } />

      <Route path='/login' component={ withContext(Login) } />
      <Route path='/forgot' component={ withContext(Forgot) } />
      <Route path='/reset/:username/:resetToken' component={ withContext(Reset) } />
      <Route path='/register' component={ withContext(Register) } />

      <Route path='/mod/:name/:version?' component={ withContext(Mod) } />
      <Route path='/publish/:name?' component={ withContext(Publish) } />
      <Route path='/preview' component={ withContext(Preview) } />
      <Route path='/edit/:name/:version' component={ withContext(Edit) } />
      <Route path='/transfer/:name' component={ withContext(Transfer) } />

      <Route path='/settings' component={ withContext(Settings) } />
      <Route path='/admin' component={ withContext(Admin) } />

      <Route path='/' component={ NotFound } />
    </Switch>
  </HashRouter>

export default Router
