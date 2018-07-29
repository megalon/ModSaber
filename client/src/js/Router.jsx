import React, { Component } from 'react'
import { HashRouter, Switch, Route } from 'react-router-dom'

import withContext from './components/WithContext.jsx'

import Home from './routes/Home.jsx'
import NotFound from './routes/NotFound.jsx'
import FAQ from './routes/FAQ.jsx'
import PrivacyPolicy from './routes/PrivacyPolicy.jsx'
import Login from './routes/Login.jsx'
import Forgot from './routes/Forgot.jsx'
import Reset from './routes/Reset.jsx'
import Register from './routes/Register.jsx'
import Settings from './routes/Settings.jsx'
import Admin from './routes/Admin.jsx'
import Publish from './routes/Publish.jsx'
import Transfer from './routes/Transfer.jsx'
import Mod from './routes/Mod.jsx'

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
          <Route path='/transfer/:name' component={ withContext(Transfer) } />
          <Route path='/mod/:name/:version?' component={ withContext(Mod) } />
          <Route path='/' component={ NotFound } />
        </Switch>
      </HashRouter>
    )
  }
}

export default Router
