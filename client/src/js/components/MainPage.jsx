import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import Layout from '../components/Layout.jsx'

class MainPage extends Component {
  static propTypes = {
    history: PropTypes.any,
    children: PropTypes.node.isRequired,
    title: PropTypes.string,
  }

  render () {
    return (
      <Layout {...this.props} >

        <div className='columns'>
          <div className='column is-10'>
            <h1 className='is-size-1 has-text-weight-semibold'>ModSaber { this.props.title ? `// ${this.props.title}` : '' }</h1>
            <p><i>Beat Saber Mods Database</i></p>
          </div>

          <div className='column home-buttons'>
            <Link to='/faq' className='button is-dark is-inverted is-outlined is-control'>FAQ</Link>
            <Link to='/privacy' className='button is-dark is-inverted is-outlined is-control'>Privacy</Link>
          </div>
        </div>

        { this.props.children }
      </Layout>
    )
  }
}

export default MainPage
