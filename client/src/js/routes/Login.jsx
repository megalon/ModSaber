import React, { Component } from 'react'
import PropTypes from 'prop-types'

import constants from '../constants.js'
import Layout from '../components/Layout.jsx'
import Field from '../components/Field.jsx'

class Login extends Component {
  constructor (props) {
    super(props)

    this.state = {
      username: '',
      password: '',
      error: '',
    }

    this.context = this.props.context
    if (this.context.loggedIn) this.props.history.push('')
  }

  static propTypes = {
    context: PropTypes.any,
    history: PropTypes.any,
  }

  async submitForm () {
    let { username, password } = this.state

    let body = new URLSearchParams()
    body.set('username', username)
    body.set('password', password)

    try {
      let resp = await fetch(`${constants.BASE_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        body,
      })

      if (resp.status === 400) return this.setState({ error: 'Invalid Username or Password' })
      if (resp.status === 401) return this.setState({ error: 'Incorrect Password' })

      this.context.refresh()
    } catch (err) {
      console.log(err)
      return this.setState({ error: 'Something went wrong...' })
    }
  }

  render () {
    return (
      <Layout>
        <div className='login-container'>
          <div className='tile box login-tile'>
            <h1 className='is-size-4 has-text-weight-semibold has-text-centered'>Login</h1>
            <br />

            <Field
              placeholder='Username'
              type='text'
              icon='user'
              value={ this.state.username }
              onChange={ e => { this.setState({ username: e.target.value, error: '' }) }}
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

            <button className='button is-dark' onClick={ () => this.submitForm() }>Login</button>
          </div>
        </div>
      </Layout>
    )
  }
}

export default Login
