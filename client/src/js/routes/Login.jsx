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
      password: '',
      error: '',
      loading: false,
    }

    if (this.props.context.loggedIn) this.props.history.push('')
  }

  static propTypes = {
    context: PropTypes.any,
    history: PropTypes.any,
  }

  async submitForm () {
    this.setState({ loading: true })
    let { username, password } = this.state

    let body = new URLSearchParams()
    body.set('username', username)
    body.set('password', password)

    try {
      let resp = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        body,
      })

      if (resp.status === 400) return this.setState({ error: AUTH.INVALID_EITHER, loading: false })
      if (resp.status === 401) return this.setState({ error: AUTH.INCORRECT_PASSWORD, loading: false })

      this.props.context.refresh()
      this.props.history.push('')
    } catch (err) {
      console.log(err)
      return this.setState({ error: AUTH.ERROR_UNKNOWN, loading: false })
    }
  }

  render () {
    return (
      <Layout history={ this.props.history }>
        <Helmet>
          <title>ModSaber | Login</title>
        </Helmet>

        <div className='login-container'>
          <div className='tile box login-tile'>
            <h1 className='is-size-4 has-text-weight-semibold has-text-centered'>Login</h1>
            <br />

            <Field
              placeholder='Username'
              type='text'
              icon='user'
              autoCapitalize='off'
              value={ this.state.username }
              onChange={ e => { this.setState({ username: sanitise(e.target.value), error: '' }) }}
              onEnter={ () => this.submitForm() }
            />

            <Field
              placeholder='Password'
              type='password'
              icon='lock'
              prompt={ this.state.error }
              value={ this.state.password }
              onChange={ e => { this.setState({ password: e.target.value, error: '' }) }}
              onEnter={ () => this.submitForm() }
            />

            <button
              disabled={ this.state.loading }
              className={ `button is-dark is-fullwidth ${this.state.loading ? 'is-loading' : ''}` }
              onClick={ () => this.submitForm() }
            >
              Login
            </button>
            <Link className='button has-outline is-fullwidth' to='/forgot' style={{ marginTop: '8px' }}>Forgot password?</Link>
            <Link className='button has-outline is-fullwidth' to='/register' style={{ marginTop: '8px' }}>Don&#39;t have an account?</Link>
          </div>
        </div>
      </Layout>
    )
  }
}

export default Login
