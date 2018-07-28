import React, { Component } from 'react'
import * as ReactMarkdown from 'react-markdown'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'

import { BASE_URL } from '../constants.js'

import NotFound from './NotFound.jsx'
import Layout from '../components/Layout.jsx'

class Mod extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loaded: false,
      mod: {},
      showControls: true,
    }
  }

  static propTypes = {
    history: PropTypes.any,
    match: PropTypes.any,
    context: PropTypes.any,
  }

  componentDidMount () { this.loadData() }

  componentDidUpdate (prevProps) {
    if (this.props.match.params !== prevProps.match.params) this.loadData()
  }

  async loadData () {
    this.setState({ loaded: false })
    let { name, version } = this.props.match.params
    let resp = await fetch(`${BASE_URL}/registry/${name}/${version ? version : ''}`)

    if (resp.status !== 200) return this.setState({ loaded: true })

    let mod = await resp.json()
    this.setState({ mod, loaded: true })
  }

  render () {
    if (this.state.loaded && this.state.mod.name === undefined) return <NotFound history={ this.props.history } />

    let { mod } = this.state
    return (
      <Layout history={ this.props.history } >
        <Helmet>
          <title>{ `ModSaber | ${mod.title}` }</title>
        </Helmet>

        <div className='mod-titles'>
          <h1 className='is-size-1 has-text-weight-semibold'>{ mod.title }</h1>
          <span style={{ marginLeft: '20px', marginTop: '15px' }} className='tag is-link'>{ mod.tag }</span>
        </div>
        <code style={{ color: '#060606' }}>{ mod.name }@{ mod.version }</code>
        <hr />

        <div className='content'>
          <ReactMarkdown source={ mod.description } />
        </div>
      </Layout>
    )
  }
}

export default Mod
