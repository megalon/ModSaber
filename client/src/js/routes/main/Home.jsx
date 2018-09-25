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
      showMore: false,
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

    const mods = [].concat(...multi)
    this.setState({ mods })
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
          showMore={ this.state.showMore }
          showMoreClicked={ () => this.setState({ showMore: true }) }
        />
      </MainPage>
    )
  }
}

export default Home
