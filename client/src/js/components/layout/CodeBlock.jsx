import React, { Component } from 'react'
import Highlight from 'react-highlight'
import PropTypes from 'prop-types'

import 'highlight.js/styles/atom-one-light.css'

class CodeBlock extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    language: PropTypes.string,
  }

  render () {
    return this.props.language ?
      <Highlight className={ `language-${this.props.language}` }>
        { this.props.value }
      </Highlight> :
      <pre>
        { this.props.value }
      </pre>
  }
}

export default CodeBlock
