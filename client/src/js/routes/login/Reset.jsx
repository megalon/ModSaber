import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'

import { BASE_URL, AUTH } from '../../constants.js'
import Layout from '../../components/Layout.jsx'
import Field from '../../components/Field.jsx'

class Reset extends Component {
  constructor (props) {
    super(props)

    this.state = {
      password: '',
      passwordConfirm: '',
      error: '',
      loading: false,
    }

    if (this.props.context.loggedIn) this.props.history.replace('')
  }

  static propTypes = {
    context: PropTypes.any,
    history: PropTypes.any,
    match: PropTypes.any,
  }

  async submitForm () {
    let { password, passwordConfirm } = this.state
    let { username, resetToken } = this.props.match.params

    if (password !== passwordConfirm) return this.setState({ error: AUTH.PASSWORD_MISMATCH, loading: false })
    this.setState({ loading: true })

    let body = new URLSearchParams()
    body.set('username', username)
    body.set('newPassword', password)
    body.set('resetToken', resetToken)

    try {
      let resp = await fetch(`${BASE_URL}/auth/reset`, {
        method: 'POST',
        credentials: 'include',
        body,
      })

      if (resp.status === 401) return this.setState({ error: AUTH.INVALID_RESET_TOKEN, loading: false })

      this.props.context.refresh()
      this.props.history.replace('')
    } catch (err) {
      console.log(err)
      return this.setState({ error: AUTH.ERROR_UNKNOWN, loading: false })
    }
  }

  render () {
    return (
      <Layout history={ this.props.history }>
        <Helmet>
          <title>ModSaber | Reset Password</title>
        </Helmet>

        <div className='login-container'>
          <div className='tile box login-tile'>
            <h1 className='is-size-4 has-text-weight-semibold has-text-centered'>Reset Password</h1>
            <br />

            <Field
              placeholder='Password'
              type='password'
              icon='lock'
              value={ this.state.password }
              onChange={ e => { this.setState({ password: e.target.value, error: '' }) }}
              onEnter={ () => this.submitForm() }
            />

            <Field
              placeholder='Password Confirmation'
              type='password'
              icon='lock'
              value={ this.state.passwordConfirm }
              prompt={ this.state.error }
              onChange={ e => { this.setState({ passwordConfirm: e.target.value, error: '' }) }}
              onEnter={ () => this.submitForm() }
            />

            <button
              disabled={ this.state.loading || this.state.success }
              className={ `button is-dark is-fullwidth ${this.state.loading ? 'is-loading' : ''}` }
              onClick={ () => this.submitForm() }
            >
              Reset Password
            </button>
          </div>
        </div>
      </Layout>
    )
  }
}

export default Reset
