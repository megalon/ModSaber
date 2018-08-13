import React from 'react'
import PropTypes from 'prop-types'

const FileField = props =>
  <div className={ `file has-name is-fullwidth ${props.isHidden ? 'is-invis' : ''}` } style={{ marginBottom: '10px' }}>
    <label className='file-label'>
      <input
        className='file-input'
        type='file'
        accept='.zip'
        ref={ props.node }
        onChange={ props.onChange }
      />
      <span className='file-cta'>
        <span className='file-icon'><i className='fas fa-upload'></i></span>
        <span className='file-label'>{ props.name }</span>
      </span>
      <span className='file-name'>{ props.file.name }</span>
    </label>
  </div>

FileField.propTypes = {
  name: PropTypes.string.isRequired,
  isHidden: PropTypes.bool,
  node: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  file: PropTypes.any.isRequired,
}

export default FileField
