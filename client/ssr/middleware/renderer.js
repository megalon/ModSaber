/* global __dirname */
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import Helmet from 'react-helmet'
import Loadable from 'react-loadable'

// Import our main App component
import App from '../../src/js/App.jsx'

import manifest from '../../build/asset-manifest.json'
const extractAssets = (assets, chunks) => Object.keys(assets)
  .filter(asset => chunks.indexOf(asset.replace('.js', '')) > -1)
  .map(k => assets[k])

const path = require('path')
const fs = require('fs')

export default (req, res) => {
  // Point to the html file created by CRA's build tool
  const filePath = path.resolve(__dirname, '..', '..', 'build', 'index.html')

  fs.readFile(filePath, 'utf8', (err, htmlData) => {
    if (err) {
      console.error('err', err)
      return res.status(404).end()
    }

    const context = {}
    const modules = []

    // Render the app as a string
    const html = ReactDOMServer.renderToString(
      <Loadable.Capture report={ m => modules.push(m) }>
        <StaticRouter location={ req.url } context={ context }>
          <App />
        </StaticRouter>
      </Loadable.Capture>
    )

    const helmet = Helmet.renderStatic()

    const extraChunks = extractAssets(manifest, modules)
      .map(c => `<script type="text/javascript" src="/${c}"></script>`)

    // Inject the rendered app into our html and send it
    return res.send(
      htmlData
        // Write Helmet Tags
        .replace('<head>', `<head>${helmet.title.toString()}${helmet.meta.toString()}${helmet.link.toString()}`)
        // Write the React app
        .replace('<div id="root"></div>', `<div id="root">${html}</div>`)
        // Append the extra JS assets
        .replace('</body>', `${extraChunks.join('')}</body>`)
    )
  })
}
