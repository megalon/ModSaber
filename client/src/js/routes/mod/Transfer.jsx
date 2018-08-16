import React, { Component, Fragment } from 'react'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'

import { BASE_URL, AUTH, sanitise } from '../../constants.js'
import SweetAlert from '../../components/AsyncSwal.jsx'
import Layout from '../../components/Layout.jsx'
import Field from '../../components/Field.jsx'

class Transfer extends Component {
  constructor (props) {
    super(props)

    this.state = {
      username: '',
      error: '',
      loading: false,

      showModal: false,
    }
  }

  componentDidMount () { this.checkExisting() }

  componentDidUpdate (prevProps) {
    if (this.props.match.params !== prevProps.match.params) this.checkExisting()
  }

  async checkExisting () {
    let { name } = this.props.match.params

    let resp = await fetch(`${BASE_URL}/registry/${name}`)
    if (resp.status === 404) return this.props.history.replace(`/publish/${name}`)

    let body = await resp.json()

    // User doesn't own this mod
    if (!(body.authorID === this.props.context.user.id || this.props.context.user.admin)) this.props.history.replace('')
  }

  static propTypes = {
    history: PropTypes.any,
    match: PropTypes.any,
    context: PropTypes.any,
  }

  showModal () {
    let { username } = this.state
    if (!username) return this.setState({ error: AUTH.INVALID_USERNAME })

    this.setState({ error: '', showModal: true })
  }

  async submitForm () {
    this.setState({ showModal: false, loading: true, error: '' })

    let { name } = this.props.match.params
    let { username } = this.state

    let body = new URLSearchParams()

    body.set('name', name)
    body.set('username', username)

    let resp = await fetch(`${BASE_URL}/api/secure/transfer`, {
      method: 'POST',
      credentials: 'include',
      body,
    })

    if (resp.status === 403) this.setState({ error: AUTH.UNKNOWN_USERNAME, loading: false })

    this.props.history.replace(`/mod/${name}`)
  }

  render () {
    return (
      <Fragment>
        <Layout history={ this.props.history } >
          <Helmet>
            <title>ModSaber | Transfer</title>
          </Helmet>

          <h1 className='is-size-1 has-text-weight-semibold'>Transfer Ownership</h1>
          <br />

          <div className='tile box publish-tile'>
            <Field
              label='Mod Name'
              type='text'
              autoComplete='off'
              autoCapitalize='off'
              value={ this.props.match.params.name }
              disabled
            />

            <Field
              label='Mod Author'
              type='text'
              autoComplete='off'
              autoCapitalize='off'
              placeholder='Username'
              prompt={ this.state.error }
              value={ this.state.username }
              onChange={ e => this.setState({ username: sanitise(e.target.value), error: '', showModal: false }) }
              onEnter={ () => this.showModal() }
            />

            <button
              disabled={ this.state.loading }
              className={ `button is-dark is-fullwidth ${this.state.loading ? 'is-loading' : ''}` }
              onClick={ () => this.showModal() }
            >
              Transfer
            </button>
          </div>
        </Layout>
        <SweetAlert
          show={ this.state.showModal}
          title={ `Transfer ownership of ${this.props.match.params.name}?` }
          text='THIS CANNOT BE UNDONE'
          type='warning'
          showCancelButton
          reverseButtons
          confirmButtonText='Yes'
          cancelButtonText='No'
          confirmButtonColor='#ff3860'
          onConfirm={ () => { this.submitForm() } }
          onCancel={ () => { this.setState({ showModal: false }) } }
          onEscapeKey={ () => { this.setState({ showModal: false }) } }
        />
      </Fragment>
    )
  }
}

export default Transfer
