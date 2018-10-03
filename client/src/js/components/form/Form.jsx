import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as semver from 'semver'

import { BASE_URL, API_URL, sanitise } from '../../constants.js'
import Field, { FieldArea, FieldAddon } from './Field.jsx'
import FileField from './FileField.jsx'

class Form extends Component {
  constructor (props) {
    super(props)

    this.state = {
      name: this.props.details.name || '',
      version: '',
      title: this.props.details.title || '',
      description: this.props.details.description || '',
      gameVersion: {},
      modType: {},

      dependsOn: [],
      dependsOnSuggestions: [],

      conflictsWith: [],
      conflictsWithSuggestions: [],

      gameVersions: [],

      modTypes: ['mod', 'avatar', 'saber', 'platform'],

      currentDependsOn: '',
      currentDependsOnError: '',

      currentconflictsWith: '',
      currentconflictsWithError: '',

      hasOculusFile: false,

      steamFile: {},
      oculusFile: {},

      error: {
        field: '',
        message: '',
      },

      loading: false,
      preview: null,

      modsSlim: [],
    }

    this.steamFile = React.createRef()
    this.oculusFile = React.createRef()
  }

  static propTypes = {
    details: PropTypes.any,
    new: PropTypes.bool.isRequired,
    history: PropTypes.any,
  }

  componentDidMount () {
    this.fetchGameVersions()
    this.loadSlimMods()

    if (!this.props.details.name) {
      let draft = localStorage.getItem('draft')
      if (!draft) return true

      let { name, version, title, description, set: s } = JSON.parse(draft)

      let now = new Date()
      let set = new Date(s)
      set.setMinutes(set.getMinutes() + 5)
      if (set < now) return true

      this.setState({ name, version, title, description })
    }
  }

  componentWillUnmount () {
    if (this.state.preview) this.state.preview.close()
  }

  componentDidUpdate (_, prevState) {
    let { name, version, title, description } = this.state

    if (prevState.name !== name) {
      localStorage.clear('draft')
      return false
    }

    localStorage.setItem('draft', JSON.stringify({ name, version, title, description, set: new Date() }))
  }

  async fetchGameVersions () {
    let gameVersions = await (await fetch(`${API_URL}/site/gameversions`, { credentials: 'include' })).json()
    this.setState({ gameVersions, gameVersion: gameVersions[0] })
  }

  async loadSlimMods () {
    let modsSlim = await (await fetch(`${API_URL}/slim/approved`, { credentials: 'include' })).json()
    this.setState({ modsSlim })
  }

  showPreviewWindow () {
    if (this.state.preview) this.state.preview.close()
    let preview = window.open('/preview', '', 'menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes,width=1280,height=720')
    this.setState({ preview })
  }

  updateDescription (text) {
    this.setState({ description: text })

    let { preview } = this.state
    if (!preview) return false

    preview.postMessage(text, '*')
  }

  searchMods (keyword, added) {
    const search = keyword === '' ? [] :
      this.state.modsSlim
        .filter(x => x.name !== this.state.name)
        .filter(x => x.name.includes(keyword))
        .map(x => `${x.name}@${x.versions[0]}`)
        .filter(x => !added.includes(x))
        .slice(0, 5)

    return search
  }

  updateDependencyForm (text) {
    const search = this.searchMods(text, this.state.dependsOn)
    this.setState({ currentDependsOn: text, currentDependsOnError: '', dependsOnSuggestions: search })
  }

  updateConflictForm (text) {
    const search = this.searchMods(text, this.state.conflictsWith)
    this.setState({ currentconflictsWith: text, currentconflictsWithError: '', conflictsWithSuggestions: search })
  }

