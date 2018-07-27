import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { BASE_URL } from '../constants.js'
import Field from './Field.jsx'

class Form extends Component {
  render () {
    return (
      <div className='tile box publish-tile'>
        <Field
          label='Mod Name'
        />
      </div>
    )
  }
}

export default Form
