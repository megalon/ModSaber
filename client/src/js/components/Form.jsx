import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as semver from 'semver'

import { BASE_URL, sanitise } from '../constants.js'
import Field, { FieldArea, FieldAddon } from './Field.jsx'

class Form extends Component {
  constructor (props) {
    super(props)

    this.state = {
      name: this.props.details.name || '',
      version: '',
      title: this.props.details.title || '',
      description: this.props.details.description || '',
      gameVersion: {},
      dependsOn: [],
      conflictsWith: [],

      gameVersions: [],

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
    }

    this.steamFile = React.createRef()
    this.oculusFile = React.createRef()
  }

  static propTypes = {
    details: PropTypes.any,
    new: PropTypes.bool.isRequired,
    history: PropTypes.any,
  }

  componentDidMount () { this.fetchGameVersions() }

  async fetchGameVersions () {
    let gameVersions = await (await fetch(`${BASE_URL}/api/public/gameversions`, { credentials: 'include' })).json()
    this.setState({ gameVersions, gameVersion: gameVersions[0] })
  }

  async addDependency () {
    let { currentDependsOn, name } = this.state
    if (currentDependsOn === name) return this.setState({ currentDependsOnError: 'Cannot add self as a dependency' })
    if (currentDependsOn === '') return this.setState({ currentDependsOnError: 'Invalid mod' })

    if (this.state.conflictsWith.includes(currentDependsOn)) {
      return this.setState({ currentDependsOnError: 'Cannot be a dependency and a conflict' })
    }

    let resp = await fetch(`${BASE_URL}/registry/${currentDependsOn}`)
    if (resp.status === 404) return this.setState({ currentDependsOnError: 'Mod not found' })

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

    let resp = await fetch(`${BASE_URL}/registry/${currentconflictsWith}`)
    if (resp.status === 404) return this.setState({ currentconflictsWithError: 'Mod not found' })

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

    if (this.state.dependsOn.length > 0) body.set('dependsOn', this.state.dependsOn.join(','))
    if (this.state.conflictsWith.length > 0) body.set('conflictsWith', this.state.conflictsWith.join(','))

    body.set('steam', this.state.steamFile)
    if (!(Object.keys(this.state.oculusFile).length === 0 && this.state.oculusFile.constructor === Object)) {
      body.set('oculus', this.state.oculusFile)
    }

    let resp = await fetch(`${BASE_URL}/api/secure/upload`, {
      method: 'POST',
      credentials: 'include',
      body,
    })

    if (resp.status === 200) {
      setTimeout(() => {
        // Sometimes needs time to finish
        this.props.history.push(`/mod/${this.state.name}/${this.state.version}`)
      }, 1000)
    }

    if (resp.status === 401 && this.props.new) return this.isError('name', 'This name is already taken')
    if (resp.status === 401 && !this.props.new) return this.isError('name', 'You do not have permission to publish an update')

    let json = await resp.json()
    if (resp.status === 403) {
      if (json.error === 'semver') return this.isError('version', `Version must be newer than ${json.version}`)
      if (json.error === 'verification') return this.isError('files', 'You must verify your account')
    }
  }

  render () {
    return (
      <div className='tile box publish-tile'>
        <Field
          label='Mod Name'
          type='text'
          placeholder='Internal database name. Must be lowercase and alphanumeric.'
          prompt={ this.state.error.field === 'name' ? this.state.error.message : '' }
          value={ this.state.name }
          disabled={ !this.props.new }
          onChange={ e => this.setState({ name: sanitise(e.target.value, 35), error: {} }) }
        />

        <Field
          label='Version'
          type='text'
          prompt={ this.state.error.field === 'version' ? this.state.error.message : '' }
          placeholder={ this.props.details.version ? this.props.details.version : 'Must follow semver (Google it)' }
          value={ this.state.version }
          onChange={ e => this.setState({ version: e.target.value, error: {} }) }
        />

        <Field
          label='Mod Title'
          type='text'
          placeholder='Mod Title. Shown on pages and in the mod installer.'
          prompt={ this.state.error.field === 'title' ? this.state.error.message : '' }
          value={ this.state.title }
          onChange={ e => this.setState({ title: e.target.value.substring(0, 50), error: {} }) }
        />

        <FieldArea
          label='Description'
          type='text'
          placeholder='Long description text. Supports Markdown.'
          value={ this.state.description }
          onChange={ e => this.setState({ description: e.target.value.substring(0, 1000) }) }
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
          label='Depends On [OPTIONAL]'
          type='text'
          prompt={ this.state.currentDependsOnError }
          button='Add Dependency'
          buttonClass='is-link'
          onButtonPress={ () => { this.addDependency() } }
          onEnter={ () => { this.addDependency() } }
          value={ this.state.currentDependsOn }
          onChange={ e => this.setState({ currentDependsOn: sanitise(e.target.value, 35), currentDependsOnError: '' }) }
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
          label='Conflicts With [OPTIONAL]'
          type='text'
          prompt={ this.state.currentconflictsWithError }
          button='Add Conflict'
          buttonClass='is-link'
          onButtonPress={ () => { this.addConflict() } }
          onEnter={ () => { this.addConflict() } }
          value={ this.state.currentconflictsWith }
          onChange={ e => this.setState({ currentconflictsWith: sanitise(e.target.value, 35), currentconflictsWithError: '' }) }
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
            <label className='checkbox'>
              <input
                type='checkbox'
                checked={ this.state.hasOculusFile }
                onChange={ () => this.setState({ hasOculusFile: !this.state.hasOculusFile }) }
              />
              <span> Upload Seperate File for Oculus users</span>
            </label>
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

          <p className='help is-danger'>
            { this.state.error.field === 'files' ? this.state.error.message : '' }
          </p>
        </div>

        <button
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

const FileField = props =>
  <div className={ `file has-name is-fullwidth ${props.isHidden ? 'is-invis' : ''}` } style={{ marginBottom: '10px' }}>
    <label className='file-label'>
      <input
        className='file-input'
        type='file'
        accept='.zip'
        ref={ props.node }
        onChange={ props.onChange }
      />
      <span className='file-cta'>
        <span className='file-icon'><i className='fas fa-upload'></i></span>
        <span className='file-label'>{ props.name }</span>
      </span>
      <span className='file-name'>{ props.file.name }</span>
    </label>
  </div>

FileField.propTypes = {
  name: PropTypes.string.isRequired,
  isHidden: PropTypes.bool,
  node: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  file: PropTypes.any.isRequired,
}

export default Form
