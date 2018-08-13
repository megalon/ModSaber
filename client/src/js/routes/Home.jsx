import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import * as chunk from 'chunk'

import { BASE_URL } from '../constants.js'
import MainPage from '../components/MainPage.jsx'
import Paginator from '../components/Paginator.jsx'

class Home extends Component {
  constructor (props) {
    super(props)

    this.state = {
      mods: [],
      page: 0,
    }
  }

  componentDidMount () { this.loadMods() }

  async loadMods () {
    let mods = await (await fetch(`${BASE_URL}/api/public/slim/approved`)).json()
    mods = chunk(mods, 5)
    this.setState({ mods })
  }

  prevPage () {
    this.setState(({ page }) => {
      page -= 1
      if (page < 0) page = 0

      return { page }
    })
  }

  nextPage () {
    this.setState(({ page }) => {
      page += 1
      if (page > this.state.mods.length - 1) page = this.state.mods.length - 1

      return { page }
    })
  }

  gotoPage (page) {
    this.setState({ page })
  }

  render () {
    let { mods } = this.state

    return (
      <MainPage {...this.props}>
        <Helmet>
          <title>ModSaber</title>
        </Helmet>

        {
          this.state.mods.length > 0 ? null :
            <Fragment>
              <hr />
              <p>
                <b>Well this is embarrassing, it looks like there are no mods.</b><br />
                <i>If this isn&#39;t supposed to be the case, please alert a site admin.</i><br /><br />
                Otherwise, sign up and be the first to publish a mod!
              </p>
            </Fragment>
        }

        <Paginator
          max={ mods.length }
          current={ this.state.page }
          prev={ () => this.prevPage() }
          next={ () => this.nextPage() }
          goto={ i => this.gotoPage(i) }
        />

        {
          mods.length === 0 ? null :
            mods[this.state.page].map((mod, i) =>
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
      </MainPage>
    )
  }
}

export default Home
