import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { API_URL, ADMIN } from '../../constants.js'
import Field from '../form/Field.jsx'

class AddGameVersion extends Component {
  constructor (props) {
    super(props)

    this.state = {
      tag: '',
      manifest: '',

      error: '',
      loading: false,
      success: false,

      gameVersions: [],
    }
  }

  static propTypes = {
    context: PropTypes.any,
    history: PropTypes.any,
    match: PropTypes.any,
  }

  componentDidMount () { this.fetchGameVersions() }

  async fetchGameVersions () {
    let gameVersions = await (await fetch(`${API_URL}/site/gameversions`, { credentials: 'include' })).json()
    this.setState({ gameVersions, gameVersion: gameVersions[0] })
  }

  async submitForm () {
    this.setState({ success: false, error: '' })
    let { tag, manifest } = this.state

    if (!tag) return this.setState({ error: ADMIN.MISSING_VERSION })
    if (!manifest) return this.setState({ error: ADMIN.MISSING_MANIFEST })
    if (manifest.length !== 19) return this.setState({ error: ADMIN.MANIFEST_WRONG_LENGTH })

    this.setState({ loading: true })

    let body = new URLSearchParams()
    body.set('value', tag)
    body.set('manifest', manifest)
    body.set('date', new Date().toString())

    await fetch(`${API_URL}/site/gameversions`, {
      method: 'POST',
      credentials: 'include',
      body,
    })

    this.setState({
      loading: false,
      success: true,
      tag: '',
      manifest: '',
    })

    this.fetchGameVersions()
  }

  render () {
    return (
      <div className='tile box publish-tile'>
        <Field
          label='Version Tag'
          type='text'
          autoComplete='off'
          placeholder='0.11.1'
          icon='bookmark'
          value={ this.state.tag }
          onChange={ e => this.setState({ tag: e.target.value, success: false }) }
          onEnter={ () => this.submitForm() }
        />

        <Field
          label='Version Manifest'
          type='text'
          autoComplete='off'
          placeholder='6574193224879562324'
          icon='database'
          prompt={ this.state.error }
          value={ this.state.manifest }
          onChange={ e => this.setState({ manifest: e.target.value.replace(/[^0-9]/g, '').substring(0, 19), success: false }) }
          onEnter={ () => this.submitForm() }
        />

        <button
          className={ `button is-dark ${this.state.loading ? 'is-loading' : ''}` }
          disabled={ this.state.loading || this.state.success }
          onClick={ () => this.submitForm() }
        >
          { this.state.success ? 'Version Added' : 'Add Version' }
        </button>

        <hr className='is-dark' />

        <label className='label'>Existing Versions</label>
        <div className='gameversion-list'>
          {
            this.state.gameVersions.slice(0, 10).map((version, i) =>
              <input
                key={ i }
                type='text'
                className='input'
                disabled
                value={ `${version.manifest} // ${version.value}` }
              />
            )
          }
        </div>
      </div>
    )
  }
}

export default AddGameVersion
