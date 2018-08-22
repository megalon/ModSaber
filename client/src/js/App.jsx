import React from 'react'

import { UserProvider } from './Context.jsx'
import Routes from './Routes.jsx'

const App = () =>
  <div className='has-text-white'>
    <UserProvider>
      <Routes />
    </UserProvider>
  </div>

export default App
