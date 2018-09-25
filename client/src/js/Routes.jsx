import React from 'react'
import { Switch, Route } from 'react-router-dom'

import withContext from './components/hoc/WithContext'
import Home from './routes/main/Home'

import NotFound from './routes/NotFound'
import FAQ from './routes/main/FAQ'
import PrivacyPolicy from './routes/main/PrivacyPolicy'

import Login from './routes/login/Login'
import Forgot from './routes/login/Forgot'
import Reset from './routes/login/Reset'
import Register from './routes/login/Register'

import Mod from './routes/mod/Mod'
import Publish from './routes/mod/Publish'
import Preview from './routes/mod/Preview'
import Edit from './routes/mod/Edit'
import Transfer from './routes/mod/Transfer'

import Settings from './routes/user/Settings'
import MyMods from './routes/user/MyMods'
import Admin from './routes/user/Admin'

const Routes = () =>
  <Switch>
    <Route exact path='/' component={ Home } />
    <Route exact path='/mods/:page?' component={ Home } />
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
    <Route path='/my-mods' component={ withContext(MyMods) } />
    <Route path='/admin' component={ withContext(Admin) } />

    <Route path='/' component={ NotFound } />
  </Switch>

export default Routes
