import React, { Component } from 'react'
import { Helmet } from 'react-helmet'

import { API_URL } from '../../constants.js'
import MainPage from '../../components/layout/MainPage.jsx'
import Mods from '../../components/layout/Mods.jsx'

class Home extends Component {
  constructor (props) {
    super(props)

    this.state = {
      mods: [],
      sabers: [],
      avatars: [],
      platforms: [],
      other: [],
      showMore: false,
      currentTable: `mods`,
    }
  }

  componentDidMount () { this.loadMods() }

  async loadMods () {
    let { lastPage } = await (await fetch(`${API_URL}/mods/approved`)).json()
    const pages = Array.from(new Array(lastPage + 1)).map((_, i) => i)

    const multi = await Promise.all(pages.map(async page => {
      const resp = await (await fetch(`${API_URL}/mods/approved/${page}`)).json()
      return resp.mods
    }))

    const allMods = [].concat(...multi)

    const mods = []
    const sabers = []
    const avatars = []
    const platforms = []
    const other = []
    for (let mod of allMods) {
      if (mod.type === `mod`) mods.push(mod)
      else if (mod.type === `saber`) sabers.push(mod)
      else if (mod.type === `avatar`) avatars.push(mod)
      else if (mod.type === `platform`) platforms.push(mod)
      else other.push(mod)
    }

    this.setState({ mods, sabers, avatars, platforms, other })
  }

  render () {
    return (
      <MainPage {...this.props}>
        <Helmet>
          <title>ModSaber</title>
        </Helmet>
        <hr/>

        <Mods
          mods={ this.state.mods }
          sabers={ this.state.sabers }
          avatars={ this.state.avatars }
          platforms={ this.state.platforms }
          other={ this.state.other }
          showMore={ this.state.showMore }
          currentTable={ this.state.currentTable }
          showMoreClicked={ () => this.setState({ showMore: true }) }
          setCurrentTable={ x => this.setState({ currentTable: x }) }
          authorLinks
        >
          <p>
            <b>Well this is embarrassing, it looks like there are no mods.</b><br />
            <i>If this isn&#39;t supposed to be the case, please alert a site admin.</i><br /><br />
            Otherwise, sign up and be the first to publish a mod!
          </p>
        </Mods>
      </MainPage>
    )
  }
}

export default Home
