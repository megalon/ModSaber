import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'

import { API_URL } from '../../constants.js'
import Layout from '../../components/layout/Layout.jsx'
import Mods from '../../components/layout/Mods.jsx'

class Author extends Component {
  constructor (props) {
    super(props)

    this.state = {
      mods: [],
    }
  }

  static propTypes = {
    context: PropTypes.any,
    history: PropTypes.any,
    match: PropTypes.any,
  }

  componentDidMount () { this.loadMods() }

  componentDidUpdate (prevProps) {
    if (this.props.match.params !== prevProps.match.params) this.loadMods()
  }

  async loadMods () {
    const { username } = this.props.match.params

    try {
      let mods = await (await fetch(`${API_URL}/mods/by-user/${username}`)).json()
      this.setState({ mods })
    } catch (err) {
      // Do Nothing
    }
  }

  filterMods (mods) {
    const map = new Map()
    for (let mod of [...mods].reverse()) { map.set(mod.name, mod) }
    return [...map.values()].reverse()
  }

  render () {
    const mods = this.filterMods(this.state.mods)

    const author = this.props.match.params.username.toLowerCase()
    const authorText = author.slice(-1) === 's' ?
      `${author}'` :
      `${author}'s`

    return (
      <Layout history={ this.props.history }>
        <Helmet>
          <title>ModSaber | { authorText } Mods</title>
        </Helmet>

        <div className='columns'>
          <div className='column'>
            <h1 className='is-size-1 has-text-weight-semibold'>{ authorText } Mods</h1>
            <p><i>All mods published by { author }</i></p>
          </div>
        </div>
        <hr />

        <Mods mods={ mods } showMore>
          <p>
            <b>Looks like { author } doesn&#39;t have any mods!</b><br />
            <i>If this isn&#39;t supposed to be the case, please alert a site admin.</i><br /><br />
            Otherwise, try again later!
          </p>
        </Mods>
      </Layout>
    )
  }
}

export default Author
