import React from 'react'

import { UserProvider } from './Context.jsx'
import Router from './Router.jsx'

const App = () =>
  <div className='has-text-white'>
    <UserProvider>
      <Router />
    </UserProvider>
  </div>

export default App
