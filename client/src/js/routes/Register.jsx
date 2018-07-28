import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'

import { BASE_URL, AUTH, sanitise } from '../constants.js'
import Layout from '../components/Layout.jsx'
import Field from '../components/Field.jsx'

class Login extends Component {
  constructor (props) {
    super(props)

    this.state = {
      username: '',
      email: '',
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
  }

  async submitForm () {
    let { username, email, password, passwordConfirm } = this.state

    if (!username) return this.setState({ error: AUTH.INVALID_USERNAME, loading: false })
    if (!email) return this.setState({ error: AUTH.INVALID_EMAIL, loading: false })
    if (!password) return this.setState({ error: AUTH.INVALID_PASSWORD, loading: false })
    if (password !== passwordConfirm) return this.setState({ error: AUTH.PASSWORD_MISMATCH, loading: false })
    this.setState({ loading: true })

    let body = new URLSearchParams()
    body.set('username', username)
    body.set('email', email)
    body.set('password', password)

    try {
      let resp = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        credentials: 'include',
        body,
      })

      if (resp.status === 400) {
        let { error, fields } = await resp.json()

        if (error === 'MissingUsernameError') return this.setState({ error: AUTH.INVALID_USERNAME, loading: false })
        if (error === 'MissingPasswordError') return this.setState({ error: AUTH.INVALID_PASSWORD, loading: false })
        if (error === 'ValidationError') {
          let [field] = Object.keys(fields)

          if (field === 'email') return this.setState({ error: AUTH.INVALID_EMAIL, loading: false })
          else return this.setState({ error: AUTH.ERROR_UNKNOWN, loading: false })
        }

        return false
      }

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
          <title>ModSaber | Register</title>
        </Helmet>

        <div className='login-container'>
          <div className='tile box login-tile'>
            <h1 className='is-size-4 has-text-weight-semibold has-text-centered'>Register</h1>
            <br />

            <Field
              placeholder='Username'
              type='text'
              icon='user'
              value={ this.state.username }
              onChange={ e => { this.setState({ username: sanitise(e.target.value), error: '' }) }}
              onEnter={ () => this.submitForm() }
            />

            <Field
              placeholder='Email'
              type='email'
              icon='envelope'
              value={ this.state.email }
              onChange={ e => { this.setState({ email: e.target.value, error: '' }) }}
              onEnter={ () => this.submitForm() }
            />

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
              prompt={ this.state.error }
              value={ this.state.passwordConfirm }
              onChange={ e => { this.setState({ passwordConfirm: e.target.value, error: '' }) }}
              onEnter={ () => this.submitForm() }
            />

            <button
              disabled={ this.state.loading }
              className={ `button is-dark is-fullwidth ${this.state.loading ? 'is-loading' : ''}` }
              onClick={ () => this.submitForm() }
            >
              Register
            </button>
            <Link className='button has-outline is-fullwidth' to='/login' style={{ marginTop: '8px' }}>Already have an account?</Link>
          </div>
        </div>
      </Layout>
    )
  }
}

export default Login
