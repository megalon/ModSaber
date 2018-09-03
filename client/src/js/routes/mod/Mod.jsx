import React, { Component, Fragment } from 'react'
import * as ReactMarkdown from 'react-markdown'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import { BASE_URL } from '../../constants.js'

import NotFound from '../NotFound.jsx'
import SweetAlert from '../../components/hoc/AsyncSwal.jsx'
import Layout from '../../components/layout/Layout.jsx'
import CodeBlock from '../../components/layout/CodeBlock.jsx'
import modMetaTags from '../../components/layout/ModMetaTags.jsx'

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

      gameVersions: [],
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
    const moment = await import('moment')

    this.setState({ loaded: false })
    let { name, version } = this.props.match.params
    let resp = await fetch(`${BASE_URL}/registry/${name}/${version ? version : ''}`)

    if (resp.status !== 200) return this.setState({ loaded: true, mod: {} })

    let mod = await resp.json()
    mod.timestamp = moment(mod.published).format('YYYY-MM-DD hh:mm:ss ZZ')

    this.setState({ mod, loaded: true }, () => this.checkUser())
  }

  checkUser () {
    let showControls = this.props.context.user.id === this.state.mod.authorID ||
      this.props.context.user.admin
    this.setState({ showControls }, () => this.fetchGameVersions())
  }

  async fetchGameVersions () {
    let gameVersions = await (await fetch(`${BASE_URL}/api/public/gameversions`, { credentials: 'include' })).json()
    this.setState({ gameVersions })
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

  async setWeight () {
    let { mod } = this.state

    let input = prompt('Enter weight: (higher values are sorted at the top)', `${mod.weight}`)
    let weight = parseInt(input, 10)

    if (Number.isNaN(weight)) return alert('Invalid Weight')

    let body = new URLSearchParams()
    body.set('weight', weight)

    await fetch(`${BASE_URL}/api/secure/weight/${mod.name}/${mod.version}`, {
      method: 'POST',
      credentials: 'include',
      body,
    })

    mod.weight = weight
    this.setState({ mod })
  }

  async setCategory () {
    let { mod } = this.state

    let category = prompt('Enter weight: (higher values are sorted at the top)', `${mod.category}`)

    if (category.length > 25) return alert('Category must be less than 25 characters!')

    let body = new URLSearchParams()
    body.set('category', category)

    await fetch(`${BASE_URL}/api/secure/category/${mod.name}/${mod.version}`, {
      method: 'POST',
      credentials: 'include',
      body,
    })

    mod.category = category
    this.setState({ mod })
  }

  render () {
    if (this.state.loaded && this.state.mod.name === undefined) return <NotFound history={ this.props.history } />

    let { mod } = this.state
    let isLatest = this.state.gameVersions[0] ?
      mod.gameVersion === this.state.gameVersions[0].value :
      false

    const canUseDOM = !!(
      (typeof window !== 'undefined' &&
      window.document && window.document.createElement)
    )

    return (
      <Fragment>
        <Layout history={ this.props.history } >
          {
            this.state.loaded ?
              modMetaTags(mod.name, mod.version, mod.author, mod.title) :
              null
          }

          <div className='mod-titles'>
            <h1 className='is-size-1 has-text-weight-semibold'>{ mod.title }</h1>
            <span style={{ marginLeft: '20px', marginTop: '15px' }} className='tag is-link'>{ mod.type }</span>
            {
              mod.approved ? null :
                <span style={{ marginLeft: '8px', marginTop: '15px' }} className='tag is-danger'>UNAPPROVED</span>
            }
          </div>
          <code style={{ color: '#060606' }}>{ mod.name }@{ mod.version } &#47;&#47; { mod.author }</code>&nbsp;
          <code style={{ color: '#060606' }}>{ mod.timestamp }</code>
          <br style={{ lineHeight: '2em' }} />
          <code style={{ color: isLatest ? '#060606' : '', fontWeight: isLatest ? '' : 'bold' }}>{ mod.gameVersion }</code>&nbsp;
          <code style={{ color: '#060606' }}>{ mod.category || 'Other' }</code>
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
                      <Link to={ `/edit/${mod.name}/${mod.version}` } className='button is-info is-control'>Edit</Link>
                      <Link to={ `/publish/${mod.name}` } className='button is-info is-control'>Publish new Version</Link>

                      {
                        !this.props.context.user.admin ? null :
                          <Fragment>
                            <button
                              className='button is-warning is-control'
                              onClick={ () => this.setWeight() }
                            >Set Weight</button>
                            <button
                              className='button is-warning is-control'
                              onClick={ () => this.setCategory() }
                            >Set Category</button>
                            <button
                              className='button is-warning is-control'
                              onClick={ () => this.toggleApproval() }
                            >{ mod.approved ? 'Revoke Approval' : 'Approve' }</button>
                          </Fragment>
                      }

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
                {
                  canUseDOM ?
                    <ReactMarkdown source={ mod.description } renderers={{ code: CodeBlock }} /> :
                    null
                }
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