  async addDependency () {
    let { currentDependsOn, name } = this.state
    if (currentDependsOn === name) return this.setState({ currentDependsOnError: 'Cannot add self as a dependency' })
    if (currentDependsOn === '') return this.setState({ currentDependsOnError: 'Invalid mod' })

    if (this.state.conflictsWith.includes(currentDependsOn)) {
      return this.setState({ currentDependsOnError: 'Cannot be a dependency and a conflict' })
    }

    const [mod, version] = currentDependsOn.split('@')
    let resp = await fetch(`${BASE_URL}/registry/${mod}/${version}`)
    if (resp.status === 404) return this.setState({ currentDependsOnError: 'Mod not found' })

    let { approved } = await resp.json()
    if (!approved) return this.setState({ currentDependsOnError: 'Mod not found' })

    this.setState(prevState => ({
      currentDependsOn: '',
      currentDependsOnError: '',
      dependsOn: [...prevState.dependsOn, currentDependsOn],
    }))
  }

  removeDependency (index) {
    let dependsOn = [...this.state.dependsOn]
    dependsOn.splice(index, 1)
    this.setState({ dependsOn })
  }

  async addConflict () {
    let { currentconflictsWith, name } = this.state
    if (currentconflictsWith === name) return this.setState({ currentconflictsWithError: 'Cannot add self as a dependency' })
    if (currentconflictsWith === '') return this.setState({ currentconflictsWithError: 'Invalid mod' })

    if (this.state.dependsOn.includes(currentconflictsWith)) {
      return this.setState({ currentconflictsWithError: 'Cannot be a dependency and a conflict' })
    }

    const [mod, version] = currentconflictsWith.split('@')
    let resp = await fetch(`${BASE_URL}/registry/${mod}/${version}`)
    if (resp.status === 404) return this.setState({ currentconflictsWithError: 'Mod not found' })

    let { approved } = await resp.json()
    if (!approved) return this.setState({ currentDependsOnError: 'Mod not found' })

    this.setState(prevState => ({
      currentconflictsWith: '',
      currentconflictsWithError: '',
      conflictsWith: [...prevState.conflictsWith, currentconflictsWith],
    }))
  }

  removeConflict (index) {
    let conflictsWith = [...this.state.conflictsWith]
    conflictsWith.splice(index, 1)
    this.setState({ conflictsWith })
  }

  isError (field, message) {
    this.setState({ error: { field, message }, loading: false })
    return true
  }

  async submitForm () {
    if (this.state.name === '') return this.isError('name', 'Cannot be blank')
    if (this.state.version === '') return this.isError('version', 'Cannot be blank')
    if (!semver.valid(semver.coerce(this.state.version))) return this.isError('version', 'Must follow semver')
    if (this.state.title === '') return this.isError('title', 'Cannot be blank')
    if (Object.keys(this.state.steamFile).length === 0 && this.state.steamFile.constructor === Object) {
      return this.isError('files', 'Please upload a .zip')
    }

    this.setState({ loading: true })
    const body = new FormData()

    body.set('name', this.state.name)
    body.set('version', this.state.version)
    body.set('title', this.state.title)
    body.set('description', this.state.description)
    body.set('gameVersion', this.state.gameVersion.id)
    body.set('type', this.state.modType)

    if (this.state.dependsOn.length > 0) body.set('dependsOn', this.state.dependsOn.join(','))
    if (this.state.conflictsWith.length > 0) body.set('conflictsWith', this.state.conflictsWith.join(','))

    body.set('steam', this.state.steamFile)
    if (!(Object.keys(this.state.oculusFile).length === 0 && this.state.oculusFile.constructor === Object)) {
      body.set('oculus', this.state.oculusFile)
    }

    try {
      let resp = await fetch(`${API_URL}/files/publish`, {
        method: 'POST',
        credentials: 'include',
        body,
      })

      if (resp.status === 200) {
        localStorage.clear('draft')
        setTimeout(() => {
        // Sometimes needs time to finish
          this.props.history.push(`/mod/${this.state.name}/${semver.coerce(this.state.version)}`)
        }, 1000)
      }

      if (resp.status === 500) return this.isError('files', 'Something went wrong...')
      if (resp.status === 401 && this.props.new) return this.isError('name', 'This name is already taken')
      if (resp.status === 401 && !this.props.new) return this.isError('name', 'You do not have permission to publish an update')

      try {
        let json = await resp.json()
        if (resp.status === 403) {
          if (json.error === 'semver') return this.isError('version', `Version must be newer than ${json.version}`)
          if (json.error === 'verification') return this.isError('files', 'You must verify your account')
        }

        if (resp.status === 400) {
          let field = this.state.hasOculusFile ? json.field.charAt(0).toUpperCase() + json.field.slice(1) : 'Uploaded'
          if (json.error === 'file_wrong_type') return this.isError('files', `${field} file is not a .zip, you uploaded ${json.mime}`)
          if (json.error === 'file_blank') return this.isError('files', `${field} .zip must contain at least one file`)
          if (json.error === 'file_contains_blocked') return this.isError('files', `${field} .zip contains blocked files`)
        }
      } catch (err) {
      // Silently fail lol
      }
    } catch (err) {
      return this.isError('files', 'File cannot be greater than 10MB')
    }
  }

