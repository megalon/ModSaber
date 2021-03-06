import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'

import { API_URL } from '../../constants.js'
import Layout from '../../components/layout/Layout.jsx'
import Mods from '../../components/layout/Mods.jsx'

class MyMods extends Component {
  constructor (props) {
    super(props)

    this.state = {
      mods: [],
      showOldVersions: false,
    }
  }

  componentDidMount () { this.loadMods() }

  static propTypes = {
    context: PropTypes.any,
    history: PropTypes.any,
    match: PropTypes.any,
  }

  componentDidUpdate (prevProps) {
    this.checkPermissions()
    if (this.props.context.user !== prevProps.context.user) this.loadMods()
  }

  checkPermissions () {
    // Check for logged in state
    if (this.props.context.loggedIn === false) this.props.history.replace('')
  }

  async loadMods () {
    if (!this.props.context.loggedIn) return undefined

    let mods = await (await fetch(`${API_URL}/mods/by-user/${this.props.context.user.username}`, { credentials: 'include' })).json()
    this.setState({ mods })
  }

  filterMods (mods) {
    const map = new Map()
    for (let mod of [...mods].reverse()) { map.set(mod.name, mod) }
    return [...map.values()].reverse()
  }

  toggleDisplay () {
    this.setState(prevstate => ({ showOldVersions: !prevstate.showOldVersions }))
  }

  render () {
    const mods = this.state.showOldVersions ?
      this.state.mods :
      this.filterMods(this.state.mods)

    return (
      <Layout history={ this.props.history }>
        <Helmet>
          <title>ModSaber | My Mods</title>
        </Helmet>

        <div className='columns'>
          <div className='column is-10'>
            <h1 className='is-size-1 has-text-weight-semibold'>My Mods</h1>
            <p><i>View your uploaded mods here</i></p>
          </div>

          <div className='column home-buttons'>
            <button className='button is-dark is-outlined is-inverted' onClick={ () => this.toggleDisplay() }>
              <span>Show old versions?</span>
              <span className='icon is-medium'>
                <i className={ `fas fa-${this.state.showOldVersions ? 'check' : 'times'}` }></i>
              </span>
            </button>
          </div>
        </div>
        <hr />

        <Mods mods={ mods } showMore showApprovals>
          <p>
            <b>Looks like you don&#39;t have any mods!</b><br />
            <i>If this isn&#39;t supposed to be the case, please alert a site admin.</i><br /><br />
            Otherwise, why not <Link to='/publish'>publish a mod!</Link>
          </p>
        </Mods>
      </Layout>
    )
  }
}

export default MyMods
