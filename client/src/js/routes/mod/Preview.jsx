import React, { Component, Fragment } from 'react'
import { Helmet } from 'react-helmet'
import * as ReactMarkdown from 'react-markdown'
import PropTypes from 'prop-types'

import CodeBlock from '../../components/layout/CodeBlock.jsx'

class Preview extends Component {
  constructor (props) {
    super(props)

    this.state = { text: 'START TYPING TO SEE YOUR PREVIEW' }

    if (this.canUseDOM) {
      window.addEventListener('message', ev => {
        this.setState({ text: ev.data })
      }, false)
    }
  }

  get canUseDOM () {
    let canUseDOM = !!(
      (typeof window !== 'undefined' &&
      window.document && window.document.createElement)
    )
    return canUseDOM
  }

  static propTypes = { history: PropTypes.any }

  render () {
    return (
      <Fragment>
        <Helmet>
          <title>ModSaber | Preview</title>
        </Helmet>

        <div className='container'>
          <h1 className='is-size-1 has-text-weight-semibold'>ModSaber | Preview</h1>
          <hr />

          <div className='content'>
            {
              this.canUseDOM ?
                <ReactMarkdown source={ this.state.text } renderers={{ code: CodeBlock }} /> :
                null
            }
          </div>
        </div>
      </Fragment>
    )
  }
}

export default Preview
