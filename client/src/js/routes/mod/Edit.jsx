import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'

import { API_URL, BASE_URL } from '../../constants.js'
import Layout from '../../components/layout/Layout.jsx'
import Field, { FieldArea } from '../../components/form/Field.jsx'

class Edit extends Component {
  constructor (props) {
    super(props)

    this.state = {
      checked: false,
      mod: {},

      title: '',
      description: '',

      error: '',
      loading: false,
      preview: null,
    }

    if (!this.props.context.user.verified) this.props.history.replace('')
  }

  componentDidMount () { this.checkExisting() }

  componentDidUpdate (prevProps) {
    if (this.props.match.params !== prevProps.match.params) this.checkExisting()
  }

  async checkExisting () {
    this.setState({ checked: false, mod: {} })
    let { name, version } = this.props.match.params

    let resp = await fetch(`${BASE_URL}/registry/${name}/${version}`)
    if (resp.status === 404) return this.props.history.replace('')

    let body = await resp.json()

    // User doesn't own this mod
    if (!(body.authorID === this.props.context.user.id || this.props.context.user.admin)) this.props.history.replace('')
    this.setState({ checked: true, mod: body, title: body.title, description: body.description })
  }

  isError (error) {
    this.setState({ error, loading: false })
    return true
  }

  showPreviewWindow () {
    if (this.state.preview) this.state.preview.close()
    let preview = window.open('/preview', '', 'menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes,width=1280,height=720')
    this.setState({ preview })
  }

  updateDescription (text) {
    this.setState({ description: text, error: '' })

    let { preview } = this.state
    if (!preview) return false

    preview.postMessage(text, '*')
  }

  async submitForm () {
    let { title, description } = this.state
    let { name, version } = this.props.match.params

    if (!title) return this.isError('Title cannot be blank')
    if (!description) return this.isError('Description cannot be blank')

    this.setState({ error: '', loading: true })

    let body = new URLSearchParams()
    body.set('name', name)
    body.set('version', version)
    body.set('title', title)
    body.set('description', description)

    let resp = await fetch(`${API_URL}/files/edit`, {
      method: 'POST',
      credentials: 'include',
      body,
    })

    if (resp.status !== 200) return this.isError('Something went wrong.')
    setTimeout(() => {
      // Sometimes needs time to finish
      this.props.history.push(`/mod/${name}/${version}`)
    }, 1000)
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
          <title>ModSaber | Edit</title>
        </Helmet>

        <h1 className='is-size-1 has-text-weight-semibold'>Edit a Mod</h1>
        <p><i>Fix that description because Markdown is hard</i></p>
        <hr />

        {
          !this.state.checked ? null :
            <div className='tile box publish-tile'>
              <Field
                label='Mod Name'
                type='text'
                value={ this.state.mod.name }
                disabled
              />

              <Field
                label='Version'
                type='text'
                disabled
                value={ this.state.mod.version }
              />

              <Field
                label='Mod Title'
                type='text'
                autofocus
                autoComplete='off'
                placeholder='Mod Title. Shown on pages and in the mod installer.'
                prompt={ this.state.error }
                value={ this.state.title }
                onChange={ e => this.setState({ title: e.target.value.substring(0, 50), error: '' }) }
              />

              <label className='label' style={{ marginBottom: '0' }}>
                Description <a onClick={ () => this.showPreviewWindow() }>[OPEN PREVIEW]</a>
              </label>
              <FieldArea
                type='text'
                placeholder='Long description text. Supports Markdown.'
                value={ this.state.description }
                onChange={ e => this.updateDescription(e.target.value.substring(0, 10000)) }
              />

              <button
                disabled={ this.state.loading }
                className={ `button is-dark is-fullwidth ${this.state.loading ? 'is-loading' : ''}` }
                onClick={ () => this.submitForm() }
              >
                Edit
              </button>
            </div>
        }
      </Layout>
    )
  }
}

export default Edit
