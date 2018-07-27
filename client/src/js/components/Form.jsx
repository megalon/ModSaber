import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { BASE_URL, sanitise } from '../constants.js'
import Field, { FieldArea } from './Field.jsx'

class Form extends Component {
  constructor (props) {
    super(props)

    console.log(this.props.details)

    this.state = {
      name: this.props.details.name || '',
      version: '',
      title: '',
      description: '',
      gameVersion: '',
      dependsOn: [],
      conflictsWith: [],

      gameVersions: [],
    }
  }

  static propTypes = {
    details: PropTypes.any,
    new: PropTypes.bool.isRequired,
  }

  componentDidMount () {
    
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
          value={ this.state.version }
          disabled={ !this.props.new }
          onChange={ e => this.setState({ version: e.target.value }) }
        />

        <Field
          label='Mod Title'
          type='text'
          value={ this.state.title }
          disabled={ !this.props.new }
          onChange={ e => this.setState({ title: e.target.value.substring(0, 50) }) }
        />

        <FieldArea
          label='Description'
          type='text'
          value={ this.state.description }
          disabled={ !this.props.new }
          onChange={ e => this.setState({ description: e.target.value.substring(0, 1000) }) }
        />
      </div>
    )
  }
}

export default Form