  render () {
    return (
      <div className='tile box publish-tile'>
        <div className='field'>
          <div className='control'>
            <label className='label'>Mod Type</label>
            <div className='select'>
              <select onChange={ e => { this.setState({ modType: e.target.value }) }}>
                {
                  this.state.modTypes.map(value =>
                    <option key={value} value={ JSON.stringify(value) }>
                      { value }
                    </option>)
                }
              </select>
            </div>
          </div>
        </div>

        <Field
          label='Mod Name'
          type='text'
          autofocus={ this.props.new }
          autoComplete='off'
          autoCapitalize='off'
          placeholder='Internal database name. Must be lowercase and alphanumeric.'
          prompt={ this.state.error.field === 'name' ? this.state.error.message : '' }
          value={ this.state.name }
          disabled={ !this.props.new }
          onChange={ e => this.setState({ name: sanitise(e.target.value, 35), error: {} }) }
        />

        <Field
          label='Version'
          type='text'
          autoComplete='off'
          autofocus={ !this.props.new }
          prompt={ this.state.error.field === 'version' ? this.state.error.message : '' }
          placeholder={ this.props.details.version ? this.props.details.version : 'Must follow semver (Google it)' }
          value={ this.state.version }
          onChange={ e => this.setState({ version: e.target.value, error: {} }) }
        />

        <Field
          label='Mod Title'
          type='text'
          autoComplete='off'
          placeholder='Mod Title. Shown on pages and in the mod installer.'
          prompt={ this.state.error.field === 'title' ? this.state.error.message : '' }
          value={ this.state.title }
          onChange={ e => this.setState({ title: e.target.value.substring(0, 50), error: {} }) }
        />

        <label className='label' style={{ marginBottom: '0' }}>
          Description <a onClick={ () => this.showPreviewWindow() }>[OPEN PREVIEW]</a>
        </label>
        <FieldArea
          type='text'
          placeholder='Long description text. Supports Markdown.'
          value={ this.state.description }
          onChange={ e => this.updateDescription(e.target.value.substring(0, 10000)) }
        />

        <div className='field'>
          <div className='control'>
            <label className='label'>Game Version</label>
            <div className='select'>
              <select onChange={ e => { this.setState({ gameVersion: JSON.parse(e.target.value) }) }}>
                {
                  this.state.gameVersions.map(({ value, manifest }, i) =>
                    <option key={manifest} value={ JSON.stringify({ value, manifest }) }>
                      { value } { i === 0 ? '[LATEST]' : '' }
                    </option>)
                }
              </select>
            </div>
          </div>
        </div>

        <FieldAddon
          label='Depends On'
          type='text'
          autoComplete='off'
          autoCapitalize='off'
          prompt={ this.state.currentDependsOnError }
          button='Add Dependency'
          buttonClass='is-link'
          onButtonPress={ () => { this.addDependency() } }
          onEnter={ () => { this.addDependency() } }
          value={ this.state.currentDependsOn }
          onChange={ e => this.updateDependencyForm(sanitise(e.target.value, 35)) }
        />

        <InputDropdown
          array={ this.state.dependsOnSuggestions }
          onClick={ text => this.setState({ currentDependsOn: text, dependsOnSuggestions: [] }) }
        />

        {
          this.state.dependsOn.map((x, i) =>
            <FieldAddon
              key={ i }
              type='text'
              button='Remove'
              buttonClass='is-danger'
              onButtonPress={ () => { this.removeDependency(i) } }
              onEnter={ () => { this.removeDependency(i) } }
              value={ x }
              readOnly
              isChild
            />
          )
        }

        <FieldAddon
          label='Conflicts With'
          type='text'
          autoComplete='off'
          autoCapitalize='off'
          prompt={ this.state.currentconflictsWithError }
          button='Add Conflict'
          buttonClass='is-link'
          onButtonPress={ () => { this.addConflict() } }
          onEnter={ () => { this.addConflict() } }
          value={ this.state.currentconflictsWith }
          onChange={ e => this.updateConflictForm(sanitise(e.target.value, 35)) }
        />

        <InputDropdown
          array={ this.state.conflictsWithSuggestions }
          onClick={ text => this.setState({ currentconflictsWith: text, conflictsWithSuggestions: [] }) }
        />

        {
          this.state.conflictsWith.map((x, i) =>
            <FieldAddon
              key={ i }
              type='text'
              button='Remove'
              buttonClass='is-danger'
              onButtonPress={ () => { this.removeConflict(i) } }
              onEnter={ () => { this.removeConflict(i) } }
              value={ x }
              readOnly
              isChild
            />
          )
        }

        <div className='control'>
          <label className='label'>{ this.state.hasOculusFile ? 'Files' : 'File' }</label>

          <p style={{ marginTop: '-5px', marginBottom: '10px' }}><i>
            Files must be in a <code>.zip</code> file. The root of the <code>.zip</code> should correspond to the Beat Saber install directory.<br />
            If you are uploading a plugin, you would need a <code>Plugins</code> directory inside the <code>.zip</code><br /><br />
            REMEMBER: Everything uploaded will be public. If you need to obfuscate your DLLs, do it before uploading them.
          </i></p>

          <div className='field'>
            <input
              type='checkbox'
              checked={ this.state.hasOculusFile }
              onChange={ () => this.setState({ hasOculusFile: !this.state.hasOculusFile }) }
              className='is-checkradio is-link'
              id='checkbox'
            />
            <label htmlFor='checkbox'>Upload Seperate File for Oculus users</label>
          </div>

          <FileField
            name={ this.state.hasOculusFile ? 'Steam' : 'Upload' }
            node={ this.steamFile }
            file={ this.state.steamFile }
            onChange={ e => this.setState({ steamFile: e.target.files[0], error: {} }) }
          />
          <FileField
            isHidden={ !this.state.hasOculusFile }
            name='Oculus'
            node={ this.oculusFile }
            file={ this.state.oculusFile }
            onChange={ e => this.setState({ oculusFile: e.target.files[0], error: {} }) }
          />

          <p className='help is-danger' style={{ marginTop: '-7px' }}>
            { this.state.error.field === 'files' ? this.state.error.message : '' }
          </p>
        </div>

        <button
          style={{ marginTop: '7px' }}
          disabled={ this.state.loading }
          className={ `button is-dark is-fullwidth ${this.state.loading ? 'is-loading' : ''}` }
          onClick={ () => this.submitForm() }
        >
          Publish
        </button>
      </div>
    )
  }
}

const InputDropdown = props =>
  <div style={{ display: props.array.length === 0 ? 'none' : 'initial' }}>
    <div className='input-dropdown'>
      <div className='dropdown-content'>
        {
          props.array.map((x, i) =>
            <span key={ i } className='input-dropdown-item' onClick={ () => props.onClick(x) }>{ x }</span>
          )
        }
      </div>
    </div>
  </div>

InputDropdown.propTypes = {
  array: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
}

export default Form
