import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { BASE_URL, sanitise } from '../constants.js'
import Field, { FieldArea } from './Field.jsx'

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
    }
  }

  static propTypes = {
    details: PropTypes.any,
    new: PropTypes.bool.isRequired,
  }

  componentDidMount () { this.fetchGameVersions() }

  async fetchGameVersions () {
    let gameVersions = await (await fetch(`${BASE_URL}/api/public/gameversions`, { credentials: 'include' })).json()
    this.setState({ gameVersions })
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

  render () {
    return (
      <div className='tile box publish-tile'>
        <Field
          label='Mod Name'
          type='text'
          value={ this.state.name }
          disabled={ !this.props.new }
          onChange={ e => this.setState({ name: sanitise(e.target.value, 35) }) }
        />

        <Field
          label='Version'
          type='text'
          placeholder={ this.props.details.version }
          value={ this.state.version }
          onChange={ e => this.setState({ version: e.target.value }) }
        />

        <Field
          label='Mod Title'
          type='text'
          value={ this.state.title }
          onChange={ e => this.setState({ title: e.target.value.substring(0, 50) }) }
        />

        <FieldArea
          label='Description'
          type='text'
          value={ this.state.description }
          onChange={ e => this.setState({ description: e.target.value.substring(0, 1000) }) }
        />

        <div className='field'>
        <div className='control'>
          <label className='label'>Game Version</label>
          <div className='select'>
            <select onChange={ e => { this.setState({ gameVersion: JSON.parse(e.target.value) }) }}>
              <option value='{}'>Select a version</option>
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
          label='Conflicts With'
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
    )
  }
}

export default Form
