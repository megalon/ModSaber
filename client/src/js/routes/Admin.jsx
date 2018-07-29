import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'

import Layout from '../components/Layout.jsx'
import AddGameVersion from '../components/AddGameVersion.jsx'
import ManageAdmins from '../components/ManageAdmins.jsx'

class Admin extends Component {
  static propTypes = {
    context: PropTypes.any,
    history: PropTypes.any,
    match: PropTypes.any,
  }

  componentDidMount () {
    if (!this.props.context.user.admin) this.props.history.replace('')
  }

  render () {
    return (
      <Layout history={ this.props.history }>
        <Helmet>
          <title>ModSaber | Admin</title>
        </Helmet>

        <h1 className='is-size-1 has-text-weight-semibold'>Admin Panel</h1>
        <p><i>Welcome, { this.props.context.user.username }</i></p>
        <hr />

        <div className='content'>
          <div className='columns'>
            <div className='column'>
              <h2>Manage Admins</h2>
              <ManageAdmins {...this.props} />
            </div>

            <div className='column'>
              <h2>Add Game Version</h2>
              <AddGameVersion {...this.props} />
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}

export default Admin
