import React from 'react'
import ReactDOM from 'react-dom'
import Loadable from 'react-loadable'
import { BrowserRouter } from 'react-router-dom'
import { parse } from 'url'

import 'bulma/css/bulma.css'
import '@fortawesome/fontawesome-free/css/all.css'
import 'bulma-checkradio/dist/css/bulma-checkradio.min.css'
import './css/overrides.css'

import App from './js/App.jsx'

// Attempt to redirect old URLs
const url = parse(window.location.href)
if (url.hash !== null) {
  const { protocol, host, hash } = url
  const newURL = `${protocol}//${host}/${hash.replace('#/', '')}`
  window.location.href = newURL
}

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
