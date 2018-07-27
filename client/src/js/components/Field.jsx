import React from 'react'
import PropTypes from 'prop-types'

const Field = props =>
  <div className='field'>
    <label className='label'>{ props.label }</label>
    <div className={ `control ${props.icon ? 'has-icons-left' : ''}` }>
      <input
        className='input'
        type={ props.type }
        placeholder={ props.placeholder }
        disabled={ props.disabled }
        onChange={ props.onChange }
        onKeyPress={ e => { if (e.key === 'Enter') { props.onEnter() } } }
        value={ props.value }
      />
      {
        props.icon ?
          <span className='icon is-small is-left'><i className={ `fas fa-${props.icon}` }></i></span> :
          null
      }
    </div>
    <p className='help is-danger' style={{ textAlign: 'center' }}>{ props.prompt }</p>
  </div>

Field.propTypes = {
  value: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string.isRequired,
  icon: PropTypes.string,
  prompt: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  onEnter: PropTypes.func,
}

export default Field

export const FieldArea = props =>
  <div className='field'>
    <label className='label'>{ props.label }</label>
    <div className='control'>
      <textarea
        className='textarea'
        type={ props.type }
        placeholder={ props.placeholder }
        disabled={ props.disabled }
        onChange={ props.onChange }
        value={ props.value }
      />
    </div>
    <p className='help is-danger' style={{ textAlign: 'center' }}>{ props.prompt }</p>
  </div>

FieldArea.propTypes = {
  value: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string.isRequired,
  prompt: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
}
