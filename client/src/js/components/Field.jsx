import React from 'react'
import PropTypes from 'prop-types'

const Field = props =>
  <div className='field'>
    <div className='control has-icons-left'>
      <input
        className='input'
        type={ props.type }
        placeholder={ props.placeholder }
        onChange={ props.onChange }
        onKeyPress={ e => { if (e.key === 'Enter') { props.onEnter() } } }
        value={ props.value }
      />
      <span className='icon is-small is-left'>
        <i className={ `fas fa-${props.icon}` }></i>
      </span>
    </div>
    <p className='help is-danger' style={{ textAlign: 'center' }}>{ props.prompt }</p>
  </div>

Field.propTypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  prompt: PropTypes.string,
  onChange: PropTypes.func,
  onEnter: PropTypes.func,
}

export default Field
