import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Layout from '../components/Layout.jsx'

class MainPage extends Component {
  static propTypes = {
    history: PropTypes.any,
    children: PropTypes.node.isRequired,
  }

  render () {
    return (
      <Layout {...this.props} >

        <h1 className='is-size-1 has-text-weight-semibold'>ModSaber</h1>
        <p><i>Beat Saber Mods Database</i></p>

        { this.props.children }
      </Layout>
    )
  }
}

export default MainPage
