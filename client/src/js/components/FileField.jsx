import React, { Component } from 'react'
import PropTypes from 'prop-types'

class FileField extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    isHidden: PropTypes.bool,
    node: PropTypes.any.isRequired,
    onChange: PropTypes.func.isRequired,
    file: PropTypes.any.isRequired,
  }

  render () {
    return (
      <div className={ `file has-name is-fullwidth ${this.props.isHidden ? 'is-invis' : ''}` } style={{ marginBottom: '10px' }}>
        <label className='file-label'>
          <input
            className='file-input'
            type='file'
            accept='.zip'
            ref={ this.props.node }
            onChange={ this.props.onChange }
          />
          <span className='file-cta'>
            <span className='file-icon'><i className='fas fa-upload'></i></span>
            <span className='file-label'>{ this.props.name }</span>
          </span>
          <span className='file-name'>{ this.props.file.name }</span>
        </label>
      </div>
    )
  }
}

export default FileField
