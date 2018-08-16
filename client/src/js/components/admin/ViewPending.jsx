import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import { BASE_URL } from '../../constants.js'

class ViewPending extends Component {
  constructor (props) {
    super(props)

    this.state = { pending: [] }
  }

  static propTypes = {
    context: PropTypes.any,
    history: PropTypes.any,
    match: PropTypes.any,
  }

  componentDidMount () { this.loadPending() }

  async loadPending () {
    let resp = await fetch(`${BASE_URL}/api/public/pending`)
    let pending = await resp.json()

    this.setState({ pending })
  }

  render () {
    return (
      <div className='tile box publish-tile'>
        <label className='label' style={{ marginBottom: '0' }}>Mods Pending Approval</label>
        <ul>
          {
            this.state.pending.map((mod, i) =>
              <li key={ i }>
                <Link key={ i } to={ `/mod/${mod.name}/${mod.version}` }>
                  <code>{ `${mod.name}@${mod.version} // ${mod.author}` }</code>
                </Link>
              </li>
            )
          }
        </ul>
      </div>
    )
  }
}

export default ViewPending
