import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { BASE_URL, AUTH } from '../constants.js'
import Field from './Field.jsx'

class ChangePassword extends Component {
  constructor (props) {
    super(props)

    this.state = {
      oldPassword: '',
      newPassword: '',
      newPasswordConfirm: '',

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
    let { oldPassword, newPassword, newPasswordConfirm } = this.state

    if (!(!!oldPassword || !!newPassword || !!newPasswordConfirm)) return this.setState({ error: AUTH.MISSING_PASSWORDS })
    if (newPassword !== newPasswordConfirm) return this.setState({ error: AUTH.PASSWORD_MISMATCH })

    this.setState({ loading: true })

    let body = new URLSearchParams()
    body.set('oldPassword', oldPassword)
    body.set('newPassword', newPassword)

    let resp = await fetch(`${BASE_URL}/auth/password/change`, {
      method: 'POST',
      credentials: 'include',
      body,
    })

    if (resp.status === 401) return this.setState({ loading: false, error: AUTH.INCORRECT_PASSWORD })

    this.setState({
      loading: false,
      success: true,
      oldPassword: '',
      newPassword: '',
      newPasswordConfirm: '',
    })
  }

  render () {
    return (
      <div className='tile box publish-tile'>
        <Field
          label='Old Password'
          type='password'
          placeholder='Old Password'
          icon='lock'
          value={ this.state.oldPassword }
          onChange={ e => this.setState({ oldPassword: e.target.value, success: false }) }
          onEnter={ () => this.submitForm() }
        />

        <Field
          label='New Password'
          type='password'
          placeholder='New Password'
          icon='lock'
          value={ this.state.newPassword }
          onChange={ e => this.setState({ newPassword: e.target.value, success: false }) }
          onEnter={ () => this.submitForm() }
        />

        <Field
          label='New Password Confirmation'
          type='password'
          placeholder='New Password Confirmation'
          icon='lock'
          prompt={ this.state.error }
          value={ this.state.newPasswordConfirm }
          onChange={ e => this.setState({ newPasswordConfirm: e.target.value, success: false }) }
          onEnter={ () => this.submitForm() }
        />

        <button
          className={ `button is-dark is-control ${this.state.loading ? 'is-loading' : ''}` }
          disabled={ this.state.loading || this.state.success }
          onClick={ () => this.submitForm() }
        >
          { this.state.success ? 'Password Changed' : 'Change Password' }
        </button>
      </div>
    )
  }
}

export default ChangePassword
