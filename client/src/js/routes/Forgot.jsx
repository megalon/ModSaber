import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'

import { BASE_URL, AUTH } from '../constants.js'
import Layout from '../components/Layout.jsx'
import Field from '../components/Field.jsx'

class Forgot extends Component {
  constructor (props) {
    super(props)

    this.state = {
      email: '',
      error: '',
      loading: false,
      success: false,
    }

    if (this.props.context.loggedIn) this.props.history.replace('')
  }

  static propTypes = {
    context: PropTypes.any,
    history: PropTypes.any,
  }

  async submitForm () {
    this.setState({ loading: true })
    let { email } = this.state

    let body = new URLSearchParams()
    body.set('email', email)

    try {
      let resp = await fetch(`${BASE_URL}/auth/password/reset`, {
        method: 'POST',
        credentials: 'include',
        body,
      })

      console.log(resp)

      if (resp.status === 400) return this.setState({ error: AUTH.INVALID_EMAIL, loading: false })
      if (resp.status === 404) return this.setState({ error: AUTH.UNKNOWN_EMAIL, loading: false })

      this.setState({ loading: false, success: true })
    } catch (err) {
      console.log(err)
      return this.setState({ error: AUTH.ERROR_UNKNOWN, loading: false })
    }
  }

  render () {
    return (
      <Layout history={ this.props.history }>
        <Helmet>
          <title>ModSaber | Forgot Password</title>
        </Helmet>

        <div className='login-container'>
          <div className='tile box login-tile'>
            <h1 className='is-size-4 has-text-weight-semibold has-text-centered'>Forgot Password</h1>
            <br />

            <Field
              placeholder='Email'
              type='email'
              icon='envelope'
              value={ this.state.email }
              prompt={ this.state.error }
              onChange={ e => { this.setState({ email: e.target.value, error: '' }) }}
              onEnter={ () => this.submitForm() }
            />

            <button
              disabled={ this.state.loading || this.state.success }
              className={ `button is-dark is-fullwidth ${this.state.loading ? 'is-loading' : ''}` }
              onClick={ () => this.submitForm() }
            >
              { this.state.success ? 'Email Sent' : 'Send Reset Email' }
            </button>
            <Link className='button has-outline is-fullwidth' to='/login' style={{ marginTop: '8px' }}>Remembered that password?</Link>
          </div>
        </div>
      </Layout>
    )
  }
}

export default Forgot
