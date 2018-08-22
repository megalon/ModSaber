import React from 'react'
import ReactDOM from 'react-dom'
import Loadable from 'react-loadable'
import { BrowserRouter } from 'react-router-dom'

import 'bulma/css/bulma.css'
import '@fortawesome/fontawesome-free/css/all.css'
import './css/overrides.css'

import App from './js/App.jsx'

const AppRouter =
  <BrowserRouter>
    <App />
  </BrowserRouter>

window.onload = () => {
  Loadable.preloadReady().then(() => {
    ReactDOM.hydrate(
      AppRouter,
      document.getElementById('root')
    )
  })
}
