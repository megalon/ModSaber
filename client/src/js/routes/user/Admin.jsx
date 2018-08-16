import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'

import Layout from '../../components/layout/Layout.jsx'
import AddGameVersion from '../../components/admin/AddGameVersion.jsx'
import ViewPending from '../../components/admin/ManageAdmins.jsx'
import ManageAdmins from '../../components/admin/ViewPending.jsx'

class Admin extends Component {
  constructor (props) {
    super(props)

    this.state = { manage: false }
  }

  static propTypes = {
    context: PropTypes.any,
    history: PropTypes.any,
    match: PropTypes.any,
  }

  componentDidMount () {
    if (!this.props.context.user.admin) this.props.history.replace('')
  }

  toggleState () {
    let manage = !this.state.manage
    this.setState({ manage })
  }

  render () {
    return (
      <Layout history={ this.props.history }>
        <Helmet>
          <title>ModSaber | Admin</title>
        </Helmet>

        <div className='columns'>
          <div className='column is-10'>
            <h1 className='is-size-1 has-text-weight-semibold'>Admin Panel</h1>
            <p><i>Beat Saber Mods Database</i></p>
          </div>

          <div className='column home-buttons'>
            <button className='button is-dark is-inverted is-outlined is-control' onClick={ () => this.toggleState() }>
              { this.state.manage ? 'View Pending Mods' : 'Manage Admins' }
            </button>
          </div>
        </div>
        <hr />

        <div className='content'>
          <div className='columns'>
            <div className='column'>
              <h2>{ !this.state.manage ? 'View Pending Mods' : 'Manage Admins' }</h2>
              {
                this.state.manage ?
                  <ViewPending {...this.props} /> :
                  <ManageAdmins {...this.props} />
              }
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
