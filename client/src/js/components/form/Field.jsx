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
        autoFocus={ props.autofocus }
        disabled={ props.disabled }
        onChange={ props.onChange }
        onKeyPress={ e => { if (e.key === 'Enter') { props.onEnter() } } }
        value={ props.value }
        autoComplete={ props.autoComplete }
        autoCapitalize={ props.autoCapitalize }
      />
      {
        props.icon ?
          <span className='icon is-small is-left'><i className={ `fas fa-${props.icon}` }></i></span> :
          null
      }
    </div>
    <p className='help is-danger' style={{ textAlign: props.centerPrompt ? 'center' : '' }}>{ props.prompt }</p>
  </div>

Field.propTypes = {
  value: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  autofocus: PropTypes.bool,
  type: PropTypes.string.isRequired,
  icon: PropTypes.string,
  prompt: PropTypes.string,
  centerPrompt: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  onEnter: PropTypes.func,
  autoComplete: PropTypes.string,
  autoCapitalize: PropTypes.string,
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
    <p className='help is-danger' style={{ textAlign: props.centerPrompt ? 'center' : '' }}>{ props.prompt }</p>
  </div>

FieldArea.propTypes = {
  value: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string.isRequired,
  prompt: PropTypes.string,
  centerPrompt: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
}

export const FieldAddon = props =>
  <div className='field is-expanded' style={{ marginTop: props.isChild ? '-12px' : '' }}>
    <label className='label'>{ props.label }</label>
    <div className={ `field ${props.button ? 'has-addons' : ''}` }>
      <div className='control is-fullwidth'>
        <input
          className='input'
          type={ props.type }
          placeholder={ props.placeholder }
          disabled={ props.disabled }
          readOnly={ props.readOnly }
          onChange={ props.onChange }
          onKeyPress={ e => { if (e.key === 'Enter') { props.onEnter() } } }
          value={ props.value }
          autoComplete={ props.autoComplete }
          autoCapitalize={ props.autoCapitalize }
        />
      </div>
      <div className='control'>
        <a className={ `button ${props.buttonClass}` } onClick={ props.onButtonPress }>
          { props.button }
        </a>
      </div>
    </div>
    <p className='help is-danger' style={{ marginTop: '-10px' }}>{ props.prompt }</p>
  </div>

FieldAddon.propTypes = {
  value: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string.isRequired,
  button: PropTypes.string,
  buttonClass: PropTypes.string,
  onButtonPress: PropTypes.func,
  isChild: PropTypes.bool,
  prompt: PropTypes.string,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  onChange: PropTypes.func,
  onEnter: PropTypes.func,
  autoComplete: PropTypes.string,
  autoCapitalize: PropTypes.string,
}
