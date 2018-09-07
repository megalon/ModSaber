import React from 'react'
import * as ReactMarkdown from 'react-markdown'
import PropTypes from 'prop-types'

import CodeBlock from '../../components/layout/CodeBlock.jsx'

const MarkdownRenderer = props => {
  // Check for DOM
  const canUseDOM = !!(
    (typeof window !== 'undefined' &&
    window.document && window.document.createElement)
  )
  if (!canUseDOM) return null

  // Render Markdown
  return <ReactMarkdown
    source={ props.source }
    renderers={{ code: CodeBlock, kbd: Keyboard }}
    plugins={ [require('remark-kbd')] }
  />
}

MarkdownRenderer.propTypes = { source: PropTypes.string }

const Keyboard = ({ children }) => <kbd>{ children[0] }</kbd>
Keyboard.propTypes = { children: PropTypes.arrayOf(PropTypes.string).isRequired }

export default MarkdownRenderer
