import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'

import { BASE_URL } from '../constants.js'
import Layout from '../components/Layout.jsx'
import Form from '../components/Form.jsx'

class Publish extends Component {
  constructor (props) {
    super(props)

    this.state = {
      checked: false,
      new: true,
      existing: {},
    }
  }

  componentDidMount () { this.checkExisting() }

  async checkExisting () {
    let { name } = this.props.match.params
    if (!name) return this.setState({ checked: true })

    let resp = await fetch(`${BASE_URL}/registry/${name}`)
    if (resp.status === 404) return this.setState({ checked: true, existing: { name } })

    let body = await resp.json()

    // User doesn't own this mod
    if (body.authorID !== this.props.context.user.id) this.props.history.push('')
    this.setState({ checked: true, new: false, existing: body })
  }

  static propTypes = {
    history: PropTypes.any,
    match: PropTypes.any,
    context: PropTypes.any,
  }

  render () {
    return (
      <Layout history={ this.props.history } >
        <Helmet>
          <title>ModSaber | Publish</title>
        </Helmet>

        <h1 className='is-size-1 has-text-weight-semibold'>{ this.state.new ? 'Publish a Mod' : 'Publish an Update' }</h1>
        <br />

        { this.state.checked ? <Form details={ this.state.existing } new={ this.state.new } history={ this.props.history } /> : null }
      </Layout>
    )
  }
}

export default Publish
