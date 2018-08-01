import React, { Component, Fragment } from 'react'
import * as ReactMarkdown from 'react-markdown'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import { BASE_URL } from '../constants.js'

import NotFound from './NotFound.jsx'
import SweetAlert from '../components/AsyncSwal.jsx'
import Layout from '../components/Layout.jsx'

class Mod extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loaded: false,
      mod: {},
      showControls: false,

      showModal: false,
      modalTitle: '',
      modalText: '',
      modalType: 'warning',
      modalConfirm: null,
    }
  }

  static propTypes = {
    history: PropTypes.any,
    match: PropTypes.any,
    context: PropTypes.any,
  }

  componentDidMount () { this.loadData() }

  componentDidUpdate (prevProps) {
    if (this.props.match.params !== prevProps.match.params) this.loadData()
  }

  showModal (title, text, type, onConfirm) {
    this.setState({ modalTitle: title, modalText: text, modalType: type, modalConfirm: onConfirm }, () => {
      this.setState({ showModal: true })
    })
  }

  async unpublish () {
    let { name, version } = this.state.mod
    let body = new URLSearchParams()

    body.set('name', name)
    body.set('version', version)

    await fetch(`${BASE_URL}/api/secure/unpublish`, {
      method: 'POST',
      credentials: 'include',
      body,
    })

    this.setState({ showModal: false })
    this.props.history.replace(`/mod/${name}`)
  }

  async loadData () {
    this.setState({ loaded: false })
    let { name, version } = this.props.match.params
    let resp = await fetch(`${BASE_URL}/registry/${name}/${version ? version : ''}`)

    if (resp.status !== 200) return this.setState({ loaded: true, mod: {} })

    let mod = await resp.json()
    this.setState({ mod, loaded: true }, () => this.checkUser())
  }

  checkUser () {
    let showControls = this.props.context.user.id === this.state.mod.authorID ||
      this.props.context.user.admin
    this.setState({ showControls })
  }

  async toggleApproval () {
    let { mod } = this.state
    await fetch(`${BASE_URL}/api/secure/${mod.approved ? 'revoke' : 'approve'}/${mod.name}/${mod.version}`, {
      method: 'POST',
      credentials: 'include',
    })

    mod.approved = !mod.approved
    this.setState({ mod })
  }

  render () {
    if (this.state.loaded && this.state.mod.name === undefined) return <NotFound history={ this.props.history } />

    let { mod } = this.state
    return (
      <Fragment>
        <Layout history={ this.props.history } >
          <Helmet>
            <title>{ `ModSaber | ${mod.title}@${mod.version}` }</title>
          </Helmet>

          <div className='mod-titles'>
            <h1 className='is-size-1 has-text-weight-semibold'>{ mod.title }</h1>
            <span style={{ marginLeft: '20px', marginTop: '15px' }} className='tag is-link'>{ mod.tag }</span>
            {
              mod.approved ? null :
                <span style={{ marginLeft: '8px', marginTop: '15px' }} className='tag is-danger'>UNAPPROVED</span>
            }
          </div>
          <code style={{ color: '#060606' }}>{ mod.name }@{ mod.version } &#47;&#47; { mod.author }</code>
          <hr />

          <div className='content'>
            <div className='columns reverse-row-order'>
              <div className='column'>
                {
                  !mod.files ? null : Object.entries(mod.files).map(([key, value], i, arr) =>
                    <a
                      key={ i }
                      href={ value.url }
                      className='button is-link is-control'
                    >
                    Download{ arr.length > 1 ? ` (${key.toUpperCase()})` : '' }
                    </a>
                  )
                }
                {
                  !this.state.showControls ? null :
                    <Fragment>
                      <Link to={ `/publish/${mod.name}` } className='button is-info is-control'>Publish new Version</Link>
                      <button
                        className='button is-warning is-control'
                        onClick={ () => this.toggleApproval() }
                      >{ mod.approved ? 'Revoke Approval' : 'Approve' }</button>
                      <Link to={ `/transfer/${mod.name}` } className='button is-warning is-control'>Transfer Ownership</Link>
                      <button
                        className='button is-danger is-control'
                        onClick={ () => {
                          this.showModal(`Unpublish ${this.state.mod.name}@${this.state.mod.version} ?`,
                            'THIS CANNOT BE UNDONE', 'warning',
                            () => { this.unpublish() }
                          )
                        } }
                      >Unpublish</button>
                    </Fragment>
                }
              </div>

              <div className='column is-10'>
                <ReactMarkdown source={ mod.description } />
              </div>
            </div>
          </div>
        </Layout>
        <SweetAlert
          key='alert'
          show={ this.state.showModal }
          title={ this.state.modalTitle }
          text={ this.state.modalText }
          type={ this.state.modalType }
          showCancelButton
          reverseButtons
          confirmButtonText='Yes'
          cancelButtonText='No'
          confirmButtonColor='#ff3860'
          onConfirm={ () => { this.state.modalConfirm() } }
          onCancel={ () => { this.setState({ showModal: false }) } }
          onEscapeKey={ () => { this.setState({ showModal: false }) } }
        />

      </Fragment>
    )
  }
}

export default Mod
