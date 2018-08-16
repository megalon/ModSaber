import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { BASE_URL, AUTH, sanitise } from '../../constants.js'
import Field from '../form/Field.jsx'

class ManageAdmins extends Component {
  constructor (props) {
    super(props)

    this.state = {
      username: '',

      error: '',
      loading: false,

      promoted: false,
      demoted: false,
      admins: [],
    }
  }

  static propTypes = {
    context: PropTypes.any,
    history: PropTypes.any,
    match: PropTypes.any,
  }

  componentDidMount () { this.loadAdmins() }

  async loadAdmins () {
    let admins = await (await fetch(`${BASE_URL}/api/secure/admins`, { credentials: 'include' })).json()
    this.setState({ admins })
  }

  async submitForm (action) {
    this.setState({ promoted: false, demoted: false, error: '' })
    let { username } = this.state

    if (!username) return this.setState({ error: AUTH.INVALID_USERNAME })
    this.setState({ loading: true })

    let body = new URLSearchParams()
    body.set('username', username)
    body.set('action', action)

    let resp = await fetch(`${BASE_URL}/api/secure/admins/modify`, {
      method: 'POST',
      credentials: 'include',
      body,
    })

    if (resp.status === 404) return this.setState({ loading: false, error: AUTH.UNKNOWN_USERNAME })

    this.setState({
      loading: false,
      promoted: action === 'promote',
      demoted: action === 'demote',
      tag: '',
      manifest: '',
    })

    this.loadAdmins()
  }

  render () {
    return (
      <div className='tile box publish-tile'>
        <Field
          label='Username'
          type='text'
          autoComplete='off'
          autoCapitalize='off'
          placeholder='Username'
          icon='user'
          value={ this.state.username }
          prompt={ this.state.error }
          onChange={ e => this.setState({ username: sanitise(e.target.value), promoted: false, demoted: false }) }
          onEnter={ () => {
            // Do Nothing
          } }
        />

        <div className='columns' style={{ marginBottom: '3px' }}>
          <div className='column' style={{ paddingBottom: 0 }}>
            <button
              className={ `button is-dark is-fullwidth ${this.state.loading ? 'is-loading' : ''} ${this.state.promoted ? 'is-success' : ''}` }
              disabled={ this.state.loading }
              onClick={ () => this.submitForm('promote') }
            >
              { this.state.promoted ? 'Done!' : 'Promote' }
            </button>
          </div>

          <div className='column' style={{ paddingBottom: 0 }}>
            <button
              className={ `button is-dark is-fullwidth ${this.state.loading ? 'is-loading' : ''} ${this.state.demoted ? 'is-success' : ''}` }
              disabled={ this.state.loading}
              onClick={ () => this.submitForm('demote') }
            >
              { this.state.demoted ? 'Done!' : 'Demote' }
            </button>
          </div>
        </div>

        <hr className='is-dark' />

        <label className='label'>Site Admins</label>
        <div className='gameversion-list'>
          {
            this.state.admins.map((user, i) =>
              <input
                key={ i }
                type='text'
                className='input'
                disabled
                value={ user.username }
              />
            )
          }
        </div>
      </div>
    )
  }
}

export default ManageAdmins
