import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'

import Layout from '../../components/layout/Layout.jsx'
import ChangeEmail from '../../components/user/ChangeEmail.jsx'
import ChangePassword from '../../components/user/ChangePassword.jsx'

class Settings extends Component {
  static propTypes = {
    context: PropTypes.any,
    history: PropTypes.any,
    match: PropTypes.any,
  }

  componentDidMount () {
    if (!this.props.context.loggedIn) this.props.history.replace('')
  }

  render () {
    return (
      <Layout history={ this.props.history }>
        <Helmet>
          <title>ModSaber | Settings</title>
        </Helmet>

        <h1 className='is-size-1 has-text-weight-semibold'>Account Settings</h1>
        <p><i>Welcome, { this.props.context.user.username }</i></p>
        <hr />

        <div className='content'>
          <div className='columns'>
            <div className='column'>
              <h2>Change Email</h2>
              <ChangeEmail {...this.props} />
            </div>

            <div className='column'>
              <h2>Change Password</h2>
              <ChangePassword {...this.props} />
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}

export default Settings
