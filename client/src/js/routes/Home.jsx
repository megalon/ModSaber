import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'

import { BASE_URL } from '../constants.js'
import Layout from '../components/Layout.jsx'

class Home extends Component {
  constructor (props) {
    super(props)

    this.state = {
      mods: [],
    }
  }

  componentDidMount () { this.loadMods() }

  async loadMods () {
    let mods = await (await fetch(`${BASE_URL}/api/public/slim/new`)).json()
    this.setState({ mods })
  }

  static propTypes = { history: PropTypes.any }

  render () {
    return (
      <Layout history={ this.props.history } >
        <Helmet>
          <title>ModSaber</title>
        </Helmet>

        <h1 className='is-size-1 has-text-weight-semibold'>ModSaber</h1>
        <p><i>Beat Saber Mods Database</i></p>

        {
          this.state.mods.map((mod, i) =>
            <Fragment key={ i }>
              <hr />
              <h2 className='is-size-4' style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                <Link to={ `/mod/${mod.name}/${mod.versions[0]}` } className='mod-link'>
                  <span className='has-text-weight-bold'>{ mod.title }</span>
                </Link>
                <span style={{ marginLeft: '14px', marginTop: '5px' }} className='tag is-link'>{ mod.tag }</span>
              </h2>

              <code style={{ color: '#060606' }}>{ mod.name }@{ mod.versions[0] } &#47;&#47; { mod.author }</code>
            </Fragment>
          )
        }
      </Layout>
    )
  }
}

export default Home
