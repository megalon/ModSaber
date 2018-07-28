import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { BASE_URL, AUTH } from '../constants.js'
import Field from './Field.jsx'

class ChangeEmail extends Component {
  constructor (props) {
    super(props)

    this.state = {
      email: '',
      password: '',

      error: '',
      loading: false,
      success: false,
    }
  }

  static propTypes = {
    context: PropTypes.any,
    history: PropTypes.any,
    match: PropTypes.any,
  }

  async submitForm () {
    this.setState({ success: false, error: '' })
    let { email, password } = this.state

    if (!email) return this.setState({ error: AUTH.INVALID_EMAIL })
    if (!password) return this.setState({ error: AUTH.INVALID_PASSWORD })

    this.setState({ loading: true })

    let body = new URLSearchParams()
    body.set('email', email)
    body.set('password', password)

    let resp = await fetch(`${BASE_URL}/auth/email/change`, {
      method: 'POST',
      credentials: 'include',
      body,
    })

    if (resp.status === 401) return this.setState({ loading: false, error: AUTH.INCORRECT_PASSWORD })

    this.setState({
      loading: false,
      success: true,
      email: '',
      password: '',
    })

    this.props.context.refresh()
  }

  render () {
    return (
      <div className='tile box publish-tile'>
        <Field
          label='New Email'
          type='email'
          placeholder='New Email'
          icon='envelope'
          value={ this.state.email }
          onChange={ e => this.setState({ email: e.target.value, success: false }) }
          onEnter={ () => this.submitForm() }
        />

        <Field
          label='Current Passsword'
          type='password'
          placeholder='Current Passsword'
          icon='lock'
          prompt={ this.state.error }
          value={ this.state.password }
          onChange={ e => this.setState({ password: e.target.value, success: false }) }
          onEnter={ () => this.submitForm() }
        />

        <button
          className={ `button is-dark is-control ${this.state.loading ? 'is-loading' : ''}` }
          disabled={ this.state.loading || this.state.success }
          onClick={ () => this.submitForm() }
        >
          { this.state.success ? 'Email Changed' : 'Change Email' }
        </button>
      </div>
    )
  }
}

export default ChangeEmail
